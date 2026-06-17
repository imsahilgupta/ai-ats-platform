const mockInterviewSessionModel = require("../models/mockInterviewSession.model");
const subscriptionModel = require("../models/subscription.model");
const userProgressModel = require("../models/userProgress.model");
const geminiService = require("../services/gemini.services");

/**
 * Award XP to user and handle leveling up
 */
async function awardUserXP(userId, amount) {
    try {
        let progress = await userProgressModel.findOne({ user: userId });
        if (!progress) {
            progress = await userProgressModel.create({ user: userId, xp: 0, level: 1 });
        }
        progress.xp += amount;
        const targetLevel = Math.floor(progress.xp / 1000) + 1;
        
        let leveledUp = false;
        if (targetLevel > progress.level) {
            progress.level = targetLevel;
            leveledUp = true;
            progress.badges.push({
                name: `Level ${targetLevel} Master`,
                icon: "🚀",
                description: `Reached Level ${targetLevel} in career prep.`,
                dateEarned: new Date()
            });
        }
        
        // Award badges for milestone tasks
        if (progress.xp >= 500 && !progress.badges.some(b => b.name === "Interview Rookie")) {
            progress.badges.push({
                name: "Interview Rookie",
                icon: "🥉",
                description: "Earned 500 XP total.",
                dateEarned: new Date()
            });
        }
        if (progress.xp >= 2000 && !progress.badges.some(b => b.name === "Interview Specialist")) {
            progress.badges.push({
                name: "Interview Specialist",
                icon: "🥈",
                description: "Earned 2000 XP total.",
                dateEarned: new Date()
            });
        }
        
        await progress.save();
        return { progress, leveledUp };
    } catch (err) {
        console.error("Error awarding XP:", err);
        return null;
    }
}

/**
 * Start a mock interview session
 */
async function startSessionController(req, res) {
    try {
        const { role, experienceLevel, interviewType } = req.body;
        
        if (!role || !experienceLevel || !interviewType) {
            return res.status(400).json({ message: "Role, experience level, and interview type are required." });
        }

        // ── SaaS Limit Check ──
        let subscription = await subscriptionModel.findOne({ user: req.user.id });
        if (!subscription) {
            subscription = await subscriptionModel.create({ user: req.user.id, plan: "FREE" });
        }

        if (subscription.plan === "FREE") {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const sessionCount = await mockInterviewSessionModel.countDocuments({
                user: req.user.id,
                createdAt: { $gte: startOfMonth }
            });

            if (sessionCount >= 3) {
                return res.status(403).json({
                    message: "Free plan limit reached (3 sessions/month). Please upgrade to PRO for unlimited mock interviews."
                });
            }
        }

        // Generate the first question using Gemini
        const firstQuestionData = await geminiService.generateMockQuestion({
            role,
            experienceLevel,
            interviewType,
            chatHistory: []
        });

        const initialQuestion = firstQuestionData.question;

        const session = await mockInterviewSessionModel.create({
            user: req.user.id,
            role,
            experienceLevel,
            interviewType,
            questions: [initialQuestion],
            answers: [],
            chatHistory: [
                { role: "interviewer", content: initialQuestion }
            ],
            status: "ongoing"
        });

        res.status(201).json({
            message: "Mock interview started.",
            session
        });
    } catch (error) {
        console.error("Start session error:", error);
        res.status(500).json({ message: "Failed to start interview session.", error: error.message });
    }
}

/**
 * Submit answer, evaluate, and generate follow-up question
 */
async function submitAnswerController(req, res) {
    try {
        const { sessionId, answer, durationSeconds } = req.body;
        
        if (!sessionId || !answer) {
            return res.status(400).json({ message: "Session ID and answer are required." });
        }

        const session = await mockInterviewSessionModel.findOne({ _id: sessionId, user: req.user.id });
        if (!session) {
            return res.status(404).json({ message: "Session not found." });
        }

        if (session.status === "completed") {
            return res.status(400).json({ message: "This interview session has already ended." });
        }

        const lastInterviewerMessage = [...session.chatHistory].reverse().find(msg => msg.role === "interviewer");
        const currentQuestion = lastInterviewerMessage ? lastInterviewerMessage.content : "";

        // Evaluate answer
        const evaluation = await geminiService.evaluateAnswer({
            question: currentQuestion,
            answer: answer
        });

        // Add candidate answer to history
        session.answers.push(answer);
        session.chatHistory.push({
            role: "candidate",
            content: answer,
            evaluation: {
                score: evaluation.score,
                feedback: evaluation.feedback
            }
        });

        // Award dynamic XP
        await awardUserXP(req.user.id, 50); // 50 XP per submitted answer

        // Limit the interview rounds (e.g. 5 questions total per session)
        if (session.answers.length >= 5) {
            session.status = "completed";

            // Process speech metrics if any voice clues are passed
            let confidence = 85;
            let clarity = 80;
            let fillerWordsCount = (answer.match(/\b(um|uh|like|basically|actually|you know)\b/gi) || []).length;
            
            // Randomize voice pacing if voice flag was active
            session.communicationScore = {
                confidence,
                clarity,
                fillerWordsCount,
                pace: fillerWordsCount > 4 ? "fast" : "good"
            };

            // Calculate overall session report
            const summary = await geminiService.generateSessionSummary({
                role: session.role,
                interviewType: session.interviewType,
                chatHistory: session.chatHistory.filter(h => h.role === "candidate" || h.role === "interviewer")
            });

            session.overallScore = summary.overallScore;
            session.feedbackReport = summary.feedbackReport;

            await session.save();

            // Award completion XP
            await awardUserXP(req.user.id, 200); // 200 XP for complete session

            return res.status(200).json({
                message: "Interview completed.",
                session,
                completed: true
            });
        }

        // Generate next question
        const nextQuestionData = await geminiService.generateMockQuestion({
            role: session.role,
            experienceLevel: session.experienceLevel,
            interviewType: session.interviewType,
            chatHistory: session.chatHistory
        });

        const nextQuestion = nextQuestionData.question;
        session.questions.push(nextQuestion);
        session.chatHistory.push({
            role: "interviewer",
            content: nextQuestion
        });

        await session.save();

        res.status(200).json({
            message: "Answer evaluated.",
            session,
            completed: false
        });
    } catch (error) {
        console.error("Submit answer error:", error);
        res.status(500).json({ message: "Failed to record answer.", error: error.message });
    }
}

/**
 * Fetch result of session
 */
async function getResultController(req, res) {
    try {
        const { id } = req.params;
        const session = await mockInterviewSessionModel.findOne({ _id: id, user: req.user.id });
        if (!session) {
            return res.status(404).json({ message: "Session not found." });
        }
        res.status(200).json({ session });
    } catch (error) {
        console.error("Get result error:", error);
        res.status(500).json({ message: "Failed to load results.", error: error.message });
    }
}

module.exports = {
    startSessionController,
    submitAnswerController,
    getResultController
};

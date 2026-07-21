const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.services")
const interviewReportModel = require("../models/interviewReport.model")
const userModel = require("../models/user.model")
const { sendCareerReportGeneratedEmail } = require("../services/mail.services")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req, res) {
    try {
        let resumeText = ""
        if (req.file) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = (typeof resumeContent === 'string' ? resumeContent : resumeContent?.text) || ""
        }
        const { selfDescription, jobDescription } = req.body

        console.log("Calling generateInterviewReport service...");
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })
        console.log("AI Report returned:", interViewReportByAi);

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resumeText: resumeText,
            selfDescription,
            jobDescription,
            title: interViewReportByAi?.title || "Untitled Position",
            matchScore: typeof interViewReportByAi?.matchScore === 'number' ? interViewReportByAi.matchScore : 0,
            technicalQuestions: Array.isArray(interViewReportByAi?.technicalQuestions) ? interViewReportByAi.technicalQuestions : [],
            behavioralQuestions: Array.isArray(interViewReportByAi?.behavioralQuestions) ? interViewReportByAi.behavioralQuestions : [],
            skillGaps: Array.isArray(interViewReportByAi?.skillGaps) ? interViewReportByAi.skillGaps : [],
            preparationPlan: Array.isArray(interViewReportByAi?.preparationPlan) ? interViewReportByAi.preparationPlan : []
        })

        console.log("Database entry created with ID:", interviewReport._id);

        const user = await userModel.findById(req.user.id)
        if (user) {
            sendCareerReportGeneratedEmail(user.email, { matchScore: interviewReport.matchScore })
                .catch((err) => console.error("Failed to send career report email:", err))
        }

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error in generateInterviewReportController:", error);
        res.status(500).json({
            message: "Failed to generate interview report.",
            error: error.message
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resumeText -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resumeText, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume: resumeText, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

/**
 * @description Controller to delete a single interview report by id (only if it belongs to the authenticated user).
 */
async function deleteReportController(req, res) {
    try {
        const { reportId } = req.params;
        const report = await interviewReportModel.findOneAndDelete({ _id: reportId, user: req.user.id });
        if (!report) {
            return res.status(404).json({ message: "Report not found or not authorized." });
        }
        res.status(200).json({ message: "Report deleted successfully." });
    } catch (error) {
        console.error("Error in deleteReportController:", error);
        res.status(500).json({ message: "Failed to delete report.", error: error.message });
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, deleteReportController }
/**
 * Blog Seeder Script
 * ──────────────────
 * One-time migration of the original static marketing blog posts into the
 * real Post collection. Safe to re-run — skips posts whose slug already
 * exists.
 *
 * Usage:
 *   cd Backend
 *   node src/scripts/seedBlogPosts.js
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");

const POSTS = [
  {
    slug: "ace-behavioral-interviews",
    title: "How to Ace Behavioral Interviews with the STAR Method",
    excerpt: "A practical breakdown of the STAR method with real examples you can adapt for your own stories.",
    category: "Interview Tips",
    publishedAt: new Date("2026-06-02"),
    content: `Behavioral interviews reward candidates who can tell a clear, specific story — not the ones with the most impressive resume.

**The STAR method** breaks every answer into four parts: Situation, Task, Action, Result.

- Situation: Set the scene in one or two sentences.
- Task: What were you responsible for?
- Action: What did *you* specifically do?
- Result: What happened, ideally with a number attached.

The most common mistake is spending too long on the Situation and Task, and rushing the Action and Result — the two parts interviewers actually care about most.

Practice telling the same story in under 90 seconds. If you can't, you're including detail the interviewer doesn't need.`,
  },
  {
    slug: "ats-resume-keywords",
    title: "5 Resume Keyword Mistakes That Get You Filtered Out by ATS",
    excerpt: "Most resumes fail ATS screening for the same handful of avoidable reasons — here's what to fix.",
    category: "Resume Advice",
    publishedAt: new Date("2026-05-18"),
    content: `Applicant tracking systems parse your resume for keyword alignment with the job description before a human ever sees it.

**1. Using synonyms instead of the exact term.** If the job description says "React", write "React" — not just "frontend frameworks."

**2. Burying skills in dense paragraphs.** ATS parsers favor clearly separated skills sections and bullet points.

**3. Using headers as images or unusual fonts.** Some ATS systems can't parse text embedded in images or heavily stylized headers.

**4. Missing the seniority keyword.** If the role says "Senior", make sure that word (or your actual title) appears somewhere.

**5. Not tailoring per application.** The same resume rarely scores well across different job descriptions — small adjustments matter.`,
  },
  {
    slug: "system-design-interview-prep",
    title: "A 7-Day Plan to Prepare for System Design Interviews",
    excerpt: "A structured week-long study plan for candidates targeting senior and staff engineering roles.",
    category: "Career Growth",
    publishedAt: new Date("2026-04-30"),
    content: `System design interviews reward structured thinking more than memorized architectures.

**Day 1-2: Fundamentals.** Review load balancing, caching, database indexing, and horizontal vs. vertical scaling.

**Day 3-4: Case studies.** Practice designing a URL shortener, a rate limiter, and a chat system — the same patterns show up across most interview questions.

**Day 5-6: Trade-off framing.** For every design decision, practice explaining *why* — consistency vs. availability, SQL vs. NoSQL, sync vs. async.

**Day 7: Mock interview.** Run a full 45-minute mock session and get feedback on your communication, not just your final diagram.`,
  },
  {
    slug: "mockmate-analytics-launch",
    title: "Introducing the New Analytics Dashboard",
    excerpt: "Track your performance trends across every interview type with our redesigned analytics.",
    category: "Product Updates",
    publishedAt: new Date("2026-04-10"),
    content: `We've rebuilt the analytics dashboard from the ground up.

You can now see a skill breakdown across technical, behavioral, and HR rounds, track your session history over time, and watch your resume ATS score improve version over version.

XP and level progress are now visible at a glance, so you always know how close you are to your next milestone.

This is the first of several analytics improvements — session-level trend annotations and exportable reports are coming next.`,
  },
];

async function seed() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌  MONGODB_URI or MONGO_URI not found in .env — aborting.");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("✅  Connected to MongoDB.");

  const postModel = require("../models/post.model");

  for (const post of POSTS) {
    const existing = await postModel.findOne({ slug: post.slug });
    if (existing) {
      console.log(`ℹ️   Post '${post.slug}' already exists. Skipping.`);
      continue;
    }
    await postModel.create({ ...post, author: "MockMate Team", status: "published" });
    console.log(`✅  Created post '${post.slug}'.`);
  }

  await mongoose.disconnect();
  console.log("✅  Done.");
}

seed().catch((err) => {
  console.error("❌  Seeder failed:", err.message);
  process.exit(1);
});

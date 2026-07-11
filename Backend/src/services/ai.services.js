const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    console.log("generateInterviewReport called with resume size:", resume?.length || 0);
    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            }
        })
        console.log("Raw AI response.text:", response.text);
        const data = JSON.parse(response.text)
        console.log("Parsed AI data:", data);
        return data
    } catch (err) {
        console.error("Gemini API generateInterviewReport failed:", err);
        throw err;
    }
}



async function generatePdfFromHtml(htmlContent) {
    const puppeteer = require("puppeteer");

    // CSS reset injected into every resume — enforces A4 layout, justified text,
    // zero extra top margin, and clean professional typography regardless of
    // whatever the AI happens to generate.
    const pdfStyleOverride = `
        <style id="pdf-override">
            @page {
                size: A4;
                margin: 18mm 16mm 18mm 16mm;
            }
            *, *::before, *::after {
                box-sizing: border-box;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 210mm !important;
                font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
                font-size: 10.5pt;
                line-height: 1.55;
                color: #1a1a1a;
                background: #ffffff;
            }
            body > *:first-child,
            body > div:first-child,
            .resume-wrapper,
            .container,
            .resume,
            main {
                margin-top: 0 !important;
                padding-top: 0 !important;
            }
            p, li, td, th, span.desc, .description, .summary {
                text-align: justify !important;
                text-justify: inter-word !important;
            }
            h1, h2, h3, h4, h5, h6 {
                text-align: left !important;
                margin-top: 0;
                line-height: 1.25;
            }
            a { color: inherit; text-decoration: none; }
            ul { padding-left: 1.2em; margin: 0.3em 0; }
            li { margin-bottom: 0.2em; }
            table { width: 100%; border-collapse: collapse; }
        </style>
    `;

    // Inject the override right after <head> (or prepend to body if no head tag)
    let styledHtml;
    if (/<\/head>/i.test(htmlContent)) {
        styledHtml = htmlContent.replace(/<\/head>/i, `${pdfStyleOverride}</head>`);
    } else if (/<body/i.test(htmlContent)) {
        styledHtml = htmlContent.replace(/<body/i, `<head>${pdfStyleOverride}</head><body`);
    } else {
        styledHtml = pdfStyleOverride + htmlContent;
    }

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(styledHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "0",
            bottom: "0",
            left: "0",
            right: "0"
        }
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate a resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        STRICT OUTPUT RULES (these are non-negotiable):
                        - Return a JSON object with a single field "html" containing the full HTML document.
                        - The HTML must be a complete document with <html>, <head>, and <body> tags.
                        - Do NOT import any external fonts or stylesheets (no Google Fonts <link> tags, no @import). Use only system-safe fonts: Arial, Helvetica, 'Segoe UI', Georgia, or Times New Roman.
                        - Do NOT add any top padding or margin to the <body> or the first element inside <body>. The content must start at the very top of the page (the caller adds page margins via @page CSS).
                        - All paragraph, list, and description text should be written with text-align:justify in the inline styles.
                        - Keep the design clean, simple, and professional — no gradients, shadows, or decorative elements that break ATS parsing.
                        - The resume must be ATS friendly (parsable plain text structure, no tables for layout).
                        - Target length: 1 page for junior candidates, up to 2 pages for senior candidates. Focus on quality over quantity.
                        - The content must NOT sound AI-generated. Write in a natural, confident, human tone.
                        - Tailor the resume specifically for the given Job Description, highlighting matching skills and experiences.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }
import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/legal-page-layout";

export const metadata: Metadata = { title: "Privacy Policy — MockMate.AI" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="July 20, 2026">
      <p>
        This Privacy Policy describes how MockMate.AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, and
        protects your information when you use our platform. This is placeholder policy text for the product
        preview and should be replaced with counsel-reviewed language before launch.
      </p>

      <h2>Information we collect</h2>
      <p>
        Account information (username, email, hashed password), content you submit for analysis (resumes, job
        descriptions, interview answers), and usage data (session activity, feature usage) to operate and
        improve the platform.
      </p>

      <h2>How we use your information</h2>
      <p>
        To provide AI-generated feedback on your resume and interview answers, to track your progress and
        analytics, to process payments, and to communicate with you about your account.
      </p>

      <h2>AI processing</h2>
      <p>
        Resume content, job descriptions, and interview answers are sent to a third-party AI provider (Google
        Gemini) to generate feedback. We do not use your content to train third-party models.
      </p>

      <h2>Data retention</h2>
      <p>
        We retain your account data and generated reports until you delete your account. Deleting your account
        permanently removes your career reports; some records tied to payments may be retained as required by law.
      </p>

      <h2>Your rights</h2>
      <p>
        You can update your username at any time from your profile, and permanently delete your account and
        associated data from the Profile page.
      </p>

      <h2>Contact</h2>
      <p>Questions about this policy can be sent to privacy@mockmate.ai.</p>
    </LegalPageLayout>
  );
}

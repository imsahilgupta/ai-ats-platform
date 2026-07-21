import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/legal-page-layout";

export const metadata: Metadata = { title: "Cookie Policy — MockMate.AI" };

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="July 20, 2026">
      <p>
        This Cookie Policy explains how MockMate.AI uses cookies. This is placeholder policy text for the
        product preview and should be replaced with counsel-reviewed language before launch.
      </p>

      <h2>Essential cookies</h2>
      <p>
        We use a single httpOnly authentication cookie to keep you signed in. This cookie is required for the
        platform to function and cannot be disabled while remaining logged in.
      </p>

      <h2>Preference storage</h2>
      <p>
        Your theme preference (light/dark/system) and sidebar collapsed state are stored locally in your
        browser and are not sent to our servers.
      </p>

      <h2>Analytics</h2>
      <p>We do not currently use third-party analytics or advertising cookies.</p>

      <h2>Managing cookies</h2>
      <p>
        You can clear cookies from your browser settings at any time; doing so will sign you out of your
        account.
      </p>

      <h2>Contact</h2>
      <p>Questions about this policy can be sent to privacy@mockmate.ai.</p>
    </LegalPageLayout>
  );
}

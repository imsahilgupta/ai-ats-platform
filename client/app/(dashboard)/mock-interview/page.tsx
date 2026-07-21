import { PageHeader } from "@/components/shared/page-header";
import { InterviewSetupForm } from "@/components/dashboard/mock-interview/interview-setup-form";

export default function MockInterviewSetupPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="AI Mock Interview"
        description="Practice live with an AI interviewer across 5 rounds tailored to your target role."
      />
      <div className="rounded-xl border border-border bg-card p-6">
        <InterviewSetupForm />
      </div>
    </div>
  );
}

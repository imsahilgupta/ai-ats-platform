import Link from "next/link";
import { History } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ReportForm } from "@/components/dashboard/career-report/report-form";

export default function CareerReportPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="AI Career Strategy Report"
        description="Get a personalized match score, skill gap analysis, and a weekly preparation plan tailored to your target role."
        action={
          <Button variant="outline" render={<Link href="/reports" />}>
            <History className="size-4" />
            Past reports
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card p-6">
        <ReportForm />
      </div>
    </div>
  );
}

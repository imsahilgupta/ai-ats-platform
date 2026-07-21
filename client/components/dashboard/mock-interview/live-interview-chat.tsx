import { Bot, User } from "lucide-react";
import type { ChatTurn } from "@/types/mockInterview";

export function LiveInterviewChat({ chatHistory }: { chatHistory: ChatTurn[] }) {
  return (
    <div className="space-y-4">
      {chatHistory.map((turn, i) => (
        <div key={i} className={`flex gap-3 ${turn.role === "candidate" ? "flex-row-reverse" : ""}`}>
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
              turn.role === "interviewer" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {turn.role === "interviewer" ? <Bot className="size-4" /> : <User className="size-4" />}
          </span>
          <div
            className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
              turn.role === "interviewer"
                ? "bg-card border border-border text-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            <p className="whitespace-pre-line">{turn.content}</p>
            {turn.evaluation?.score != null && (
              <p className="mt-1.5 text-xs opacity-80">
                Score: {turn.evaluation.score}/100 &mdash; {turn.evaluation.feedback}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

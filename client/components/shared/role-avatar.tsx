import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export function RoleAvatar({ name, size = "size-8" }: { name: string; size?: string }) {
  return (
    <Avatar className={size}>
      <AvatarFallback className={cn("bg-primary/10 font-medium text-primary", size === "size-8" ? "text-xs" : "text-sm")}>
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

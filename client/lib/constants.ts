import type { InterviewType } from "@/types/mockInterview";
import type { Plan } from "@/types/subscription";
import {
  Mic,
  FileScan,
  Compass,
  History,
  BarChart3,
  Trophy,
  CreditCard,
  Bell,
  User,
  Settings,
  LayoutDashboard,
  Users,
  FileBarChart,
  Wallet,
  LifeBuoy,
  MessageSquareWarning,
  Megaphone,
  ScrollText,
  Database,
  Activity,
  type LucideIcon,
} from "lucide-react";

export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "staff", label: "Staff / Lead" },
] as const;

export const INTERVIEW_TYPES: { value: InterviewType; label: string; description: string }[] = [
  { value: "technical", label: "Technical", description: "Coding, systems, and problem solving" },
  { value: "behavioral", label: "Behavioral", description: "Past experiences and soft skills" },
  { value: "system-design", label: "System Design", description: "Architecture and scalability" },
  { value: "hr", label: "HR", description: "Culture fit and general screening" },
];

export const MOCK_INTERVIEW_ROUNDS = 5;
export const FREE_PLAN_MONTHLY_LIMIT = 3;

export const XP_PER_ANSWER = 50;
export const XP_SESSION_COMPLETION_BONUS = 200;

export const PLAN_PRICING: Record<Plan, { usd: number; npr: number; periodDays: number }> = {
  FREE: { usd: 0, npr: 0, periodDays: 30 },
  PRO: { usd: 19, npr: 2500, periodDays: 30 },
  ENTERPRISE: { usd: 49, npr: 6500, periodDays: 30 },
};

export const BADGE_CATALOG = [
  { key: "rookie", name: "Interview Rookie", icon: "🥉", xpThreshold: 500 },
  { key: "specialist", name: "Interview Specialist", icon: "🥈", xpThreshold: 2000 },
] as const;

export interface DashboardNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV: { practice: DashboardNavItem[]; insights: DashboardNavItem[]; account: DashboardNavItem[] } = {
  practice: [
    { title: "AI Mock Interview", href: "/mock-interview", icon: Mic },
    { title: "Resume Analyzer", href: "/resume-analyzer", icon: FileScan },
    { title: "Career Report", href: "/career-report", icon: Compass },
  ],
  insights: [
    { title: "Reports History", href: "/reports", icon: History },
    { title: "Analytics", href: "/analytics", icon: BarChart3 },
    { title: "Achievements", href: "/achievements", icon: Trophy },
  ],
  account: [
    { title: "Subscription", href: "/subscription", icon: CreditCard },
    { title: "Notifications", href: "/notifications", icon: Bell },
    { title: "Profile", href: "/profile", icon: User },
    { title: "Settings", href: "/settings", icon: Settings },
  ],
};

// Only /admin (platform stats) is backed by a real endpoint
// (GET /analytics/admin/stats). Every other admin page is mock data —
// there is no user-management, ticketing, or server-health backend yet.
export const ADMIN_NAV: DashboardNavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Reports", href: "/admin/reports", icon: FileBarChart },
  { title: "Payments", href: "/admin/payments", icon: Wallet },
  { title: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
  { title: "Feedback", href: "/admin/feedback", icon: MessageSquareWarning },
  { title: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { title: "API Logs", href: "/admin/logs", icon: ScrollText },
  { title: "Database", href: "/admin/database", icon: Database },
  { title: "Server Health", href: "/admin/system", icon: Activity },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

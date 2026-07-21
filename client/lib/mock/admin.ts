// No backend endpoints exist for any of this data (only GET /analytics/admin/stats
// is real — see hooks/use-admin-stats.ts). These generators produce stable,
// deterministic mock data for the admin panel preview, structured close to
// the real Mongoose schemas so real endpoints are a straightforward swap later.

export interface MockUser {
  id: string;
  username: string;
  email: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  isAdmin: boolean;
  status: "active" | "suspended";
  joinedAt: string;
}

export interface MockPayment {
  id: string;
  user: string;
  plan: "PRO" | "ENTERPRISE";
  amount: number;
  gateway: "esewa";
  status: "paid" | "failed" | "refunded";
  date: string;
}

export interface MockSupportTicket {
  id: string;
  subject: string;
  user: string;
  priority: "low" | "medium" | "high";
  status: "open" | "pending" | "resolved";
  createdAt: string;
}

export interface MockFeedback {
  id: string;
  user: string;
  message: string;
  rating: number;
  createdAt: string;
}

export interface MockAnnouncement {
  id: string;
  title: string;
  body: string;
  audience: "all" | "free" | "pro";
  publishedAt: string;
}

export interface MockApiLog {
  id: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  timestamp: string;
}

const FIRST_NAMES = ["Priya", "Marcus", "Aisha", "Daniel", "Maria", "Wei", "Fatima", "Noah", "Elena", "Kwame"];
const LAST_NAMES = ["Sharma", "Chen", "Bello", "Osei", "Torres", "Zhang", "Khan", "Miller", "Ivanova", "Mensah"];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

export function generateMockUsers(count = 24): MockUser[] {
  const rand = seededRandom(42);
  return Array.from({ length: count }, (_, i) => {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const plan = rand() > 0.85 ? "ENTERPRISE" : rand() > 0.6 ? "PRO" : "FREE";
    return {
      id: `usr_${i + 1}`,
      username: `${first.toLowerCase()}${last.toLowerCase()}${i}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      plan,
      isAdmin: i === 0,
      status: rand() > 0.92 ? "suspended" : "active",
      joinedAt: daysAgo(Math.floor(rand() * 200)),
    };
  });
}

export function generateMockPayments(count = 18): MockPayment[] {
  const rand = seededRandom(7);
  const users = generateMockUsers(count);
  return users.map((user, i) => ({
    id: `pay_${i + 1}`,
    user: user.username,
    plan: rand() > 0.7 ? "ENTERPRISE" : "PRO",
    amount: rand() > 0.7 ? 6500 : 2500,
    gateway: "esewa",
    status: rand() > 0.9 ? "failed" : rand() > 0.85 ? "refunded" : "paid",
    date: daysAgo(Math.floor(rand() * 60)),
  }));
}

export function generateMockSupportTickets(count = 12): MockSupportTicket[] {
  const rand = seededRandom(13);
  const subjects = [
    "Can't upload my resume",
    "Mock interview session stuck",
    "Payment not reflecting",
    "Question about ATS scoring",
    "Feature request: dark mode charts",
    "Billing invoice request",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `tkt_${i + 1}`,
    subject: subjects[i % subjects.length],
    user: `user${i + 1}@example.com`,
    priority: rand() > 0.7 ? "high" : rand() > 0.4 ? "medium" : "low",
    status: rand() > 0.7 ? "resolved" : rand() > 0.4 ? "pending" : "open",
    createdAt: daysAgo(Math.floor(rand() * 30)),
  }));
}

export function generateMockFeedback(count = 10): MockFeedback[] {
  const rand = seededRandom(21);
  const messages = [
    "Love the mock interview feature, feels very realistic.",
    "Wish there were more system design questions.",
    "The resume analyzer caught things I completely missed.",
    "Would like a dark mode for the reports.",
    "Great platform overall, keep improving analytics.",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `fbk_${i + 1}`,
    user: `user${i + 1}@example.com`,
    message: messages[i % messages.length],
    rating: Math.ceil(rand() * 5),
    createdAt: daysAgo(Math.floor(rand() * 45)),
  }));
}

export function generateMockAnnouncements(): MockAnnouncement[] {
  return [
    {
      id: "ann_1",
      title: "New Analytics Dashboard",
      body: "We've redesigned analytics with skill breakdowns and session history trends.",
      audience: "all",
      publishedAt: daysAgo(3),
    },
    {
      id: "ann_2",
      title: "PRO plan: priority AI response times",
      body: "PRO subscribers now get priority processing on mock interview responses.",
      audience: "pro",
      publishedAt: daysAgo(10),
    },
    {
      id: "ann_3",
      title: "Scheduled maintenance",
      body: "Brief maintenance window planned for this weekend, 2-3am UTC.",
      audience: "all",
      publishedAt: daysAgo(20),
    },
  ];
}

export function generateMockApiLogs(count = 30): MockApiLog[] {
  const rand = seededRandom(55);
  const endpoints = [
    { method: "POST", path: "/api/mock-interview/start" },
    { method: "POST", path: "/api/mock-interview/answer" },
    { method: "POST", path: "/api/resume/analyze" },
    { method: "POST", path: "/api/interview" },
    { method: "GET", path: "/api/analytics" },
    { method: "GET", path: "/api/subscription" },
    { method: "POST", path: "/api/payment/esewa/initiate" },
  ];
  return Array.from({ length: count }, (_, i) => {
    const endpoint = endpoints[i % endpoints.length];
    const status = rand() > 0.92 ? 503 : rand() > 0.85 ? 400 : rand() > 0.8 ? 401 : 200;
    return {
      id: `log_${i + 1}`,
      method: endpoint.method,
      path: endpoint.path,
      status,
      durationMs: Math.round(80 + rand() * 900),
      timestamp: new Date(Date.now() - i * 120_000).toISOString(),
    };
  });
}

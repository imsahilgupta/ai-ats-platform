import Link from "next/link";
import { Sparkles } from "lucide-react";

// lucide-react no longer ships trademarked brand/logo icons (Github,
// Linkedin, Twitter were removed) — inline SVGs, same pattern as
// components/auth/oauth-buttons.tsx.
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 0 0-1.33-1.75c-1.09-.75.08-.73.08-.73a2.52 2.52 0 0 1 1.84 1.24 2.55 2.55 0 0 0 3.49 1 2.55 2.55 0 0 1 .76-1.6c-2.67-.3-5.47-1.33-5.47-5.93a4.64 4.64 0 0 1 1.24-3.22 4.3 4.3 0 0 1 .12-3.18s1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23a4.3 4.3 0 0 1 .12 3.18 4.63 4.63 0 0 1 1.23 3.22c0 4.61-2.81 5.63-5.48 5.92a2.86 2.86 0 0 1 .82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2.25h3.07l-6.71 7.67 7.9 10.43h-6.18l-4.84-6.33-5.54 6.33H3.5l7.18-8.2L3.1 2.25h6.34l4.37 5.79 5.09-5.79zm-1.08 16.2h1.7L7.28 4.02H5.46L17.82 18.45z" />
    </svg>
  );
}

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { title: "Features", href: "/features" },
      { title: "Pricing", href: "/pricing" },
      { title: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "/legal/privacy" },
      { title: "Terms of Service", href: "/legal/terms" },
      { title: "Cookie Policy", href: "/legal/cookies" },
    ],
  },
];

const SOCIAL_LINKS = [
  { title: "GitHub", href: "https://github.com", icon: GithubIcon },
  { title: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
  { title: "Twitter", href: "https://twitter.com", icon: TwitterIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <span>
                MockMate<span className="text-primary">.AI</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              AI-powered interview prep, resume analysis, and career strategy — all in one platform.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.title}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.title}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-foreground">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MockMate.AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

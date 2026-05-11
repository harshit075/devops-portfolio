import { AdminAccess } from './AdminAccess';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border-color relative overflow-hidden">
      {/* Decorative background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-black text-black/[0.02] dark:text-white/[0.02] select-none whitespace-nowrap pointer-events-none tracking-tighter">
        サクナ
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Footer links & info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-border-color">
          {/* Branding */}
          <div className="flex flex-col gap-3">
            <span className="text-xl font-black uppercase tracking-tighter">
              Harshit Borana
            </span>
            <span className="text-sm font-bold tracking-widest text-cyan uppercase opacity-80">
              ハルシット・ボラナ
            </span>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              DevOps Engineer crafting robust infrastructure and seamless deployment pipelines.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold uppercase tracking-widest mb-2">
              Quick Links / リンク
            </span>
            {[
              { label: "Projects", jp: "プロジェクト" },
              { label: "About", jp: "私について" },
              { label: "Contact", jp: "連絡" },
            ].map((link) => (
              <a
                key={link.label}
                href={`#${link.label.toLowerCase()}`}
                className="text-sm text-text-muted hover:text-cyan transition-colors uppercase tracking-wider group"
              >
                {link.label}{" "}
                <span className="opacity-0 group-hover:opacity-70 transition-opacity text-cyan">
                  {link.jp}
                </span>
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold uppercase tracking-widest mb-2">
              Connect / 接続
            </span>
            <div className="flex gap-4">
              <a
                href="https://github.com/harshit075"
                target="_blank"
                rel="noreferrer"
                className="p-3 border border-border-color hover:border-cyan hover:text-cyan transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] group"
              >
                <GithubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://www.linkedin.com/in/harshit-borana-%F0%9F%87%AE%F0%9F%87%B3-3a685a257/"
                target="_blank"
                rel="noreferrer"
                className="p-3 border border-border-color hover:border-cyan hover:text-cyan transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] group"
              >
                <LinkedInIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="mailto:harshitborana075@gmail.com"
                className="p-3 border border-border-color hover:border-cyan hover:text-cyan transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] group"
              >
                <MailIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <AdminAccess />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border-color flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-text-muted uppercase tracking-[0.2em] text-center">
            © 2026 Harshit Borana. Crafted by yours truly.
          </p>
          <p className="text-xs text-text-muted tracking-widest">
            Made with <span className="text-cyan">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

const X_URL = process.env.NEXT_PUBLIC_X_URL || 'https://x.com/MiraiTechCity';
const TELEGRAM_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_INVITE_URL || 'https://t.me/+miraitech';

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-socials">
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer-social"
            aria-label="Mirai Tech on X"
          >
            <XIcon size={18} />
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer-social"
            aria-label="Mirai Tech on Telegram"
          >
            <TelegramIcon size={18} />
          </a>
        </div>
        <div className="site-footer-copy mono">
          © 2026 Mirai Tech PopUp City · Kobe, Japan
        </div>
      </div>
    </footer>
  );
}

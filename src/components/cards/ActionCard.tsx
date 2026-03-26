import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWebApp } from '../../lib/telegram';

interface ActionCardProps {
  icon: ReactNode;
  image: string;
  label: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
}

const cardBg = 'radial-gradient(89.06% 172.06% at 60.96% -69.61%, var(--color-primary) 0%, rgba(102, 26, 255, 0.00) 99.68%), var(--color-surface)';
const cardClassName = 'flex w-full relative overflow-hidden pt-12.5 p-3 rounded-[14px] cursor-pointer active:scale-[0.97] transition-transform duration-150 no-underline';

function isTelegramLink(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 't.me' || parsed.hostname === 'telegram.me';
  } catch {
    return false;
  }
}

export function ActionCard({ icon, image, label, to, href, onClick }: ActionCardProps) {
  const navigate = useNavigate();

  const inner = (
    <>
      <img src={image} className="absolute right-0 h-full top-0 pointer-events-none" alt="" />
      <div className="absolute top-3 left-3 mix-blend-overlay">
        {icon}
      </div>
      <span className="text-white text-sm leading-[140%]">
        {label}
      </span>
    </>
  );

  if (href) {
    const handleClick = (e: React.MouseEvent) => {
      if (isTelegramLink(href)) {
        e.preventDefault();
        const webApp = getWebApp();
        if (webApp) {
          webApp.openTelegramLink(href);
        } else {
          window.open(href, '_blank');
        }
      }
    };

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
        style={{ background: cardBg }}
        onClick={handleClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className={cardClassName}
      style={{ background: cardBg }}
      onClick={to ? () => navigate(to) : onClick}
    >
      {inner}
    </div>
  );
}

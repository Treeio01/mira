import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface ActionCardProps {
  icon: ReactNode;
  image: string;
  label: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
}

const cardBg = 'radial-gradient(89.06% 172.06% at 60.96% -69.61%, #661AFF 0%, rgba(102, 26, 255, 0.00) 99.68%), #15111F';
const cardClassName = 'flex w-full relative overflow-hidden pt-12.5 p-3 rounded-[14px] cursor-pointer active:scale-[0.97] transition-transform duration-150 no-underline';

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
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
        style={{ background: cardBg }}
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

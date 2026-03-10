import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface ActionCardProps {
  icon: ReactNode;
  image: string;
  label: ReactNode;
  to?: string;
}

const cardBg = 'radial-gradient(89.06% 172.06% at 60.96% -69.61%, #661AFF 0%, rgba(102, 26, 255, 0.00) 99.68%), #15111F';

export function ActionCard({ icon, image, label, to }: ActionCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="flex w-full relative overflow-hidden pt-12.5 p-3 rounded-[14px] cursor-pointer active:scale-[0.97] transition-transform duration-150"
      style={{ background: cardBg }}
      onClick={to ? () => navigate(to) : undefined}
    >
      <img src={image} className="absolute right-0 h-full top-0 pointer-events-none" alt="" />
      <div className="absolute top-3 left-3 mix-blend-overlay">
        {icon}
      </div>
      <span className="text-white text-sm leading-[140%]">
        {label}
      </span>
    </div>
  );
}

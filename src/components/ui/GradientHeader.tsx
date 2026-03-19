import type { ReactNode } from 'react';
import mainBlockLine from '../../assets/img/main-block--line.png';

interface GradientHeaderProps {
  children: ReactNode;
  className?: string;
  isCustomBg?: boolean;
}

const headerGradient = 'linear-gradient(to top right, #4A14B5 0%, #4A14B5 25%, #6B33DC 60%, #9B6EF0 80%, #D4C4FA 95%, #F0EAFF 100%)';

export function GradientHeader({ children, className = '', isCustomBg = false }: GradientHeaderProps) {
  return (
    <div
      className={`flex relative p-4 rounded-2xl w-full overflow-hidden ${className}`}
      style={{ background: headerGradient }}
    >
      {!isCustomBg &&  <img
        src={mainBlockLine}
        alt=""
        className="absolute top-0 right-0 pointer-events-none select-none"
      />}
      {children}
    </div>
  );
}

import type { ReactNode } from 'react';
import { GradientHeader } from './GradientHeader';
import { UserIdBadge } from './UserIdBadge';

interface PageHeaderProps {
  title: ReactNode;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <GradientHeader className="flex-col gap-2.5">
      <div className="flex w-full justify-between items-end z-10">
        <h1 className="text-white font-semibold text-[24px] leading-[112%] tracking-[-0.01em]">
          {title}
        </h1>
        <UserIdBadge />
      </div>
    </GradientHeader>
  );
}

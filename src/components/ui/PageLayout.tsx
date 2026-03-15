import type { ReactNode } from 'react';
import { BackBottomBar } from './BackBottomBar';

interface PageLayoutProps {
  children: ReactNode;
  centered?: boolean;
}

export function PageLayout({ children, centered }: PageLayoutProps) {
  return (
    <>
      <div className={`flex relative flex-col p-4 gap-4 w-full h-full pb-19 ${centered ? 'items-center justify-center' : ''}`}>
        {children}
      </div>
      <BackBottomBar />
    </>
  );
}

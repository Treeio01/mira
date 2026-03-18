import { PageLayout } from './PageLayout';

interface SuccessScreenProps {
  message: string;
  buttonText: string;
  onAction: () => void;
}

export function SuccessScreen({ message, buttonText, onAction }: SuccessScreenProps) {
  return (
    <PageLayout centered>
      <div className="flex flex-col items-center gap-4 px-4">
        <div className="w-16 h-16 rounded-full bg-[#661AFF]/20 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#661AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-white font-medium text-center text-[16px] leading-[140%]">
          {message}
        </p>
        <button
          onClick={onAction}
          className="flex w-full py-3 justify-center items-center rounded-lg bg-[#661AFF] active:scale-[0.97] transition-transform mt-2"
        >
          <span className="text-white font-medium text-sm leading-[140%] tracking-[-0.02em]">
            {buttonText}
          </span>
        </button>
      </div>
    </PageLayout>
  );
}

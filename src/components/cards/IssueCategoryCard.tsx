import { memo } from 'react';

interface IssueCategoryCardProps {
  name: string;
  description: string;
  price: number;
  onBuy: () => void;
}

export const IssueCategoryCard = memo(function IssueCategoryCard({
  name,
  description,
  price,
  onBuy,
}: IssueCategoryCardProps) {
  return (
    <div className="flex flex-col gap-3 bg-[#181424] rounded-lg p-4">
      <div className="flex justify-between items-center gap-4.5">
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="text-white font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
            {name}
          </span>
          <span className="text-white/64 font-medium text-[12px] leading-[140%] tracking-[-0.02em]">
            {description}
          </span>
        </div>
        <span className="text-white font-medium leading-[150%] tracking-[-0.01em] whitespace-nowrap">
          ${price.toFixed(2)}
        </span>
      </div>
      <button
        onClick={onBuy}
        className="flex w-full py-3 justify-center items-center rounded-lg bg-[#661AFF] active:scale-[0.97] transition-transform"
      >
        <span className="text-white font-medium text-sm leading-[140%] tracking-[-0.02em]">
          Купить
        </span>
      </button>
    </div>
  );
});

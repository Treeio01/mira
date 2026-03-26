interface AmountInputProps {
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
  hint: string;
  rightHint?: string;
  placeholder?: string;
  onMax?: () => void;
}

export function AmountInput({
  value,
  onChange,
  hasError,
  hint,
  rightHint,
  placeholder = "Введите сумму пополнения в $",
  onMax,
}: AmountInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-surface-alt rounded-lg py-3 px-4 ${onMax ? "pr-16" : ""} font-medium text-[14px] leading-[140%] tracking-[-0.02em] outline-none placeholder:text-white/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${hasError ? "text-danger-light" : "text-white"}`}
        />
        {onMax && (
          <button
            type="button"
            onClick={onMax}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary/20 text-primary px-2.5 py-1 rounded-md text-[12px] font-semibold leading-none active:scale-95 transition-transform"
          >
            MAX
          </button>
        )}
      </div>
      <div className="flex justify-between px-1">
        <span className={`font-medium text-[14px] leading-[140%] tracking-[-0.02em] ${hasError ? "text-danger-light" : "text-white/20"}`}>
          {hint}
        </span>
        {rightHint && (
          <span className="text-white/20 font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
            {rightHint}
          </span>
        )}
      </div>
    </div>
  );
}

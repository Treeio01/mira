interface AmountInputProps {
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
  hint: string;
  rightHint?: string;
  placeholder?: string;
}

export function AmountInput({
  value,
  onChange,
  hasError,
  hint,
  rightHint,
  placeholder = "Введите сумму пополнения в $",
}: AmountInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-[#181424] rounded-lg py-3 px-4 font-medium text-[14px] leading-[140%] tracking-[-0.02em] outline-none placeholder:text-white/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${hasError ? "text-[#FF5C5C]" : "text-white"}`}
      />
      <div className="flex justify-between px-1">
        <span className={`font-medium text-[14px] leading-[140%] tracking-[-0.02em] ${hasError ? "text-[#FF5C5C]" : "text-white/20"}`}>
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

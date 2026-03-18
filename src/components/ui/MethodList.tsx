import type { TopUpMethodItem } from '../../services/api';

interface MethodListProps {
  methods: TopUpMethodItem[];
  selectedMethod: string | null;
  onSelect: (name: string) => void;
}

export function MethodList({ methods, selectedMethod, onSelect }: MethodListProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {methods.map((method) => {
        const isSelected = selectedMethod === method.name;
        return (
          <button
            key={method.name}
            onClick={() => onSelect(method.name)}
            className={`flex items-center w-full py-3 px-5 rounded-lg transition-colors ${
              isSelected
                ? "bg-[#211B30] border border-[#423660]"
                : "bg-[#181424] border border-transparent"
            }`}
          >
            {method.icon && (
              <img
                src={method.icon}
                alt={method.name_text}
                className="w-4 h-4 rounded-md object-contain"
              />
            )}
            <span className={`text-white font-medium text-[14px] leading-[140%] tracking-[-0.02em] ${method.icon ? 'ml-1.5' : ''} flex-1 text-left`}>
              {method.name_text}
            </span>
            <div
              className="w-4 h-4 rounded-full border flex items-center justify-center border-white"
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

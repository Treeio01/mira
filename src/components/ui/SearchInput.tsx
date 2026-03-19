import { SearchIcon } from '../icons/SearchIcon';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Поиск' }: SearchInputProps) {
  return (
    <div className="flex w-full gap-2.5 items-center rounded-lg bg-surface-alt px-4 py-3">
      <SearchIcon className="shrink-0" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-medium text-sm text-white tracking-[-0.02em] w-full outline-none bg-transparent placeholder:text-white/64"
        placeholder={placeholder}
      />
    </div>
  );
}

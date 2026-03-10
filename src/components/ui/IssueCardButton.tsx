import { Fixed } from './FixedLayer';

export function IssueCardButton() {
  return (
    <Fixed>
      <button
        data-fixed
        className="p-3 z-50 fixed bottom-[78px] left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-32px)] bg-[#661AFF] rounded-lg flex justify-center items-center active:scale-[0.97] transition-transform duration-150"
      >
        <span className="font-medium text-white leading-[140%] tracking-[-0.02em]">
          Выпустить карту
        </span>
      </button>
    </Fixed>
  );
}

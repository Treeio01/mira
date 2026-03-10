import { useNavigate } from 'react-router-dom';
import { BottomBar } from './BottomBar';
import { ArrowBackIcon } from '../icons/ArrowBackIcon';

export function BackBottomBar() {
  const navigate = useNavigate();

  return (
    <BottomBar>
      <button
        onClick={() => navigate(-1)}
        className="flex z-50 w-full p-3 justify-center gap-1.5 items-center rounded-full relative z-10"
      >
        <ArrowBackIcon />
        <span className="text-white text-sm font-medium tracking-[-0.02em]">
          Вернуться назад
        </span>
      </button>
    </BottomBar>
  );
}

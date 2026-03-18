import { useNavigate } from "react-router-dom";
import { GradientHeader } from "../ui/GradientHeader";
import { Skeleton } from "../ui/Skeleton";
import { EyeIcon } from "../icons/EyeIcon";
import { EyeHiddenIcon } from "../icons/EyeHiddenIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { UserIdBadge } from "../ui/UserIdBadge";
import {
  useMenuStore,
  useUiStore,
  selectMainBalance,
  selectBalanceVisible,
} from "../../store";
import { formatBalance } from "../../lib/format";
import { ROUTES } from "../../lib/routes";

interface BalanceCardProps {
  title?: string;
  balance?: number;
  loading?: boolean;
  status?: string;
  topUpRoute?: string;
  topUpLabel?: string;
}

export function BalanceCard({
  title = "Основной баланс",
  balance,
  loading,
  status,
  topUpRoute,
  topUpLabel = "Пополнить баланс",
}: BalanceCardProps) {
  const navigate = useNavigate();
  const visible = useUiStore(selectBalanceVisible);
  const toggleVisible = useUiStore((s) => s.toggleBalanceVisible);
  const mainBalance = useMenuStore(selectMainBalance);
  const displayBalance = balance ?? mainBalance;
  const { whole, cents } = formatBalance(displayBalance);

  return (
    <GradientHeader className="flex-col gap-2.5">
      <div className="flex w-full items-start">
        <div className="flex flex-col gap-1.5 w-full z-10">
          <span className="text-white/64 font-medium text-sm leading-[140%] tracking-[-0.01em]">
            {title}
          </span>
          <div className="flex items-center gap-4">
            {loading ? (
              <Skeleton className="h-10 w-44" />
            ) : (
              <div className="relative">
                <span className={`font-semibold flex text-[36px] leading-[112%] tracking-[-0.01em] text-white transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                  {whole}
                  <span className="text-white/64">{cents}</span>
                </span>
                <span className={`font-semibold absolute inset-0 flex text-[36px] leading-[112%] tracking-[-0.01em] text-white transition-opacity duration-200 ${visible ? 'opacity-0' : 'opacity-100'}`}>
                  **********
                </span>
              </div>
            )}
            {!loading && (
              <button onClick={toggleVisible} aria-label={visible ? 'Скрыть баланс' : 'Показать баланс'}>
                {visible ? <EyeIcon /> : <EyeHiddenIcon />}
              </button>
            )}
          </div>
        </div>
        {status && (
          <div className="flex p-1 gap-1 items-center backdrop-blur-[10px] bg-black/24 rounded-[8px]">
            <div className={`flex rounded-full w-[7px] h-[7px] ${status === 'active' ? 'bg-[#00FF44]' : 'bg-[#FF3B30]'}`} />
            <span className="text-[12px] font-medium text-white leading-[140%] tracking-[-0.02em]">
              {status === 'active' ? 'Активная' : 'Неактивная'}
            </span>
          </div>
        )}
      </div>

      <div className="flex w-full justify-between z-10 items-stretch">
        <button onClick={() => navigate(topUpRoute ?? ROUTES.TOP_UP)} className="flex px-4 py-3 gap-2.5 items-center bg-[#661AFF] rounded-lg w-max">
          <PlusIcon />
          <span className="text-white font-medium leading-[140%] tracking-[-0.02em] whitespace-nowrap">
            {topUpLabel}
          </span>
        </button>
        <UserIdBadge />
      </div>
    </GradientHeader>
  );
}

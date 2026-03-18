import historyTransaction from '../../assets/img/history-transaction.png';
import reffererSystem from '../../assets/img/refferer-system.png';
import eSim from '../../assets/img/e-sim.png';
import supportImg from '../../assets/img/support.png';
import { ActionCard } from '../cards/ActionCard';
import { BankIcon } from '../icons/BankIcon';
import { ReferralIcon } from '../icons/ReferralIcon';
import { PuzzleIcon } from '../icons/PuzzleIcon';
import { ROUTES } from '../../lib/routes';
import { useMenuStore, selectSupportUrl } from '../../store';
import { openUrl } from '../../lib/openUrl';

export function QuickActions() {
  const supportUrl = useMenuStore(selectSupportUrl);

  const handleSupport = () => {
    if (supportUrl) openUrl(supportUrl);
  };

  return (
    <div className="flex w-full gap-1.5 flex-col">
      <div className="flex w-full gap-1.5">
        <ActionCard
          icon={<BankIcon />}
          image={historyTransaction}
          label={<>История<br />транзакций</>}
        />
        <ActionCard
          icon={<ReferralIcon />}
          image={reffererSystem}
          label={<>Реферальная<br />система</>}
          to={ROUTES.REFERRAL}
        />
      </div>
      <div className="flex w-full gap-1.5">
        <ActionCard
          icon={<PuzzleIcon />}
          image={eSim}
          label="eSIM"
          to={ROUTES.ESIM}
        />
        <ActionCard
          icon={<PuzzleIcon />}
          image={supportImg}
          label={<>Служба<br />поддержки</>}
          onClick={handleSupport}
        />
      </div>
    </div>
  );
}

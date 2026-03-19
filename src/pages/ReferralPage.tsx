import { useEffect } from 'react';
import { GradientHeader } from '../components/ui/GradientHeader';
import { InfoRow } from '../components/ui/InfoRow';
import { InfoRowSkeleton } from '../components/ui/InfoRowSkeleton';
import { CopyButton } from '../components/ui/CopyButton';
import { PageLayout } from '../components/ui/PageLayout';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { UserIdBadge } from '../components/ui/UserIdBadge';
import { useReferralStore, selectRefData, selectRefLoading, selectRefError } from '../store';
import blurImage from '../assets/img/reffer-header-blur-img.png';
import noBlurImage from '../assets/img/reffer-header-img.png';

export default function ReferralPage() {
  const data = useReferralStore(selectRefData);
  const isLoading = useReferralStore(selectRefLoading);
  const error = useReferralStore(selectRefError);
  const fetchRefInfo = useReferralStore((s) => s.fetchRefInfo);

  useEffect(() => {
    fetchRefInfo();
  }, [fetchRefInfo]);

  if (error) {
    return (
      <PageLayout centered>
        <ErrorMessage message={error} onRetry={fetchRefInfo} />
      </PageLayout>
    );
  }

  const showSkeleton = isLoading || !data;

  return (
    <PageLayout>
      <GradientHeader isCustomBg={true} className="items-end justify-between gap-2.5">
        <img src={blurImage} className="absolute top-0 right-[40px]" alt="" />
        <img src={noBlurImage} className="absolute bottom-0 h-full right-[80px]" alt="" />
        <span className="text-white font-semibold text-2xl leading-[120%] tracking-[-0.02em] z-10">
          Реферальная<br />система
        </span>
        <UserIdBadge />
      </GradientHeader>

      <div
        className="flex w-full rounded-[14px] border border-white/15 overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #15111F, #341474)' }}
      >
        <div className="flex w-full py-[18px] px-[44px] items-center justify-center">
          <span className="text-white font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center">
            Приглашайте новых пользователей
            <br />и зарабатывайте $2.50 с каждой
            <br />их покупки
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-white font-medium text-xl leading-[160%] tracking-[-0.02em]">
          Ссылка для приглашения
        </span>
        {showSkeleton ? (
          <InfoRowSkeleton />
        ) : (
          <div className="flex w-full bg-surface-alt items-center rounded-lg gap-2.5 py-3 px-4">
            <span className="text-text-hint min-w-0 truncate text-sm font-medium leading-[140%] tracking-[-0.02em]">
              {data.referral_link}
            </span>
            <CopyButton text={data.referral_link} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <span className="text-white font-medium text-xl leading-[160%] tracking-[-0.02em]">
          Статистика
        </span>
        <div className="flex flex-col gap-1.5 w-full">
          {showSkeleton ? (
            <>
              <InfoRowSkeleton />
              <InfoRowSkeleton />
            </>
          ) : (
            <>
              <InfoRow label="Приглашено пользователей" value={String(data.total_referrals)} />
              <InfoRow label="Заработано" value={`$${data.referral_income.toFixed(2)}`} />
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

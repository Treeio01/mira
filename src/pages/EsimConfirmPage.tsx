import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { PageLayout } from "../components/ui/PageLayout";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Skeleton } from "../components/ui/Skeleton";
import { ConfirmFooter } from "../components/ui/ConfirmFooter";
import { ROUTES } from "../lib/routes";
import {
  useIssueStore,
  selectEsims,
  selectEsimsLoading,
  selectEsimsError,
  selectBuying,
  selectBuyError,
} from "../store";

export function EsimConfirmPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const parsed = type ? Number(type) : NaN;
  const categoryId = Number.isFinite(parsed) ? parsed : null;

  const esims = useIssueStore(selectEsims);
  const isLoading = useIssueStore(selectEsimsLoading);
  const error = useIssueStore(selectEsimsError);
  const buying = useIssueStore(selectBuying);
  const buyError = useIssueStore(selectBuyError);
  const fetchEsims = useIssueStore((s) => s.fetchEsims);
  const buyEsim = useIssueStore((s) => s.buyEsim);

  useEffect(() => {
    if (esims.length === 0) fetchEsims();
  }, [esims.length, fetchEsims]);

  const esim = useMemo(
    () => esims.find((e) => e.category_id === categoryId) ?? null,
    [esims, categoryId],
  );

  const handleBuy = async () => {
    if (!esim) return;
    const success = await buyEsim(esim.category_id);
    if (success) navigate(ROUTES.CARDS);
  };

  if (error) {
    return (
      <PageLayout centered>
        <ErrorMessage message={error} onRetry={fetchEsims} />
      </PageLayout>
    );
  }

  if (isLoading || !esim) {
    return (
      <PageLayout>
        <PageHeader
          title={
            <>
              Подтверждение
              <br />
              покупки ESIM
            </>
          }
        />
        <div className="flex flex-col gap-2.5 bg-[#181424] rounded-[8px] p-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-full" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={
          <>
            Подтверждение
            <br />
            покупки ESIM
          </>
        }
      />

      <div className="flex flex-col gap-2.5 bg-[#181424] rounded-[8px] p-4">
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-white font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
            {esim.text_name}
          </span>
          <div className="flex flex-col gap-5">
            <span className="text-white/64 font-medium text-[12px] leading-[140%] tracking-[-0.02em] whitespace-pre-line">
              {esim.description_full}
            </span>
          </div>
        </div>
      </div>

      <ConfirmFooter
        total={esim.price}
        buying={buying}
        buyError={buyError}
        onConfirm={handleBuy}
      />
    </PageLayout>
  );
}

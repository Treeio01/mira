import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { BackBottomBar } from "../components/ui/BackBottomBar";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Skeleton } from "../components/ui/Skeleton";
import { useIssueStore, selectEsims, selectEsimsLoading, selectEsimsError } from "../store";
import { ROUTES } from "../lib/routes";

export function EsimPage() {
  const navigate = useNavigate();
  const esims = useIssueStore(selectEsims);
  const isLoading = useIssueStore(selectEsimsLoading);
  const error = useIssueStore(selectEsimsError);
  const fetchEsims = useIssueStore((s) => s.fetchEsims);

  useEffect(() => {
    fetchEsims();
  }, [fetchEsims]);

  return (
    <>
      <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-19">
        <PageHeader title={<>Покупка<br />ESIM</>} />

        {error ? (
          <ErrorMessage message={error} onRetry={fetchEsims} />
        ) : (
          <div className="flex flex-col gap-3">
            {isLoading
              ? Array.from({ length: 1 }, (_, i) => (
                  <div key={i} className="flex flex-col gap-3 bg-[#181424] rounded-[8px] p-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full rounded-[8px]" />
                  </div>
                ))
              : esims.map((esim) => (
                  <div
                    key={esim.category_id}
                    className="flex flex-col gap-3 bg-[#181424] rounded-[8px] p-4"
                  >
                    <div className="flex justify-between items-center gap-4.5">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <span className="text-white font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
                          {esim.text_name}
                        </span>
                        <span className="text-white/64 font-medium text-[12px] leading-[140%] tracking-[-0.02em]">
                          {esim.description}
                        </span>
                      </div>
                      <span className="text-white font-medium leading-[150%] tracking-[-0.01em] whitespace-nowrap">
                        ${esim.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(ROUTES.ESIM_CONFIRM(esim.category_id))}
                      className="flex w-full py-3 justify-center items-center rounded-[8px] bg-[#661AFF] active:scale-[0.97] transition-transform"
                    >
                      <span className="text-white font-medium text-sm leading-[140%] tracking-[-0.02em]">
                        Купить
                      </span>
                    </button>
                  </div>
                ))}
          </div>
        )}
      </div>
      <BackBottomBar />
    </>
  );
}

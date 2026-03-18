import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { PageLayout } from "../components/ui/PageLayout";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { IssueCategoryCard } from "../components/cards/IssueCategoryCard";
import { IssueCategorySkeleton } from "../components/cards/IssueCategorySkeleton";
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

  const handleBuy = useCallback(
    (categoryId: number) => navigate(ROUTES.ESIM_CONFIRM(categoryId)),
    [navigate],
  );

  return (
    <PageLayout>
      <PageHeader title={<>Покупка<br />ESIM</>} />

      {error ? (
        <ErrorMessage message={error} onRetry={fetchEsims} />
      ) : (
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <IssueCategorySkeleton count={1} />
          ) : (
            esims.map((esim) => (
              <IssueCategoryCard
                key={esim.category_id}
                name={esim.text_name}
                description={esim.description}
                price={esim.price}
                onBuy={() => handleBuy(esim.category_id)}
              />
            ))
          )}
        </div>
      )}
    </PageLayout>
  );
}

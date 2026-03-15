import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { BackBottomBar } from '../components/ui/BackBottomBar';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Skeleton } from '../components/ui/Skeleton';
import { useIssueStore, selectIssueCards, selectIssueCardsLoading, selectIssueCardsError } from '../store';
import { ROUTES } from '../lib/routes';

export function CardCreatePage() {
  const navigate = useNavigate();
  const cards = useIssueStore(selectIssueCards);
  const isLoading = useIssueStore(selectIssueCardsLoading);
  const error = useIssueStore(selectIssueCardsError);
  const fetchCards = useIssueStore((s) => s.fetchCards);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <>
      <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-19">
        <PageHeader title={<>Выпуск<br />карты</>} />

        {error ? (
          <ErrorMessage message={error} onRetry={fetchCards} />
        ) : (
          <div className="flex flex-col gap-3">
            {isLoading
              ? Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex flex-col gap-3 bg-[#181424] rounded-[8px] p-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full rounded-[8px]" />
                  </div>
                ))
              : cards.map((card) => (
                  <div
                    key={card.category_id}
                    className="flex flex-col gap-3 bg-[#181424] rounded-[8px] p-4"
                  >
                    <div className="flex justify-between items-center gap-4.5">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <span className="text-white font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
                          {card.text_name}
                        </span>
                        <span className="text-white/64 font-medium text-[12px] leading-[140%] tracking-[-0.02em]">
                          {card.description}
                        </span>
                      </div>
                      <span className="text-white font-medium leading-[150%] tracking-[-0.01em] whitespace-nowrap">
                        ${card.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(ROUTES.CARD_CONFIRM(card.category_id))}
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

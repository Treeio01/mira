import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { PageLayout } from '../components/ui/PageLayout';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { IssueCategoryCard } from '../components/cards/IssueCategoryCard';
import { IssueCategorySkeleton } from '../components/cards/IssueCategorySkeleton';
import { useIssueStore, selectIssueCards, selectIssueCardsLoading, selectIssueCardsError } from '../store';
import { ROUTES } from '../lib/routes';

export default function CardCreatePage() {
  const navigate = useNavigate();
  const cards = useIssueStore(selectIssueCards);
  const isLoading = useIssueStore(selectIssueCardsLoading);
  const error = useIssueStore(selectIssueCardsError);
  const fetchCards = useIssueStore((s) => s.fetchCards);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleBuy = useCallback(
    (categoryId: number) => navigate(ROUTES.CARD_CONFIRM(categoryId)),
    [navigate],
  );

  return (
    <PageLayout>
      <PageHeader title={<>Выпуск<br />карты</>} />

      {error ? (
        <ErrorMessage message={error} onRetry={fetchCards} />
      ) : (
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <IssueCategorySkeleton count={3} />
          ) : (
            cards.map((card) => (
              <IssueCategoryCard
                key={card.category_id}
                name={card.text_name}
                description={card.description}
                price={card.price}
                onBuy={() => handleBuy(card.category_id)}
              />
            ))
          )}
        </div>
      )}
    </PageLayout>
  );
}

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { PageLayout } from "../components/ui/PageLayout";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Skeleton } from "../components/ui/Skeleton";
import { ConfirmFooter } from "../components/ui/ConfirmFooter";
import { ROUTES } from "../lib/routes";
import {
  useIssueStore,
  selectIssueCards,
  selectIssueCardsLoading,
  selectIssueCardsError,
  selectBuying,
  selectBuyError,
} from "../store";
import { useModal } from "../components/ui/ModalContext";

export default function CardConfirmPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const parsed = type ? Number(type) : NaN;
  const categoryId = Number.isFinite(parsed) ? parsed : null;

  const { showModal } = useModal();
  const cards = useIssueStore(selectIssueCards);
  const isLoading = useIssueStore(selectIssueCardsLoading);
  const error = useIssueStore(selectIssueCardsError);
  const buying = useIssueStore(selectBuying);
  const buyError = useIssueStore(selectBuyError);
  const fetchCards = useIssueStore((s) => s.fetchCards);
  const buyCard = useIssueStore((s) => s.buyCard);
  const clearBuyError = useIssueStore((s) => s.clearBuyError);

  const [amount, setAmount] = useState("");

  useEffect(() => {
    clearBuyError();
    if (cards.length === 0) fetchCards();
  }, [cards.length, fetchCards, clearBuyError]);

  const card = useMemo(
    () => cards.find((c) => c.category_id === categoryId) ?? null,
    [cards, categoryId],
  );

  const handleBuy = async () => {
    if (!card || !amount) return;
    const success = await buyCard(card.category_id, parseFloat(amount));
    if (success) {
      showModal({
        title: "Успешно",
        description:
          "Карта успешно приобретена и вскоре появится в вашем профиле. Баланс будет пополнен в течение нескольких минут.",
        buttonText: "Отлично",
        onButtonClick: () => navigate(ROUTES.CARDS),
      });
    }
  };

  if (error) {
    return (
      <PageLayout centered>
        <ErrorMessage message={error} onRetry={fetchCards} />
      </PageLayout>
    );
  }

  if (isLoading || !card) {
    return (
      <PageLayout>
        <PageHeader
          title={
            <>
              Подтверждение
              <br />
              покупки карты
            </>
          }
        />
        <div className="flex flex-col gap-2.5 bg-surface-alt rounded-[8px] p-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </PageLayout>
    );
  }

  const amountNum = amount ? parseFloat(amount) : 0;
  const totalNum = amountNum
    ? card.price + amountNum * (1 + card.top_up_comission / 100)
    : card.price;
  const isBelowMin = amountNum > 0 && amountNum < card.min_top_up;

  return (
    <PageLayout>
      <PageHeader
        title={
          <>
            Подтверждение
            <br />
            покупки карты
          </>
        }
      />

      <div className="flex flex-col gap-2.5 bg-surface-alt rounded-[8px] p-4">
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-white font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
            {card.text_name}
          </span>
          <div className="flex flex-col gap-5">
            <span className="text-white/64 font-medium text-[12px] leading-[140%] tracking-[-0.02em] whitespace-pre-line">
              {card.description_full}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 bg-[#231C33] rounded-[8px] p-4">
          <span className="text-white font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
            Запрещенные категории:
          </span>
          <span className="text-white/64 font-medium text-[12px] leading-[140%] tracking-[-0.02em]">
            {card.restricted_categories}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 bg-[#231C33] rounded-[8px] p-4">
          <span className="text-white font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
            Запрещенные ГЕО для оплат:
          </span>
          <span className="text-white/64 font-medium text-[12px] leading-[140%] tracking-[-0.02em]">
            {card.restricted_geos}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 bg-[#231C33] rounded-[8px] p-4">
          <span className="text-white font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
            Запрещенные MCC:
          </span>
          <span className="text-white/64 font-medium text-[12px] leading-[140%] tracking-[-0.02em]">
            {card.restricted_mcc}
          </span>
        </div>
      </div>

      <ConfirmFooter
        total={totalNum}
        buying={buying}
        buyError={buyError}
        disabled={!amount || parseFloat(amount) < card.min_top_up}
        onConfirm={handleBuy}
      >
        <div className="flex flex-col w-full gap-1.5">
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              clearBuyError();
            }}
            placeholder="Введите сумму пополнения"
            className={`w-full bg-[#221C33] rounded-lg p-4 font-medium text-[14px] leading-[140%] tracking-[-0.02em] outline-none placeholder:text-white/40 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isBelowMin ? "text-danger-light" : "text-white"}`}
          />
          <span className={`text-center font-medium text-[14px] leading-[140%] tracking-[-0.02em] ${isBelowMin ? "text-danger-light" : "text-white/40"}`}>
            Минимальная сумма пополнения для <br /> активации карты -{" "}
            ${card.min_top_up.toFixed(2)}
          </span>
        </div>
      </ConfirmFooter>
    </PageLayout>
  );
}

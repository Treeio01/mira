import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { PageLayout } from "../components/ui/PageLayout";
import { ConfirmFooter } from "../components/ui/ConfirmFooter";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Skeleton } from "../components/ui/Skeleton";
import { MethodList } from "../components/ui/MethodList";
import {
  getTopUpsMethodsCard,
  getTopUpsFinalAmountCard,
  createTopUpCard,
} from "../services/api";
import type { TopUpMethodItem } from "../services/api";
import { getWebApp } from "../lib/telegram";
import { extractErrorMessage } from "../lib/error";
import { invalidateMenuCache } from "../store/menu";
import { ROUTES } from "../lib/routes";

export function CardTopUpPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cardId = id ? Number(id) : NaN;

  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Methods state
  const [methods, setMethods] = useState<TopUpMethodItem[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [balanceMaxAmount, setBalanceMaxAmount] = useState(0);
  const [usdToRub, setUsdToRub] = useState<number | null>(null);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [methodsError, setMethodsError] = useState<string | null>(null);

  // Final amount state
  const [finalText, setFinalText] = useState<string | null>(null);
  const [finalLoading, setFinalLoading] = useState(false);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchMethods = useCallback(async () => {
    setMethodsLoading(true);
    setMethodsError(null);
    try {
      const data = await getTopUpsMethodsCard();
      setMethods(data.methods);
      setUserBalance(data.user_balance);
      setBalanceMaxAmount(data.max_amount);
      setUsdToRub(data.usd_to_rub ?? null);
      setMethodsLoading(false);
    } catch (e) {
      setMethodsError(extractErrorMessage(e, "Не удалось загрузить методы пополнения"));
      setMethodsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const amountNum = amount ? parseFloat(amount) : 0;
  const isBalanceMethod = selectedMethod === "balance";

  const activeMethod = useMemo(
    () => methods.find((m) => m.name === selectedMethod) ?? null,
    [methods, selectedMethod],
  );

  const effectiveMaxAmount = isBalanceMethod
    ? Math.min(activeMethod?.max_amount ?? Infinity, balanceMaxAmount)
    : activeMethod?.max_amount ?? Infinity;

  const isBelowMin = activeMethod !== null && amountNum > 0 && amountNum < activeMethod.min_amount;
  const isAboveMax = activeMethod !== null && amountNum > effectiveMaxAmount;
  const isAmountInvalid = amountNum <= 0 || isBelowMin || isAboveMax;
  const isValid = !isAmountInvalid && selectedMethod !== null;

  // Fetch final amount for non-balance methods
  useEffect(() => {
    if (!isValid || !selectedMethod || isBalanceMethod) {
      setFinalText(null);
      return;
    }

    let cancelled = false;
    setFinalLoading(true);

    getTopUpsFinalAmountCard({ method_name: selectedMethod, amount: amountNum })
      .then((data) => {
        if (!cancelled) setFinalText(data.final_amount_text);
      })
      .catch(() => {
        if (!cancelled) setFinalText(null);
      })
      .finally(() => {
        if (!cancelled) setFinalLoading(false);
      });

    return () => { cancelled = true; };
  }, [selectedMethod, amountNum, isValid, isBalanceMethod]);

  const displayTotal = amountNum;

  const handleSubmit = useCallback(async () => {
    if (!isValid || !selectedMethod || !Number.isFinite(cardId)) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const { result } = await createTopUpCard({
        card_id: cardId,
        method_name: selectedMethod,
        amount: amountNum,
      });

      if (result.status === "success") {
        invalidateMenuCache();
        setSuccessMessage("Отправили средства. Карта пополнится в течении нескольких минут");
        return;
      }

      if (result.payment_url) {
        const webApp = getWebApp();
        if (webApp) {
          webApp.openLink(result.payment_url);
        } else {
          window.open(result.payment_url, '_blank');
        }
      }
    } catch (e) {
      setSubmitError(extractErrorMessage(e, "Не удалось создать пополнение"));
    } finally {
      setSubmitting(false);
    }
  }, [isValid, selectedMethod, amountNum, cardId]);

  if (!Number.isFinite(cardId)) {
    return (
      <PageLayout centered>
        <ErrorMessage message="Некорректный ID карты" />
      </PageLayout>
    );
  }

  if (successMessage) {
    return (
      <PageLayout centered>
        <div className="flex flex-col items-center gap-4 px-4">
          <div className="w-16 h-16 rounded-full bg-[#661AFF]/20 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#661AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-white font-medium text-center text-[16px] leading-[140%]">
            {successMessage}
          </p>
          <button
            onClick={() => navigate(ROUTES.CARD(cardId))}
            className="flex w-full py-3 justify-center items-center rounded-lg bg-[#661AFF] active:scale-[0.97] transition-transform mt-2"
          >
            <span className="text-white font-medium text-sm leading-[140%] tracking-[-0.02em]">
              Вернуться к карте
            </span>
          </button>
        </div>
      </PageLayout>
    );
  }

  if (methodsError) {
    return (
      <PageLayout centered>
        <ErrorMessage message={methodsError} onRetry={fetchMethods} />
      </PageLayout>
    );
  }

  if (methodsLoading) {
    return (
      <PageLayout>
        <PageHeader
          title={
            <>
              Пополнение
              <br />
              карты
            </>
          }
        />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </PageLayout>
    );
  }

  const limitHint = activeMethod
    ? isBalanceMethod
      ? `От $${activeMethod.min_amount} до $${effectiveMaxAmount.toFixed(2)}`
      : `От $${activeMethod.min_amount} до $${activeMethod.max_amount}`
    : "Выберите метод оплаты";

  const buttonText = finalLoading
    ? "Расчёт..."
    : isBalanceMethod
      ? "Пополнить карту"
      : "Перейти к оплате";

  return (
    <PageLayout>
      <PageHeader
        title={
          <>
            Пополнение
            <br />
            карты
          </>
        }
      />

      <div className="flex flex-col w-full gap-3">
        <div className="flex flex-col gap-1.5">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму пополнения в $"
            className={`w-full bg-[#181424] rounded-lg py-3 px-4 font-medium text-[14px] leading-[140%] tracking-[-0.02em] outline-none placeholder:text-white/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isBelowMin || isAboveMax ? "text-[#FF5C5C]" : "text-white"}`}
          />
          <div className="flex justify-between px-1">
            <span className={`font-medium text-[14px] leading-[140%] tracking-[-0.02em] ${isBelowMin || isAboveMax ? "text-[#FF5C5C]" : "text-white/20"}`}>
              {limitHint}
            </span>
            {isBalanceMethod ? (
              <span className="text-white/20 font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
                Баланс: ${userBalance.toFixed(2)}
              </span>
            ) : usdToRub ? (
              <span className="text-white/20 font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
                Курс: 1 $ ≈ {usdToRub} ₽
              </span>
            ) : null}
          </div>
        </div>

        <h2 className="text-white font-medium text-[20px] leading-[160%] tracking-[-0.02em]">
          Способ оплаты
        </h2>

        <MethodList
          methods={methods}
          selectedMethod={selectedMethod}
          onSelect={setSelectedMethod}
        />
      </div>

      <ConfirmFooter
        total={displayTotal}
        totalText={isBalanceMethod ? undefined : finalText ?? undefined}
        buying={submitting}
        buyError={submitError}
        disabled={!isValid || (!isBalanceMethod && finalLoading)}
        onConfirm={handleSubmit}
        buttonText={buttonText}
        wrapped={false}
      />
    </PageLayout>
  );
}

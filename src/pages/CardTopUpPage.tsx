import { useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { PageLayout } from "../components/ui/PageLayout";
import { ConfirmFooter } from "../components/ui/ConfirmFooter";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Skeleton } from "../components/ui/Skeleton";
import { MethodList } from "../components/ui/MethodList";
import { AmountInput } from "../components/ui/AmountInput";
import { SuccessScreen } from "../components/ui/SuccessScreen";
import { useTopUpFlow } from "../hooks/useTopUpFlow";
import { useSubmit } from "../hooks/useSubmit";
import {
  getTopUpsMethodsCard,
  getTopUpsFinalAmountCard,
  createTopUpCard,
} from "../services/api";
import type { TopUpMethodItem } from "../services/api";
import { openUrl } from "../lib/openUrl";
import { invalidateMenuCache } from "../store/menu";
import { ROUTES } from "../lib/routes";

export function CardTopUpPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cardId = id ? Number(id) : NaN;

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Store extra data from methods response
  const extraRef = useRef({ userBalance: 0, maxAmount: 0 });

  const fetchMethodsFn = useCallback(async () => {
    const data = await getTopUpsMethodsCard();
    extraRef.current = { userBalance: data.user_balance, maxAmount: data.max_amount };
    return { methods: data.methods, usdToRub: data.usd_to_rub };
  }, []);

  const fetchFinalFn = useCallback(async (method: string, amount: number) => {
    const data = await getTopUpsFinalAmountCard({ method_name: method, amount });
    return { finalAmountText: data.final_amount_text };
  }, []);

  const getEffectiveMax = useCallback((method: TopUpMethodItem) => {
    if (method.name === "balance") {
      return Math.min(method.max_amount, extraRef.current.maxAmount);
    }
    return method.max_amount;
  }, []);

  const skipFinalForMethod = useCallback((name: string) => name === "balance", []);

  const flow = useTopUpFlow({
    fetchMethodsFn,
    fetchFinalFn,
    getEffectiveMax,
    skipFinalForMethod,
  });

  const isBalanceMethod = flow.selectedMethod === "balance";

  const { submit, submitting, error: submitError } = useSubmit(
    useCallback(async () => {
      if (!flow.isValid || !flow.selectedMethod || !Number.isFinite(cardId)) return;

      const { result } = await createTopUpCard({
        card_id: cardId,
        method_name: flow.selectedMethod,
        amount: flow.amountNum,
      });

      if (result.status === "success") {
        invalidateMenuCache();
        setSuccessMessage("Отправили средства. Карта пополнится в течении нескольких минут");
        return;
      }

      if (result.payment_url) openUrl(result.payment_url);
    }, [flow.isValid, flow.selectedMethod, flow.amountNum, cardId]),
    'Не удалось создать пополнение',
  );

  if (!Number.isFinite(cardId)) {
    return (
      <PageLayout centered>
        <ErrorMessage message="Некорректный ID карты" />
      </PageLayout>
    );
  }

  if (successMessage) {
    return (
      <SuccessScreen
        message={successMessage}
        buttonText="Вернуться к карте"
        onAction={() => navigate(ROUTES.CARD(cardId))}
      />
    );
  }

  if (flow.methodsError) {
    return (
      <PageLayout centered>
        <ErrorMessage message={flow.methodsError} onRetry={flow.retryMethods} />
      </PageLayout>
    );
  }

  if (flow.methodsLoading) {
    return (
      <PageLayout>
        <CardTopUpHeader />
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

  const limitHint = flow.activeMethod
    ? isBalanceMethod
      ? `От $${flow.activeMethod.min_amount} до $${(getEffectiveMax(flow.activeMethod)).toFixed(2)}`
      : `От $${flow.activeMethod.min_amount} до $${flow.activeMethod.max_amount}`
    : "Выберите метод оплаты";

  const rightHint = isBalanceMethod
    ? `Баланс: $${extraRef.current.userBalance.toFixed(2)}`
    : flow.usdToRub
      ? `Курс: 1 $ ≈ ${flow.usdToRub} ₽`
      : undefined;

  const buttonText = flow.finalLoading
    ? "Расчёт..."
    : isBalanceMethod
      ? "Пополнить карту"
      : "Перейти к оплате";

  return (
    <PageLayout>
      <CardTopUpHeader />

      <div className="flex flex-col w-full gap-3">
        <AmountInput
          value={flow.amount}
          onChange={flow.setAmount}
          hasError={flow.isBelowMin || flow.isAboveMax}
          hint={limitHint}
          rightHint={rightHint}
        />

        <h2 className="text-white font-medium text-[20px] leading-[160%] tracking-[-0.02em]">
          Способ оплаты
        </h2>

        <MethodList
          methods={flow.methods}
          selectedMethod={flow.selectedMethod}
          onSelect={flow.setSelectedMethod}
        />
      </div>

      <ConfirmFooter
        total={flow.amountNum}
        totalText={isBalanceMethod ? undefined : flow.finalText ?? undefined}
        buying={submitting}
        buyError={submitError}
        disabled={!flow.isValid || (!isBalanceMethod && flow.finalLoading)}
        onConfirm={submit}
        buttonText={buttonText}
        wrapped={false}
      />
    </PageLayout>
  );
}

function CardTopUpHeader() {
  return (
    <PageHeader
      title={
        <>
          Пополнение
          <br />
          карты
        </>
      }
    />
  );
}

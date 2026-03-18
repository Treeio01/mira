import { useCallback } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { PageLayout } from "../components/ui/PageLayout";
import { ConfirmFooter } from "../components/ui/ConfirmFooter";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Skeleton } from "../components/ui/Skeleton";
import { MethodList } from "../components/ui/MethodList";
import { AmountInput } from "../components/ui/AmountInput";
import { useTopUpFlow } from "../hooks/useTopUpFlow";
import { useSubmit } from "../hooks/useSubmit";
import { getTopUpsMethods, getTopUpsFinalAmount, createTopUpBalance } from "../services/api";
import { openUrl } from "../lib/openUrl";

const fetchMethodsFn = async () => {
  const data = await getTopUpsMethods();
  return { methods: data.methods, usdToRub: data.usd_to_rub };
};

const fetchFinalFn = async (method: string, amount: number) => {
  const data = await getTopUpsFinalAmount({ method_name: method, amount });
  return { finalAmountText: data.final_amount_text };
};

export function TopUpPage() {
  const flow = useTopUpFlow({ fetchMethodsFn, fetchFinalFn });

  const { submit, submitting, error: submitError } = useSubmit(
    useCallback(async () => {
      if (!flow.isValid || !flow.selectedMethod || !flow.finalText) return;
      const { result } = await createTopUpBalance({
        method_name: flow.selectedMethod,
        amount: flow.amountNum,
        final_amount: flow.amountNum, // server recalculates
      });
      if (result.payment_url) openUrl(result.payment_url);
    }, [flow.isValid, flow.selectedMethod, flow.amountNum, flow.finalText]),
    'Не удалось создать пополнение',
  );

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
        <TopUpHeader title="баланса" />
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
    ? `От $${flow.activeMethod.min_amount} до $${flow.activeMethod.max_amount}`
    : "Выберите метод оплаты";

  return (
    <PageLayout>
      <TopUpHeader title="баланса" />

      <div className="flex flex-col w-full gap-3">
        <AmountInput
          value={flow.amount}
          onChange={flow.setAmount}
          hasError={flow.isBelowMin || flow.isAboveMax}
          hint={limitHint}
          rightHint={flow.usdToRub ? `Курс: 1 $ ≈ ${flow.usdToRub} ₽` : undefined}
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
        totalText={flow.finalText ?? undefined}
        buying={submitting}
        buyError={submitError}
        disabled={!flow.isValid || flow.finalLoading}
        onConfirm={submit}
        buttonText={flow.finalLoading ? "Расчёт..." : "Перейти к оплате"}
        wrapped={false}
      />
    </PageLayout>
  );
}

function TopUpHeader({ title }: { title: string }) {
  return (
    <PageHeader
      title={
        <>
          Пополнение
          <br />
          {title}
        </>
      }
    />
  );
}

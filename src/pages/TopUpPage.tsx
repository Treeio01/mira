import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { PageLayout } from "../components/ui/PageLayout";
import { ConfirmFooter } from "../components/ui/ConfirmFooter";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Skeleton } from "../components/ui/Skeleton";
import {
  useTopUpStore,
  selectTopUpMethods,
  selectUsdToRub,
  selectMethodsLoading,
  selectMethodsError,
  selectFinalAmount,
  selectFinalLoading,
} from "../store";

export function TopUpPage() {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const methods = useTopUpStore(selectTopUpMethods);
  const usdToRub = useTopUpStore(selectUsdToRub);
  const methodsLoading = useTopUpStore(selectMethodsLoading);
  const methodsError = useTopUpStore(selectMethodsError);
  const finalData = useTopUpStore(selectFinalAmount);
  const finalLoading = useTopUpStore(selectFinalLoading);
  const fetchMethods = useTopUpStore((s) => s.fetchMethods);
  const fetchFinalAmount = useTopUpStore((s) => s.fetchFinalAmount);
  const clearFinal = useTopUpStore((s) => s.clearFinal);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const amountNum = amount ? parseFloat(amount) : 0;

  const activeMethod = useMemo(
    () => methods.find((m) => m.name === selectedMethod) ?? null,
    [methods, selectedMethod],
  );

  const isBelowMin = activeMethod !== null && amountNum > 0 && amountNum < activeMethod.min_amount;
  const isAboveMax = activeMethod !== null && amountNum > activeMethod.max_amount;
  const isAmountInvalid = amountNum <= 0 || isBelowMin || isAboveMax;
  const isValid = !isAmountInvalid && selectedMethod !== null;

  useEffect(() => {
    if (isValid && selectedMethod && amountNum > 0) {
      fetchFinalAmount(selectedMethod, amountNum);
    } else {
      clearFinal();
    }
  }, [selectedMethod, amountNum, isValid, fetchFinalAmount, clearFinal]);

  const displayTotal = finalData?.final_amount ?? amountNum;

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: перенаправление на оплату
  };

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
              баланса
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

  return (
    <PageLayout>
      <PageHeader
        title={
          <>
            Пополнение
            <br />
            баланса
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
              {activeMethod
                ? `От $${activeMethod.min_amount} до $${activeMethod.max_amount}`
                : "Выберите метод оплаты"}
            </span>
            {usdToRub && (
              <span className="text-white/20 font-medium text-[14px] leading-[140%] tracking-[-0.02em]">
                Курс: 1 $ ≈ {usdToRub} ₽
              </span>
            )}
          </div>
        </div>

        <h2 className="text-white font-medium text-[20px] leading-[160%] tracking-[-0.02em]">
          Способ оплаты
        </h2>

        <div className="flex flex-col gap-1.5">
          {methods.map((method) => {
            const isSelected = selectedMethod === method.name;
            return (
              <button
                key={method.name}
                onClick={() => setSelectedMethod(method.name)}
                className={`flex items-center w-full py-3 px-5 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[#211B30] border border-[#423660]"
                    : "bg-[#181424] border border-transparent"
                }`}
              >
                <img
                  src={method.icon}
                  alt={method.name_text}
                  className="w-4 h-4 rounded-md object-contain"
                />
                <span className="text-white font-medium text-[14px] leading-[140%] tracking-[-0.02em] ml-1.5 flex-1 text-left">
                  {method.name_text}
                </span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center border-white`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <ConfirmFooter
        total={displayTotal}
        totalText={finalData?.final_amount_text}
        disabled={!isValid || finalLoading}
        onConfirm={handleSubmit}
        buttonText={finalLoading ? "Расчёт..." : "Перейти к оплате"}
        wrapped={false}
      />
    </PageLayout>
  );
}

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { TopUpMethodItem } from '../services/api';
import { extractErrorMessage } from '../lib/error';

// ── Types ──

interface MethodsResult {
  methods: TopUpMethodItem[];
  usdToRub?: number | null;
}

interface FinalResult {
  finalAmountText: string;
}

interface TopUpFlowConfig {
  fetchMethodsFn: () => Promise<MethodsResult>;
  fetchFinalFn: (methodName: string, amount: number) => Promise<FinalResult>;
  /** Override max amount for specific method (e.g. balance method) */
  getEffectiveMax?: (method: TopUpMethodItem) => number;
  /** Methods that skip final amount calculation */
  skipFinalForMethod?: (methodName: string) => boolean;
}

interface TopUpFlowState {
  // Input
  amount: string;
  setAmount: (v: string) => void;
  selectedMethod: string | null;
  setSelectedMethod: (v: string | null) => void;
  amountNum: number;

  // Methods
  methods: TopUpMethodItem[];
  usdToRub: number | null;
  methodsLoading: boolean;
  methodsError: string | null;
  retryMethods: () => void;

  // Active method & validation
  activeMethod: TopUpMethodItem | null;
  isBelowMin: boolean;
  isAboveMax: boolean;
  isValid: boolean;

  // Final amount
  finalText: string | null;
  finalLoading: boolean;
  skipsFinal: boolean;
}

// ── Hook ──

export function useTopUpFlow({
  fetchMethodsFn,
  fetchFinalFn,
  getEffectiveMax,
  skipFinalForMethod,
}: TopUpFlowConfig): TopUpFlowState {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const [methods, setMethods] = useState<TopUpMethodItem[]>([]);
  const [usdToRub, setUsdToRub] = useState<number | null>(null);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [methodsError, setMethodsError] = useState<string | null>(null);

  const [finalText, setFinalText] = useState<string | null>(null);
  const [finalLoading, setFinalLoading] = useState(false);
  const finalAbortRef = useRef<AbortController | null>(null);

  // Stable refs for config functions to avoid re-triggering effects
  const fetchMethodsRef = useRef(fetchMethodsFn);
  const fetchFinalRef = useRef(fetchFinalFn);
  const getEffectiveMaxRef = useRef(getEffectiveMax);
  const skipFinalRef = useRef(skipFinalForMethod);
  useEffect(() => {
    fetchMethodsRef.current = fetchMethodsFn;
    fetchFinalRef.current = fetchFinalFn;
    getEffectiveMaxRef.current = getEffectiveMax;
    skipFinalRef.current = skipFinalForMethod;
  });

  const retryMethods = useCallback(async () => {
    setMethodsLoading(true);
    setMethodsError(null);
    try {
      const data = await fetchMethodsRef.current();
      setMethods(data.methods);
      setUsdToRub(data.usdToRub ?? null);
    } catch (e) {
      setMethodsError(extractErrorMessage(e, 'Не удалось загрузить методы пополнения'));
    } finally {
      setMethodsLoading(false);
    }
  }, []);

  useEffect(() => {
    retryMethods();
  }, [retryMethods]);

  const amountNum = parseFloat(amount) || 0;

  const activeMethod = useMemo(
    () => methods.find((m) => m.name === selectedMethod) ?? null,
    [methods, selectedMethod],
  );

  const effectiveMax = activeMethod
    ? (getEffectiveMaxRef.current?.(activeMethod) ?? activeMethod.max_amount)
    : Infinity;

  const isBelowMin = activeMethod !== null && amountNum > 0 && amountNum < activeMethod.min_amount;
  const isAboveMax = activeMethod !== null && amountNum > effectiveMax;
  const isAmountInvalid = amountNum <= 0 || isBelowMin || isAboveMax;
  const isValid = !isAmountInvalid && selectedMethod !== null;

  const skipsFinal = selectedMethod != null && (skipFinalRef.current?.(selectedMethod) ?? false);

  useEffect(() => {
    finalAbortRef.current?.abort();

    if (!isValid || !selectedMethod || skipsFinal) {
      setFinalText(null);
      setFinalLoading(false);
      return;
    }

    const controller = new AbortController();
    finalAbortRef.current = controller;
    setFinalLoading(true);

    fetchFinalRef.current(selectedMethod, amountNum)
      .then((data) => {
        if (!controller.signal.aborted) setFinalText(data.finalAmountText);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFinalText(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setFinalLoading(false);
      });

    return () => controller.abort();
  }, [selectedMethod, amountNum, isValid, skipsFinal]);

  return {
    amount, setAmount,
    selectedMethod, setSelectedMethod,
    amountNum,
    methods, usdToRub, methodsLoading, methodsError, retryMethods,
    activeMethod, isBelowMin, isAboveMax, isValid,
    finalText, finalLoading, skipsFinal,
  };
}

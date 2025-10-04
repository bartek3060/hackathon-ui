"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GreenButton } from "@/components/GreenButton";

interface PensionInputFormProps {
  onSubmit: (amount: string) => void;
  isLoading?: boolean;
}

export function PensionInputForm({ onSubmit, isLoading }: PensionInputFormProps) {
  const [desiredAmount, setDesiredAmount] = useState("");

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    return new Intl.NumberFormat("pl-PL").format(parseInt(numbers));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setDesiredAmount(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (desiredAmount) {
      onSubmit(desiredAmount);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-base font-medium text-gray-700">
          Jaka powinna być Twoja miesięczna emerytura?
        </Label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              id="amount"
              type="text"
              value={formatCurrency(desiredAmount)}
              onChange={handleAmountChange}
              placeholder="5 000"
              disabled={isLoading}
              className="text-2xl font-semibold h-14 pr-16 border-2 border-gray-300 focus-visible:border-custom-2 focus-visible:ring-custom-2 disabled:opacity-50"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">
              PLN
            </span>
          </div>
          <GreenButton
            type="submit"
            disabled={!desiredAmount || isLoading}
            className="h-14 px-8 text-base font-semibold"
          >
            {isLoading ? "Ładowanie..." : "Pokaż symulację"}
          </GreenButton>
        </div>
        <p className="text-sm text-gray-500">
          Podaj kwotę miesięcznej emerytury w złotych
        </p>
      </div>
    </form>
  );
}


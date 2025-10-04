"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PensionComparison } from "./PensionComparison";
import type { PensionComparisonData } from "@/app/api/pension-comparison/route";

export function RetirementSimulator() {
  const [desiredAmount, setDesiredAmount] = useState("");
  const [comparisonData, setComparisonData] = useState<PensionComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desiredAmount) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/pension-comparison", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ desiredAmount: parseInt(desiredAmount) }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received comparison data:", data);
        setComparisonData(data);
      } else {
        console.error("API response not ok:", response.status);
      }
    } catch (error) {
      console.error("Error fetching pension comparison:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    return new Intl.NumberFormat("pl-PL").format(parseInt(numbers));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setDesiredAmount(value);
  };

  const numericAmount = desiredAmount ? parseInt(desiredAmount) : 0;
  const yearlyAmount = numericAmount * 12;
  const twentyYearAmount = yearlyAmount * 20;
  const thirtyYearAmount = yearlyAmount * 30;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Kalkulator emerytury
            </h1>
            <p className="text-lg text-muted-foreground">
              Poznaj swoją przyszłość finansową
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    Jaka powinna być Twoja miesięczna emerytura?
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="text"
                      value={formatCurrency(desiredAmount)}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className="text-4xl font-semibold h-auto py-4 pr-20 bg-muted border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-custom-2"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-muted-foreground">
                      PLN
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Wpisz kwotę, którą chciałbyś otrzymywać co miesiąc
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={!desiredAmount || isLoading}
                  className="w-full h-14 text-base font-semibold bg-custom-2 hover:bg-custom-2/90 text-white"
                >
                  {isLoading ? "Obliczanie..." : "Oblicz plan oszczędnościowy"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {desiredAmount && !comparisonData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Rocznie</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-3xl">
                    {new Intl.NumberFormat("pl-PL").format(yearlyAmount)} PLN
                  </CardTitle>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Przez 20 lat</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-3xl">
                    {new Intl.NumberFormat("pl-PL", {
                      notation: "compact",
                      maximumFractionDigits: 1
                    }).format(twentyYearAmount)} PLN
                  </CardTitle>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Przez 30 lat</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-3xl">
                    {new Intl.NumberFormat("pl-PL", {
                      notation: "compact",
                      maximumFractionDigits: 1
                    }).format(thirtyYearAmount)} PLN
                  </CardTitle>
                </CardContent>
              </Card>
            </div>
          )}

          {comparisonData && (
            <div className="mt-6">
              <PensionComparison data={comparisonData} />
            </div>
          )}
          
          {isLoading && (
            <Card className="mt-6">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Ładowanie porównania...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


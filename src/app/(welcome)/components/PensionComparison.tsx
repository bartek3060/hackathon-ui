"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PensionComparisonData } from "@/app/api/pension-comparison/route";

interface PensionComparisonProps {
  data: PensionComparisonData;
}

export function PensionComparison({ data }: PensionComparisonProps) {
  const maxAmount = Math.max(...data.groups.map((g) => g.averageAmount), data.userAmount);

  console.log("PensionComparison rendering with data:", data);

  return (
    <Card className="border-2 border-custom-2">
      <CardHeader>
        <CardTitle className="text-2xl">Porównanie z obecnymi emeryturami</CardTitle>
        <p className="text-sm text-muted-foreground">
          Średnia krajowa: {new Intl.NumberFormat("pl-PL").format(data.nationalAverage)} PLN
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <TooltipProvider>
              {data.groups.map((group) => {
                const widthPercentage = (group.averageAmount / maxAmount) * 100;
                const isUserInRange =
                  data.userAmount >= group.averageAmount * 0.8 &&
                  data.userAmount <= group.averageAmount * 1.2;

                return (
                  <div key={group.id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-foreground">{group.name}</span>
                      <span className="text-muted-foreground">
                        {new Intl.NumberFormat("pl-PL").format(group.averageAmount)} PLN
                      </span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative h-14 bg-muted/50 rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-custom-2 border border-border">
                          <div
                            className="absolute inset-y-0 left-0 transition-all duration-300 flex items-center px-4 rounded-lg"
                            style={{
                              width: `${widthPercentage}%`,
                              backgroundColor: group.color,
                            }}
                          >
                            <span className="text-white font-semibold text-sm drop-shadow-md">
                              {group.percentage}%
                            </span>
                          </div>
                          {isUserInRange && (
                            <div
                              className="absolute inset-y-0 w-1.5 bg-custom-1 shadow-lg z-10"
                              style={{
                                left: `${(data.userAmount / maxAmount) * 100}%`,
                              }}
                            >
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold text-custom-1 whitespace-nowrap bg-background px-2 py-1 rounded">
                                Twoja
                              </div>
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm p-3">
                        <p className="text-sm leading-relaxed">{group.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </TooltipProvider>
          </div>

          {data.userAmount > 0 && (
            <div className="pt-6 border-t">
              <div className="flex items-center justify-between p-4 bg-custom-2/10 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Twoja docelowa emerytura</p>
                  <p className="text-2xl font-bold text-custom-2">
                    {new Intl.NumberFormat("pl-PL").format(data.userAmount)} PLN
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Różnica do średniej</p>
                  <p
                    className={`text-xl font-bold ${
                      data.userAmount >= data.nationalAverage
                        ? "text-custom-2"
                        : "text-custom-6"
                    }`}
                  >
                    {data.userAmount >= data.nationalAverage ? "+" : ""}
                    {new Intl.NumberFormat("pl-PL").format(
                      data.userAmount - data.nationalAverage
                    )}{" "}
                    PLN
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalculatedPensionDto } from "@/api/dtos/calculated-pension.dto";

interface RealtimeResultsPanelProps {
  data?: CalculatedPensionDto;
  isLoading?: boolean;
  error?: string;
}

export function RealtimeResultsPanel({
  data,
  isLoading,
  error,
}: RealtimeResultsPanelProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-start">
        <div className="w-full max-w-2xl bg-gray-50 rounded-3xl p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-custom-2/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-custom-2 animate-spin"
                  >
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Obliczanie wyników...
                </h2>
              </div>
            </div>

            {/* Main Pension Amounts Skeleton */}
            <div className="grid gap-4">
              <Card className="bg-gradient-to-r from-custom-2/5 to-custom-2/10 border-custom-2/20 p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-56 animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40 animate-pulse" />
                      <Skeleton className="h-8 w-32 animate-pulse" />
                      <Skeleton className="h-3 w-24 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-44 animate-pulse" />
                      <Skeleton className="h-8 w-32 animate-pulse" />
                      <Skeleton className="h-3 w-36 animate-pulse" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Replacement Rate and Comparison Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white border-gray-200 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg animate-pulse" />
                    <Skeleton className="h-5 w-36 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-8 w-20 animate-pulse" />
                    <Skeleton className="h-3 w-48 animate-pulse" />
                  </div>
                </div>
              </Card>

              <Card className="bg-white border-gray-200 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg animate-pulse" />
                    <Skeleton className="h-5 w-32 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-8 w-24 animate-pulse" />
                    <Skeleton className="h-3 w-44 animate-pulse" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Salary Information Skeleton */}
            <Card className="bg-white border-gray-200 p-4">
              <div className="space-y-4">
                <Skeleton className="h-5 w-32 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48 animate-pulse" />
                    <Skeleton className="h-6 w-28 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-52 animate-pulse" />
                    <Skeleton className="h-6 w-28 animate-pulse" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Future Scenarios Skeleton */}
            <Card className="bg-white border-gray-200 p-4">
              <div className="space-y-4">
                <Skeleton className="h-5 w-48 animate-pulse" />
                <Skeleton className="h-4 w-56 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <Skeleton className="h-6 w-16 mx-auto animate-pulse" />
                    <Skeleton className="h-6 w-20 mx-auto animate-pulse" />
                    <Skeleton className="h-3 w-24 mx-auto animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <Skeleton className="h-6 w-16 mx-auto animate-pulse" />
                    <Skeleton className="h-6 w-20 mx-auto animate-pulse" />
                    <Skeleton className="h-3 w-24 mx-auto animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <Skeleton className="h-6 w-16 mx-auto animate-pulse" />
                    <Skeleton className="h-6 w-20 mx-auto animate-pulse" />
                    <Skeleton className="h-3 w-24 mx-auto animate-pulse" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Expected vs Actual Comparison Skeleton */}
            <Card className="border-2 bg-amber-50 border-amber-200 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg animate-pulse" />
                  <Skeleton className="h-5 w-56 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-28 animate-pulse" />
                    <Skeleton className="h-5 w-20 animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32 animate-pulse" />
                    <Skeleton className="h-5 w-20 animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <Skeleton className="h-4 w-40 animate-pulse" />
                    <Skeleton className="h-5 w-16 animate-pulse" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Metrics Skeleton */}
            <Card className="bg-gray-100 border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24 mx-auto animate-pulse" />
                  <Skeleton className="h-6 w-12 mx-auto animate-pulse" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 mx-auto animate-pulse" />
                  <Skeleton className="h-6 w-20 mx-auto animate-pulse" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 mx-auto animate-pulse" />
                  <Skeleton className="h-6 w-16 mx-auto animate-pulse" />
                </div>
              </div>
            </Card>

            {/* Loading indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-custom-2 animate-pulse"></div>
              <div
                className="w-2 h-2 rounded-full bg-custom-2 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-custom-2 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <span className="ml-2 animate-pulse">
                Przetwarzanie danych...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-start">
        <div className="w-full max-w-2xl bg-gray-50 rounded-3xl p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Błąd obliczeń
                </h2>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex items-start">
        <div className="w-full max-w-2xl bg-gray-50 rounded-3xl p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-custom-2/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-custom-2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Wyniki w czasie rzeczywistym
                </h2>
              </div>
            </div>

            {/* Main Info Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Panel informacyjny
                  </h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Po uzupełnieniu danych w formularzu, tutaj pojawią się
                    szczegółowe prognozy Twojej przyszłej emerytury.
                  </p>
                </div>
              </div>
            </Card>

            {/* Preview Cards */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Co zostanie obliczone
              </h3>

              <div className="grid gap-3">
                <Card className="bg-white border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-custom-2/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-custom-2"
                      >
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Prognozowana emerytura
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Wartość nominalna i realna z uwzględnieniem inflacji
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Współczynnik zastąpienia
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Stosunek emerytury do ostatniego wynagrodzenia
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-600"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Porównanie krajowe
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Zestawienie ze średnią emeryturą w Polsce
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-amber-600"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Scenariusze przyszłościowe
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Wpływ dłuższej pracy na wysokość świadczenia
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Status Footer */}
            <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <p className="text-xs font-medium text-gray-700">
                  Moduł kalkulacji zostanie aktywowany po wprowadzeniu danych
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-start">
      <div className="w-full max-w-2xl bg-gray-50 rounded-3xl p-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-custom-2/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-custom-2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Prognoza emerytury
              </h2>
            </div>
          </div>

          {/* Main Pension Amounts */}
          <div className="grid gap-4">
            <Card className="bg-gradient-to-r from-custom-2/5 to-custom-2/10 border-custom-2/20 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Wysokość świadczenia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      Z uwzględnieniem chorobowych
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(data.pensionWithSick)}
                    </p>
                    <p className="text-xs text-gray-500">miesięcznie</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      Z uwzględnieniem chorobowych (realistycznie)
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(data.pensionWithSickRealistic)}
                    </p>
                    <p className="text-xs text-gray-500">
                      z uwzględnieniem inflacji
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      Bez uwzględnienia chorobowych
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(data.pensionWithoutSick)}
                    </p>
                    <p className="text-xs text-gray-500">miesięcznie</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      Bez uwzględnienia chorobowych (realistycznie)
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(data.pensionWithoutSickRealistic)}
                    </p>
                    <p className="text-xs text-gray-500">
                      z uwzględnieniem inflacji
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Replacement Rate and Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white border-gray-200 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      Stopa zastąpienia
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(data.replacementRate)}
                    </p>
                    <p className="text-xs text-gray-500">
                      stosunek do ostatniego wynagrodzenia
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Future Scenarios */}
            <Card className="bg-white border-gray-200 p-4">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Scenariusze przyszłościowe
                </h4>
                <p className="text-sm text-gray-600">
                  Wzrost świadczenia przy dłuższej pracy
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <Badge variant="outline" className="text-xs">
                      +1 rok
                    </Badge>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(data.pensionAfter1Year)}
                    </p>
                    <p className="text-xs text-gray-500">miesięcznie</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Badge variant="outline" className="text-xs">
                      +2 lata
                    </Badge>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(data.pensionAfter2Years)}
                    </p>
                    <p className="text-xs text-gray-500">miesięcznie</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Badge variant="outline" className="text-xs">
                      +5 lat
                    </Badge>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(data.pensionAfter5Years)}
                    </p>
                    <p className="text-xs text-gray-500">miesięcznie</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Expected vs Actual Comparison */}
            {data.expectedPension > 0 && (
              <Card
                className={`border-2 p-4 ${
                  data.pensionWithSick >= data.expectedPension
                    ? "bg-green-50 border-green-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        data.pensionWithSick >= data.expectedPension
                          ? "bg-green-100"
                          : "bg-amber-100"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={
                          data.pensionWithSick >= data.expectedPension
                            ? "text-green-600"
                            : "text-amber-600"
                        }
                      >
                        {data.pensionWithSick >= data.expectedPension ? (
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        ) : (
                          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path>
                        )}
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h4
                      className={`font-semibold ${
                        data.pensionWithSick >= data.expectedPension
                          ? "text-green-900"
                          : "text-amber-900"
                      }`}
                    >
                      {data.pensionWithSick >= data.expectedPension
                        ? "Osiągnięto oczekiwane świadczenie"
                        : "Wymagana dłuższa praca"}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Oczekiwane:</span>
                      <span className="font-semibold">
                        {formatCurrency(data.expectedPension)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Prognozowane (z chorobowymi):
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(data.pensionWithSick)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Prognozowane (bez chorobowych):
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(data.pensionWithoutSick)}
                      </span>
                    </div>
                    {data.pensionWithSick < data.expectedPension && (
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-gray-600">
                          Dodatkowe lata pracy:
                        </span>
                        <span className="font-semibold text-amber-700">
                          {data.additionalYearsToReachDesiredPension}{" "}
                          {data.additionalYearsToReachDesiredPension === 1
                            ? "rok"
                            : "lat"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Additional Metrics */}
            <Card className="bg-gray-100 border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Lata pracy</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {data.totalWorkYears}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Składki łącznie</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(data.totalContributions)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Stopa inflacji</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPercentage(data.inflationRate)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

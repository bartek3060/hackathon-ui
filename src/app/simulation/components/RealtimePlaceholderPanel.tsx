import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function RealtimePlaceholderPanel() {
  return (
    <div className="h-full flex items-start">
      <div className="w-full bg-gray-50 rounded-3xl p-8">
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
                Wyniki w czasie rzeczywistym
              </h2>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
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
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">
                    Panel informacyjny
                  </p>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Po uzupełnieniu danych w formularzu, tutaj pojawią się szczegółowe prognozy Twojej przyszłej emerytury.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3">
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
                    <p className="text-sm font-medium text-gray-900">Prognozowana emerytura</p>
                    <p className="text-xs text-gray-600 mt-0.5">Wartość nominalna i realna z uwzględnieniem inflacji</p>
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
                    <p className="text-sm font-medium text-gray-900">Współczynnik zastąpienia</p>
                    <p className="text-xs text-gray-600 mt-0.5">Stosunek emerytury do ostatniego wynagrodzenia</p>
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
                    <p className="text-sm font-medium text-gray-900">Porównanie krajowe</p>
                    <p className="text-xs text-gray-600 mt-0.5">Zestawienie ze średnią emeryturą w Polsce</p>
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
                    <p className="text-sm font-medium text-gray-900">Scenariusz +2 lata</p>
                    <p className="text-xs text-gray-600 mt-0.5">Wpływ dłuższej pracy na wysokość świadczenia</p>
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

          <span className="sr-only">
            Panel wyników w czasie rzeczywistym będzie wyświetlał prognozy emerytalne 
            na podstawie wprowadzonych danych po zakończeniu pełnej implementacji systemu kalkulacji.
          </span>
        </div>
      </div>
    </div>
  );
}


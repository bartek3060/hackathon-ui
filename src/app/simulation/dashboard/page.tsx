"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PastSalary = { year: number; amount: number };
type FutureAmount = { year: number; amount: number };
type SickPeriod = { year: number; days: number };

export default function SimulationDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("configuration");

  const currentYear = new Date().getFullYear();

  const [pastSalaries, setPastSalaries] = useState<PastSalary[]>(
    Array.from({ length: 5 }).map((_, idx) => ({
      year: currentYear - (5 - idx),
      amount: 5000,
    }))
  );

  const [forecastMode, setForecastMode] = useState<"indexation" | "amounts">(
    "indexation"
  );
  const [annualIndexationPct, setAnnualIndexationPct] = useState<number>(5);
  const [futureAmounts, setFutureAmounts] = useState<FutureAmount[]>([
    { year: currentYear + 1, amount: 5200 },
    { year: currentYear + 2, amount: 5400 },
  ]);

  const [sickPast, setSickPast] = useState<SickPeriod[]>([
    { year: currentYear - 2, days: 12 },
  ]);
  const [sickFuture, setSickFuture] = useState<SickPeriod[]>([
    { year: currentYear + 1, days: 10 },
  ]);

  const [includeZusFields, setIncludeZusFields] = useState<boolean>(true);
  const [zusAccount, setZusAccount] = useState<number>(20000);
  const [zusSubAccount, setZusSubAccount] = useState<number>(8000);

  const [simulationData] = useState({
    age: 35,
    gender: "man" as const,
    grossSalary: 5000,
    workStartYear: 2010,
    workEndYear: 2045,
  });

  const zusGrowthSeries = useMemo(() => {
    const years = 10;
    const monthlyRate = 0.02 / 12;
    const series: { year: number; account: number; subAccount: number }[] = [];
    let acc = zusAccount;
    let sub = zusSubAccount;
    for (let i = 0; i < years; i++) {
      acc = acc * (1 + monthlyRate * 12);
      sub = sub * (1 + monthlyRate * 12);
      series.push({ year: currentYear + i, account: acc, subAccount: sub });
    }
    return series;
  }, [currentYear, zusAccount, zusSubAccount]);

  const maxY = Math.max(
    ...zusGrowthSeries.map((p) => Math.max(p.account, p.subAccount)),
    1
  );

  const detailedProjections = useMemo(() => {
    const workYears = simulationData.workEndYear - simulationData.workStartYear;
    const yearsToRetirement = simulationData.workEndYear - currentYear;

    const allSalaries = [
      ...pastSalaries.map((p) => ({ year: p.year, amount: p.amount })),
      { year: currentYear, amount: simulationData.grossSalary },
      ...(forecastMode === "indexation"
        ? Array.from({ length: yearsToRetirement }, (_, i) => ({
            year: currentYear + i + 1,
            amount:
              simulationData.grossSalary *
              Math.pow(1 + annualIndexationPct / 100, i + 1),
          }))
        : futureAmounts.map((f) => ({ year: f.year, amount: f.amount }))),
    ].sort((a, b) => a.year - b.year);

    const averageSalary =
      allSalaries.reduce((sum, s) => sum + s.amount, 0) / allSalaries.length;

    const totalSickDays = [...sickPast, ...sickFuture].reduce(
      (sum, s) => sum + s.days,
      0
    );
    const sickLeaveReduction = (totalSickDays / (workYears * 365)) * 0.05;

    const basePension = averageSalary * 0.24 * (workYears / 40);
    const monthlyPension = Math.max(
      basePension * (1 - sickLeaveReduction),
      1200
    );

    const combinedZusCapital = includeZusFields
      ? zusAccount + zusSubAccount
      : 0;
    const monthlyFromCapital = combinedZusCapital / 240;

    const finalMonthlyPension = monthlyPension + monthlyFromCapital;

    const inflationRate = 0.035;
    const realPension =
      finalMonthlyPension * Math.pow(1 - inflationRate, yearsToRetirement);

    const replacementRate = Math.min(
      (finalMonthlyPension / averageSalary) * 100,
      80
    );

    const totalContributions = averageSalary * 12 * workYears * 0.1976;

    const pensionAfter1Year = finalMonthlyPension * 1.08;
    const pensionAfter2Years = finalMonthlyPension * 1.15;
    const pensionAfter5Years = finalMonthlyPension * 1.35;

    return {
      averageSalary: Math.round(averageSalary),
      monthlyPension: Math.round(finalMonthlyPension),
      realPension: Math.round(realPension),
      replacementRate: Math.round(replacementRate * 10) / 10,
      totalContributions: Math.round(totalContributions),
      pensionAfter1Year: Math.round(pensionAfter1Year),
      pensionAfter2Years: Math.round(pensionAfter2Years),
      pensionAfter5Years: Math.round(pensionAfter5Years),
      workYears,
      totalSickDays,
      sickLeaveImpact: Math.round(sickLeaveReduction * 100 * 10) / 10,
      zusCapitalImpact: Math.round(monthlyFromCapital),
    };
  }, [
    pastSalaries,
    futureAmounts,
    forecastMode,
    annualIndexationPct,
    sickPast,
    sickFuture,
    includeZusFields,
    zusAccount,
    zusSubAccount,
    simulationData,
    currentYear,
  ]);

  const handleSave = () => {
    const payload = {
      pastSalaries,
      forecastMode,
      annualIndexationPct,
      futureAmounts,
      sickPast,
      sickFuture,
      includeZusFields,
      zusAccount,
      zusSubAccount,
    };
    try {
      localStorage.setItem("simulation-dashboard", JSON.stringify(payload));
      // Switch to analysis tab after successful save
      setActiveTab("analysis");
    } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("simulation-dashboard");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.pastSalaries))
          setPastSalaries(parsed.pastSalaries);
        if (
          parsed.forecastMode === "indexation" ||
          parsed.forecastMode === "amounts"
        )
          setForecastMode(parsed.forecastMode);
        if (typeof parsed.annualIndexationPct === "number")
          setAnnualIndexationPct(parsed.annualIndexationPct);
        if (Array.isArray(parsed.futureAmounts))
          setFutureAmounts(parsed.futureAmounts);
        if (Array.isArray(parsed.sickPast)) setSickPast(parsed.sickPast);
        if (Array.isArray(parsed.sickFuture)) setSickFuture(parsed.sickFuture);
        if (typeof parsed.includeZusFields === "boolean")
          setIncludeZusFields(parsed.includeZusFields);
        if (typeof parsed.zusAccount === "number")
          setZusAccount(parsed.zusAccount);
        if (typeof parsed.zusSubAccount === "number")
          setZusSubAccount(parsed.zusSubAccount);
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-custom-2 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">📊</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard symulatora emerytalnego
              </h1>
              <p className="text-gray-600">
                Dostosuj prognozy: przeszłe wynagrodzenia, przyszłe
                indeksacje/kwoty, okresy chorobowe oraz podgląd wzrostu środków
                w ZUS.
              </p>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="configuration"
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="configuration">Konfiguracja</TabsTrigger>
            <TabsTrigger value="analysis">Analiza i wykresy</TabsTrigger>
          </TabsList>

          <TabsContent value="configuration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">💰</span>
                      Przeszłe wynagrodzenia
                    </CardTitle>
                    <CardDescription>
                      Wprowadź wynagrodzenia z poprzednich lat
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {pastSalaries.map((row, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-3 gap-3 items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <input
                            type="number"
                            className="col-span-1 h-10 rounded-lg border border-gray-300 px-3 text-sm"
                            placeholder="Rok"
                            value={row.year}
                            onChange={(e) => {
                              const v = Number(e.target.value) || row.year;
                              const next = [...pastSalaries];
                              next[idx] = { ...row, year: v };
                              setPastSalaries(next);
                            }}
                          />
                          <input
                            type="number"
                            className="col-span-2 h-10 rounded-lg border border-gray-300 px-3 text-sm"
                            placeholder="Kwota (PLN)"
                            value={row.amount}
                            onChange={(e) => {
                              const v = Number(e.target.value) || 0;
                              const next = [...pastSalaries];
                              next[idx] = { ...row, amount: v };
                              setPastSalaries(next);
                            }}
                          />
                        </div>
                      ))}
                      <div className="flex gap-3">
                        <button
                          className="px-3 py-2 rounded-lg bg-custom-2 text-white text-sm hover:bg-custom-2/90 transition-colors"
                          onClick={() =>
                            setPastSalaries((s) => [
                              ...s,
                              {
                                year:
                                  (s[s.length - 1]?.year ?? currentYear) + 1,
                                amount: 0,
                              },
                            ])
                          }
                        >
                          + Dodaj rok
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
                          onClick={() => setPastSalaries((s) => s.slice(0, -1))}
                        >
                          Usuń ostatni
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📈</span>
                      Prognoza przyszłych wynagrodzeń
                    </CardTitle>
                    <CardDescription>
                      Wybierz tryb prognozowania przyszłych wynagrodzeń
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3 text-sm">
                      <button
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          forecastMode === "indexation"
                            ? "bg-custom-2 text-white border-custom-2"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setForecastMode("indexation")}
                      >
                        📊 Wskaźnik indeksacji
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          forecastMode === "amounts"
                            ? "bg-custom-2 text-white border-custom-2"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setForecastMode("amounts")}
                      >
                        💰 Konkretnie kwoty
                      </button>
                    </div>

                    {forecastMode === "indexation" ? (
                      <div className="grid grid-cols-2 gap-3 items-center p-3 bg-gray-50 rounded-lg">
                        <label className="text-sm font-medium text-gray-700">
                          Roczna indeksacja (%)
                        </label>
                        <input
                          type="number"
                          className="h-10 rounded-lg border border-gray-300 px-3 text-sm"
                          placeholder="np. 5.0"
                          value={annualIndexationPct}
                          onChange={(e) =>
                            setAnnualIndexationPct(Number(e.target.value) || 0)
                          }
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {futureAmounts.map((row, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-3 gap-3 items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <input
                              type="number"
                              className="col-span-1 h-10 rounded-lg border border-gray-300 px-3 text-sm"
                              placeholder="Rok"
                              value={row.year}
                              onChange={(e) => {
                                const v = Number(e.target.value) || row.year;
                                const next = [...futureAmounts];
                                next[idx] = { ...row, year: v };
                                setFutureAmounts(next);
                              }}
                            />
                            <input
                              type="number"
                              className="col-span-2 h-10 rounded-lg border border-gray-300 px-3 text-sm"
                              placeholder="Kwota (PLN)"
                              value={row.amount}
                              onChange={(e) => {
                                const v = Number(e.target.value) || 0;
                                const next = [...futureAmounts];
                                next[idx] = { ...row, amount: v };
                                setFutureAmounts(next);
                              }}
                            />
                          </div>
                        ))}
                        <div className="flex gap-3">
                          <button
                            className="px-3 py-2 rounded-lg bg-custom-2 text-white text-sm hover:bg-custom-2/90 transition-colors"
                            onClick={() =>
                              setFutureAmounts((s) => [
                                ...s,
                                {
                                  year:
                                    (s[s.length - 1]?.year ?? currentYear) + 1,
                                  amount: 0,
                                },
                              ])
                            }
                          >
                            + Dodaj rok
                          </button>
                          <button
                            className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
                            onClick={() =>
                              setFutureAmounts((s) => s.slice(0, -1))
                            }
                          >
                            Usuń ostatni
                          </button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🏥</span>
                      Okresy choroby
                    </CardTitle>
                    <CardDescription>
                      Wprowadź dni chorobowe z przeszłości i przyszłości
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">Przeszłość</Badge>
                        </div>
                        <div className="space-y-3">
                          {sickPast.map((row, idx) => (
                            <div
                              key={idx}
                              className="grid grid-cols-3 gap-3 items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <input
                                type="number"
                                className="col-span-1 h-10 rounded-lg border border-gray-300 px-3 text-sm"
                                placeholder="Rok"
                                value={row.year}
                                onChange={(e) => {
                                  const v = Number(e.target.value) || row.year;
                                  const next = [...sickPast];
                                  next[idx] = { ...row, year: v };
                                  setSickPast(next);
                                }}
                              />
                              <input
                                type="number"
                                className="col-span-2 h-10 rounded-lg border border-gray-300 px-3 text-sm"
                                placeholder="Dni"
                                value={row.days}
                                onChange={(e) => {
                                  const v = Number(e.target.value) || 0;
                                  const next = [...sickPast];
                                  next[idx] = { ...row, days: v };
                                  setSickPast(next);
                                }}
                              />
                            </div>
                          ))}
                          <div className="flex gap-3">
                            <button
                              className="px-3 py-2 rounded-lg bg-custom-2 text-white text-sm hover:bg-custom-2/90 transition-colors"
                              onClick={() =>
                                setSickPast((s) => [
                                  ...s,
                                  {
                                    year:
                                      (s[s.length - 1]?.year ?? currentYear) +
                                      1,
                                    days: 0,
                                  },
                                ])
                              }
                            >
                              + Dodaj rok
                            </button>
                            <button
                              className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
                              onClick={() => setSickPast((s) => s.slice(0, -1))}
                            >
                              Usuń ostatni
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline">Przyszłość</Badge>
                        </div>
                        <div className="space-y-3">
                          {sickFuture.map((row, idx) => (
                            <div
                              key={idx}
                              className="grid grid-cols-3 gap-3 items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <input
                                type="number"
                                className="col-span-1 h-10 rounded-lg border border-gray-300 px-3 text-sm"
                                placeholder="Rok"
                                value={row.year}
                                onChange={(e) => {
                                  const v = Number(e.target.value) || row.year;
                                  const next = [...sickFuture];
                                  next[idx] = { ...row, year: v };
                                  setSickFuture(next);
                                }}
                              />
                              <input
                                type="number"
                                className="col-span-2 h-10 rounded-lg border border-gray-300 px-3 text-sm"
                                placeholder="Dni"
                                value={row.days}
                                onChange={(e) => {
                                  const v = Number(e.target.value) || 0;
                                  const next = [...sickFuture];
                                  next[idx] = { ...row, days: v };
                                  setSickFuture(next);
                                }}
                              />
                            </div>
                          ))}
                          <div className="flex gap-3">
                            <button
                              className="px-3 py-2 rounded-lg bg-custom-2 text-white text-sm hover:bg-custom-2/90 transition-colors"
                              onClick={() =>
                                setSickFuture((s) => [
                                  ...s,
                                  {
                                    year:
                                      (s[s.length - 1]?.year ?? currentYear) +
                                      1,
                                    days: 0,
                                  },
                                ])
                              }
                            >
                              + Dodaj rok
                            </button>
                            <button
                              className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
                              onClick={() =>
                                setSickFuture((s) => s.slice(0, -1))
                              }
                            >
                              Usuń ostatni
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <button
                        className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors flex items-center gap-2"
                        onClick={() => router.push("/simulation")}
                      >
                        ← Wróć do symulacji
                      </button>
                      <button
                        className="px-6 py-3 rounded-xl bg-custom-2 text-white hover:bg-custom-2/90 transition-colors flex items-center gap-2"
                        onClick={handleSave}
                      >
                        💾 Zapisz ustawienia
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6"></div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🏦</span>
                    Podgląd wzrostu środków ZUS
                  </CardTitle>
                  <CardDescription>
                    Wizualizacja wzrostu środków na koncie i subkoncie ZUS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeZusFields}
                        onChange={(e) => setIncludeZusFields(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Włącz podanie środków ZUS
                      </label>
                    </div>
                    <div></div>
                    <label className="text-sm font-medium text-gray-700">
                      Konto ZUS (PLN)
                    </label>
                    <input
                      type="number"
                      className="h-10 rounded-lg border border-gray-300 px-3 text-sm"
                      placeholder="0"
                      value={zusAccount}
                      onChange={(e) =>
                        setZusAccount(Number(e.target.value) || 0)
                      }
                      disabled={!includeZusFields}
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Subkonto ZUS (PLN)
                    </label>
                    <input
                      type="number"
                      className="h-10 rounded-lg border border-gray-300 px-3 text-sm"
                      placeholder="0"
                      value={zusSubAccount}
                      onChange={(e) =>
                        setZusSubAccount(Number(e.target.value) || 0)
                      }
                      disabled={!includeZusFields}
                    />
                  </div>

                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={zusGrowthSeries}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={12}
                          tickFormatter={(value) =>
                            value.toLocaleString("pl-PL")
                          }
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            value.toLocaleString("pl-PL") + " PLN",
                            "",
                          ]}
                          labelFormatter={(label) => `Rok: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="account"
                          stroke="#16a34a"
                          strokeWidth={2}
                          name="Konto"
                          dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="subAccount"
                          stroke="#2563eb"
                          strokeWidth={2}
                          name="Subkonto"
                          dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Szczegółowa prognoza emerytury
                  </CardTitle>
                  <CardDescription>
                    Kompleksowa analiza Twojej przyszłej emerytury
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Wysokość rzeczywista
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {detailedProjections.monthlyPension.toLocaleString(
                          "pl-PL"
                        )}{" "}
                        PLN
                      </p>
                      <p className="text-xs text-gray-500">miesięcznie</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Wysokość urealniona
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {detailedProjections.realPension.toLocaleString(
                          "pl-PL"
                        )}{" "}
                        PLN
                      </p>
                      <p className="text-xs text-gray-500">
                        z uwzględnieniem inflacji
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Stopa zastąpienia
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {detailedProjections.replacementRate}%
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Średnie wynagrodzenie
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {detailedProjections.averageSalary.toLocaleString(
                          "pl-PL"
                        )}{" "}
                        PLN
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                      <p className="text-sm text-gray-600 mb-1">Lata pracy</p>
                      <p className="text-xl font-bold text-gray-900">
                        {detailedProjections.workYears}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Składki łącznie
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {detailedProjections.totalContributions.toLocaleString(
                          "pl-PL"
                        )}{" "}
                        PLN
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">
                      Scenariusze przyszłości
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">
                          +1 rok pracy
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {detailedProjections.pensionAfter1Year.toLocaleString(
                            "pl-PL"
                          )}{" "}
                          PLN
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">
                          +2 lata pracy
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {detailedProjections.pensionAfter2Years.toLocaleString(
                            "pl-PL"
                          )}{" "}
                          PLN
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">
                          +5 lat pracy
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {detailedProjections.pensionAfter5Years.toLocaleString(
                            "pl-PL"
                          )}{" "}
                          PLN
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">
                      Analiza wpływu
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">
                          Dni chorobowe
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {detailedProjections.totalSickDays}
                        </p>
                        <p className="text-xs text-gray-500">
                          Wpływ: -{detailedProjections.sickLeaveImpact}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">
                          Kapitał ZUS
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          +
                          {detailedProjections.zusCapitalImpact.toLocaleString(
                            "pl-PL"
                          )}{" "}
                          PLN
                        </p>
                        <p className="text-xs text-gray-500">miesięcznie</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">
                          Tryb prognozy
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {forecastMode === "indexation"
                            ? "Indeksacja"
                            : "Kwoty"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {forecastMode === "indexation"
                            ? `${annualIndexationPct}% rocznie`
                            : `${futureAmounts.length} okresów`}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    Wykresy i prognozy
                  </CardTitle>
                  <CardDescription>
                    Wizualizacja danych i trendów
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-3">
                      Progresja wynagrodzeń
                    </h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={(() => {
                            const allSalaries = [
                              ...pastSalaries.map((p) => ({
                                year: p.year,
                                amount: p.amount,
                              })),
                              {
                                year: currentYear,
                                amount: simulationData.grossSalary,
                              },
                              ...(forecastMode === "indexation"
                                ? Array.from(
                                    {
                                      length:
                                        simulationData.workEndYear -
                                        currentYear,
                                    },
                                    (_, i) => ({
                                      year: currentYear + i + 1,
                                      amount:
                                        simulationData.grossSalary *
                                        Math.pow(
                                          1 + annualIndexationPct / 100,
                                          i + 1
                                        ),
                                    })
                                  )
                                : futureAmounts.map((f) => ({
                                    year: f.year,
                                    amount: f.amount,
                                  }))),
                            ].sort((a, b) => a.year - b.year);
                            return allSalaries;
                          })()}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f3f4f6"
                          />
                          <XAxis
                            dataKey="year"
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickFormatter={(value) =>
                              value.toLocaleString("pl-PL")
                            }
                          />
                          <Tooltip
                            formatter={(value: number) => [
                              value.toLocaleString("pl-PL") + " PLN",
                              "Wynagrodzenie",
                            ]}
                            labelFormatter={(label) => `Rok: ${label}`}
                          />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">🏥</span>
                        Okresy choroby
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span>Dni chorobowe</span>
                      </div>
                    </div>
                    <div className="h-64 bg-white rounded-lg p-2 shadow-sm">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={(() => {
                            const allSickPeriods = [
                              ...sickPast,
                              ...sickFuture,
                            ].sort((a, b) => a.year - b.year);
                            return allSickPeriods;
                          })()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          barCategoryGap="20%"
                          maxBarSize={60}
                        >
                          <defs>
                            <linearGradient
                              id="sickGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#ef4444"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#dc2626"
                                stopOpacity={0.9}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            strokeOpacity={0.6}
                          />
                          <XAxis
                            dataKey="year"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#6b7280" }}
                          />
                          <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#6b7280" }}
                            label={{
                              value: "Dni choroby",
                              angle: -90,
                              position: "insideLeft",
                              style: {
                                textAnchor: "middle",
                                fill: "#6b7280",
                                fontSize: "12px",
                              },
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              fontSize: "14px",
                            }}
                            formatter={(value: number) => [
                              <span className="font-semibold text-red-600">
                                {value} dni
                              </span>,
                              "Dni choroby",
                            ]}
                            labelFormatter={(label) => (
                              <span className="font-medium text-gray-800">
                                Rok: {label}
                              </span>
                            )}
                          />
                          <Bar
                            dataKey="days"
                            fill="url(#sickGradient)"
                            radius={[6, 6, 0, 0]}
                            animationDuration={1500}
                            animationEasing="ease-out"
                            stroke="#dc2626"
                            strokeWidth={1}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 text-center">
                      {(() => {
                        const allSickPeriods = [...sickPast, ...sickFuture];
                        const totalDays = allSickPeriods.reduce(
                          (sum, period) => sum + period.days,
                          0
                        );
                        return `Łącznie: ${totalDays} dni chorobowych w ${allSickPeriods.length} okresach`;
                      })()}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">💰</span>
                        Przyszłe wynagrodzenia
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>
                          {forecastMode === "indexation"
                            ? "Indeksacja"
                            : "Kwoty"}
                        </span>
                      </div>
                    </div>
                    <div className="h-64 bg-white rounded-lg p-2 shadow-sm">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={(() => {
                            const allFutureSalaries =
                              forecastMode === "indexation"
                                ? Array.from({ length: 10 }, (_, i) => ({
                                    year: currentYear + i + 1,
                                    amount:
                                      simulationData.grossSalary *
                                      Math.pow(
                                        1 + annualIndexationPct / 100,
                                        i + 1
                                      ),
                                  }))
                                : futureAmounts.map((f) => ({
                                    year: f.year,
                                    amount: f.amount,
                                  }));
                            return allFutureSalaries;
                          })()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient
                              id="salaryGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#1d4ed8"
                                stopOpacity={0.9}
                              />
                            </linearGradient>
                            <linearGradient
                              id="areaGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            strokeOpacity={0.6}
                          />
                          <XAxis
                            dataKey="year"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#6b7280" }}
                          />
                          <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#6b7280" }}
                            tickFormatter={(value) =>
                              value.toLocaleString("pl-PL")
                            }
                            label={{
                              value: "Wynagrodzenie (PLN)",
                              angle: -90,
                              position: "insideLeft",
                              style: {
                                textAnchor: "middle",
                                fill: "#6b7280",
                                fontSize: "12px",
                              },
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              fontSize: "14px",
                            }}
                            formatter={(value: number) => [
                              <span className="font-semibold text-blue-600">
                                {value.toLocaleString("pl-PL")} PLN
                              </span>,
                              "Wynagrodzenie",
                            ]}
                            labelFormatter={(label) => (
                              <span className="font-medium text-gray-800">
                                Rok: {label}
                              </span>
                            )}
                          />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="url(#salaryGradient)"
                            strokeWidth={3}
                            dot={{
                              fill: "#3b82f6",
                              strokeWidth: 3,
                              r: 5,
                              stroke: "#ffffff",
                            }}
                            activeDot={{
                              r: 7,
                              stroke: "#3b82f6",
                              strokeWidth: 2,
                              fill: "#ffffff",
                            }}
                            animationDuration={2000}
                            animationEasing="ease-out"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {forecastMode === "indexation"
                          ? `Indeksacja: ${annualIndexationPct}% rocznie`
                          : `${futureAmounts.length} okresów prognozy`}
                      </span>
                      <span>
                        {(() => {
                          const data =
                            forecastMode === "indexation"
                              ? Array.from({ length: 10 }, (_, i) => ({
                                  year: currentYear + i + 1,
                                  amount:
                                    simulationData.grossSalary *
                                    Math.pow(
                                      1 + annualIndexationPct / 100,
                                      i + 1
                                    ),
                                }))
                              : futureAmounts;
                          const lastAmount = data[data.length - 1]?.amount || 0;
                          const firstAmount = data[0]?.amount || 0;
                          const growth = lastAmount - firstAmount;
                          return `Wzrost: +${growth.toLocaleString(
                            "pl-PL"
                          )} PLN`;
                        })()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

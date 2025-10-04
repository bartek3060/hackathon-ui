import { SimulatorUsage } from "./types";

export function exportToCSV(data: SimulatorUsage[]) {
  // Calculate comprehensive statistics
  const stats = {
    totalUsage: data.length,
    avgExpectedPension: Math.round(
      data.reduce((sum, item) => sum + item.expectedPension, 0) / data.length
    ),
    avgActualPension: Math.round(
      data.reduce((sum, item) => sum + item.actualPension, 0) / data.length
    ),
    avgRealizedPension: Math.round(
      data.reduce((sum, item) => sum + item.realizedPension, 0) / data.length
    ),
    avgAge: Math.round(
      data.reduce((sum, item) => sum + item.age, 0) / data.length
    ),
    avgSalary: Math.round(
      data.reduce((sum, item) => sum + item.salary, 0) / data.length
    ),
    avgAccumulatedFunds: Math.round(
      data.reduce((sum, item) => sum + item.accumulatedFunds, 0) / data.length
    ),
    avgSubAccountFunds: Math.round(
      data.reduce((sum, item) => sum + item.subAccountFunds, 0) / data.length
    ),
    maleCount: data.filter((item) => item.gender === "M").length,
    femaleCount: data.filter((item) => item.gender === "F").length,
    sickPeriodsCount: data.filter((item) => item.includesSickPeriods).length,
    minExpectedPension: Math.min(...data.map((item) => item.expectedPension)),
    maxExpectedPension: Math.max(...data.map((item) => item.expectedPension)),
    minActualPension: Math.min(...data.map((item) => item.actualPension)),
    maxActualPension: Math.max(...data.map((item) => item.actualPension)),
    minAge: Math.min(...data.map((item) => item.age)),
    maxAge: Math.max(...data.map((item) => item.age)),
    uniquePostalCodes: [...new Set(data.map((item) => item.postalCode))].length,
    uniqueDates: [...new Set(data.map((item) => item.usageDate))].length,
  };

  // Create CSV content with summary section
  const summarySection = [
    "=== PODSUMOWANIE DANYCH SYMULATORA EMERYTURY ===",
    "",
    "Statystyki ogólne:",
    `Łączna liczba symulacji,${stats.totalUsage}`,
    `Średni wiek użytkowników,${stats.avgAge} lat`,
    `Średnie wynagrodzenie,${stats.avgSalary.toLocaleString()} zł`,
    "",
    "Statystyki emerytur:",
    `Średnia emerytura oczekiwana,${stats.avgExpectedPension.toLocaleString()} zł`,
    `Średnia emerytura rzeczywista,${stats.avgActualPension.toLocaleString()} zł`,
    `Średnia emerytura urealniona,${stats.avgRealizedPension.toLocaleString()} zł`,
    `Minimalna emerytura oczekiwana,${stats.minExpectedPension.toLocaleString()} zł`,
    `Maksymalna emerytura oczekiwana,${stats.maxExpectedPension.toLocaleString()} zł`,
    `Minimalna emerytura rzeczywista,${stats.minActualPension.toLocaleString()} zł`,
    `Maksymalna emerytura rzeczywista,${stats.maxActualPension.toLocaleString()} zł`,
    "",
    "Statystyki środków:",
    `Średnie środki na koncie,${stats.avgAccumulatedFunds.toLocaleString()} zł`,
    `Średnie środki na Subkoncie,${stats.avgSubAccountFunds.toLocaleString()} zł`,
    "",
    "Rozkład demograficzny:",
    `Liczba mężczyzn,${stats.maleCount}`,
    `Liczba kobiet,${stats.femaleCount}`,
    `Procent mężczyzn,${Math.round(
      (stats.maleCount / stats.totalUsage) * 100
    )}%`,
    `Procent kobiet,${Math.round(
      (stats.femaleCount / stats.totalUsage) * 100
    )}%`,
    "",
    "Rozkład wieku:",
    `Najmłodszy użytkownik,${stats.minAge} lat`,
    `Najstarszy użytkownik,${stats.maxAge} lat`,
    "",
    "Dodatkowe informacje:",
    `Symulacje uwzględniające okresy choroby,${stats.sickPeriodsCount}`,
    `Procent z okresami choroby,${Math.round(
      (stats.sickPeriodsCount / stats.totalUsage) * 100
    )}%`,
    `Liczba unikalnych kodów pocztowych,${stats.uniquePostalCodes}`,
    `Liczba dni z symulacjami,${stats.uniqueDates}`,
    "",
    "=== SZCZEGÓŁOWE DANE ===",
    "",
  ];

  const headers = [
    "Data użycia",
    "Godzina użycia",
    "Emerytura oczekiwana",
    "Wiek",
    "Płeć",
    "Wysokość wynagrodzenia",
    "Czy uwzględniał okresy choroby",
    "Wysokość zgromadzonych środków na koncie",
    "Wysokość zgromadzonych środków na Subkoncie",
    "Emerytura rzeczywista",
    "Emerytura urealniona",
    "Kod pocztowy",
  ];

  const dataRows = data.map((row) =>
    [
      row.usageDate,
      row.usageTime,
      row.expectedPension,
      row.age,
      row.gender,
      row.salary,
      row.includesSickPeriods ? "Tak" : "Nie",
      row.accumulatedFunds,
      row.subAccountFunds,
      row.actualPension,
      row.realizedPension,
      row.postalCode,
    ].join(",")
  );

  const csvContent = [...summarySection, headers.join(","), ...dataRows].join(
    "\n"
  );

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `raport_symulatora_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

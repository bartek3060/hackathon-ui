"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminAuth, SimulatorUsage, StatisticsData } from "./types";
import { AdminHeader } from "./AdminHeader";
import { StatisticsCards } from "./StatisticsCards";
import { ChartsSection } from "./ChartsSection";
import { DataFilters } from "./DataFilters";
import { DataTable } from "./DataTable";
import { exportToCSV } from "./exportUtils";

export default function AdminDashboard() {
  const [adminAuth, setAdminAuth] = useState<AdminAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const router = useRouter();

  // Mock data for demonstration
  const mockData: SimulatorUsage[] = [
    {
      id: "1",
      usageDate: "2024-01-15",
      usageTime: "14:30",
      expectedPension: 3500,
      age: 45,
      gender: "M",
      salary: 8000,
      includesSickPeriods: true,
      accumulatedFunds: 120000,
      subAccountFunds: 45000,
      actualPension: 3200,
      realizedPension: 3100,
      postalCode: "00-001",
    },
    {
      id: "2",
      usageDate: "2024-01-15",
      usageTime: "16:45",
      expectedPension: 2800,
      age: 38,
      gender: "F",
      salary: 6500,
      includesSickPeriods: false,
      accumulatedFunds: 85000,
      subAccountFunds: 32000,
      actualPension: 2600,
      realizedPension: 2550,
      postalCode: "30-001",
    },
    {
      id: "3",
      usageDate: "2024-01-16",
      usageTime: "09:15",
      expectedPension: 4200,
      age: 52,
      gender: "M",
      salary: 9500,
      includesSickPeriods: true,
      accumulatedFunds: 180000,
      subAccountFunds: 68000,
      actualPension: 3900,
      realizedPension: 3750,
      postalCode: "50-001",
    },
    {
      id: "4",
      usageDate: "2024-01-16",
      usageTime: "11:20",
      expectedPension: 3100,
      age: 41,
      gender: "F",
      salary: 7200,
      includesSickPeriods: false,
      accumulatedFunds: 95000,
      subAccountFunds: 38000,
      actualPension: 2900,
      realizedPension: 2850,
      postalCode: "80-001",
    },
    {
      id: "5",
      usageDate: "2024-01-17",
      usageTime: "13:10",
      expectedPension: 3800,
      age: 48,
      gender: "M",
      salary: 8800,
      includesSickPeriods: true,
      accumulatedFunds: 150000,
      subAccountFunds: 55000,
      actualPension: 3500,
      realizedPension: 3400,
      postalCode: "20-001",
    },
    {
      id: "6",
      usageDate: "2024-01-18",
      usageTime: "10:30",
      expectedPension: 2900,
      age: 35,
      gender: "F",
      salary: 6000,
      includesSickPeriods: false,
      accumulatedFunds: 70000,
      subAccountFunds: 25000,
      actualPension: 2700,
      realizedPension: 2650,
      postalCode: "40-001",
    },
    {
      id: "7",
      usageDate: "2024-01-19",
      usageTime: "15:45",
      expectedPension: 4500,
      age: 55,
      gender: "M",
      salary: 10000,
      includesSickPeriods: true,
      accumulatedFunds: 200000,
      subAccountFunds: 75000,
      actualPension: 4200,
      realizedPension: 4100,
      postalCode: "60-001",
    },
    {
      id: "8",
      usageDate: "2024-01-20",
      usageTime: "08:20",
      expectedPension: 3200,
      age: 42,
      gender: "F",
      salary: 7500,
      includesSickPeriods: false,
      accumulatedFunds: 100000,
      subAccountFunds: 40000,
      actualPension: 3000,
      realizedPension: 2950,
      postalCode: "70-001",
    },
    {
      id: "9",
      usageDate: "2024-01-21",
      usageTime: "12:15",
      expectedPension: 3600,
      age: 46,
      gender: "M",
      salary: 8500,
      includesSickPeriods: true,
      accumulatedFunds: 130000,
      subAccountFunds: 50000,
      actualPension: 3300,
      realizedPension: 3200,
      postalCode: "90-001",
    },
    {
      id: "10",
      usageDate: "2024-01-22",
      usageTime: "17:30",
      expectedPension: 2700,
      age: 39,
      gender: "F",
      salary: 6800,
      includesSickPeriods: false,
      accumulatedFunds: 80000,
      subAccountFunds: 30000,
      actualPension: 2500,
      realizedPension: 2450,
      postalCode: "10-001",
    },
  ];

  const [data, setData] = useState<SimulatorUsage[]>(mockData);

  useEffect(() => {
    // Check if user is authenticated
    const authData = localStorage.getItem("adminAuth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setAdminAuth(parsed);
      } catch (error) {
        localStorage.removeItem("adminAuth");
        router.push("/admin");
      }
    } else {
      router.push("/admin");
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    exportToCSV(filteredData);
  };

  // Get unique dates for dropdown
  const uniqueDates = [...new Set(data.map((item) => item.usageDate))].sort();

  // Filter data based on search and filters
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.postalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.usageDate.includes(searchTerm) ||
      item.usageTime.includes(searchTerm);

    const matchesGender =
      genderFilter === "all" || item.gender === genderFilter;

    const matchesDate = dateFilter === "all" || item.usageDate === dateFilter;

    // Date range filtering
    const matchesDateRange =
      (!startDate && !endDate) || // No date range selected
      (startDate && !endDate && item.usageDate >= startDate) || // Only start date
      (!startDate && endDate && item.usageDate <= endDate) || // Only end date
      (startDate &&
        endDate &&
        item.usageDate >= startDate &&
        item.usageDate <= endDate); // Both dates

    return matchesSearch && matchesGender && matchesDate && matchesDateRange;
  });

  // Calculate statistics
  const statistics: StatisticsData = {
    totalUsage: data.length,
    avgExpectedPension: Math.round(
      data.reduce((sum, item) => sum + item.expectedPension, 0) / data.length
    ),
    avgActualPension: Math.round(
      data.reduce((sum, item) => sum + item.actualPension, 0) / data.length
    ),
    avgAge: Math.round(
      data.reduce((sum, item) => sum + item.age, 0) / data.length
    ),
    maleCount: data.filter((item) => item.gender === "M").length,
    femaleCount: data.filter((item) => item.gender === "F").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!adminAuth) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-break-before {
            page-break-before: always;
          }
          .print-break-after {
            page-break-after: always;
          }
          body {
            background: white !important;
          }
          .bg-gray-50 {
            background: white !important;
          }
          .shadow-sm,
          .shadow {
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader onLogout={handleLogout} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StatisticsCards stats={statistics} />
          <ChartsSection stats={statistics} />

          <div className="space-y-6">
            <DataFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              genderFilter={genderFilter}
              setGenderFilter={setGenderFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              uniqueDates={uniqueDates}
            />

            <DataTable
              data={filteredData}
              onExport={handleExport}
              onPrint={handlePrint}
            />
          </div>
        </main>
      </div>
    </>
  );
}

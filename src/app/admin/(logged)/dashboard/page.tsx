"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminAuth, SimulatorUsage, StatisticsData } from "./types";
import { AdminHeader } from "./AdminHeader";
import { StatisticsCards } from "./StatisticsCards";
import { ChartsSection } from "./ChartsSection";
import { DataTable } from "./DataTable";
import { exportToCSV } from "./exportUtils";
import { useAdminStats } from "@/hooks/queries/useAdminStats";
import { useAdminReport } from "@/hooks/queries/useAdminReport";

export default function AdminDashboard() {
  const [adminAuth, setAdminAuth] = useState<AdminAuth | null>(null);
  const router = useRouter();
  const { data: adminStats } = useAdminStats();
  const { data: adminReport } = useAdminReport();
  console.log(adminReport);
  // const [data, setData] = useState<SimulatorUsage[]>(mockData);

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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    exportToCSV([]);
  };

  // Calculate statistics
  const statistics: StatisticsData = {
    totalUsage: adminStats?.data?.totalSimulations || 0,
    avgExpectedPension: adminStats?.data?.averageExpectedPension || 0,
    avgActualPension: adminStats?.data?.averageRealPension || 0,
    avgAge: adminStats?.data?.averageAge || 0,
    maleCount: adminStats?.data?.genderStats?.menCount || 0,
    femaleCount: adminStats?.data?.genderStats?.womenCount || 0,
    ageStats: adminStats?.data?.ageStats || {
      under20: 0,
      age20to29: 0,
      age30to39: 0,
      age40to49: 0,
      age50to59: 0,
      over59: 0,
    },
  };

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
            <DataTable
              data={adminReport?.data || []}
              onExport={handleExport}
              onPrint={handlePrint}
            />
          </div>
        </main>
      </div>
    </>
  );
}

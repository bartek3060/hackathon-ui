"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatisticsData } from "./types";

interface ChartsSectionProps {
  stats: StatisticsData;
}

type AgeRange = {
  label: string;
  count: number;
  color: string;
};

type AgeBarProps = {
  range: AgeRange;
  totalUsage: number;
};

const AgeBar = ({ range, totalUsage }: AgeBarProps) => {
  const percentage = totalUsage > 0 ? (range.count / totalUsage) * 100 : 0;

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{range.label}</span>
      <div className="flex items-center space-x-2">
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div
            className={`${range.color} h-2 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-500">{range.count}</span>
      </div>
    </div>
  );
};

export function ChartsSection({ stats }: ChartsSectionProps) {
  const ageRanges: AgeRange[] = [
    {
      label: "Poniżej 20 lat",
      count: stats.ageStats.under20,
      color: "bg-blue-600",
    },
    {
      label: "20-29 lat",
      count: stats.ageStats.age20to29,
      color: "bg-green-600",
    },
    {
      label: "30-39 lat",
      count: stats.ageStats.age30to39,
      color: "bg-purple-600",
    },
    {
      label: "40-49 lat",
      count: stats.ageStats.age40to49,
      color: "bg-orange-600",
    },
    {
      label: "50-59 lat",
      count: stats.ageStats.age50to59,
      color: "bg-red-600",
    },
    {
      label: "Powyżej 59 lat",
      count: stats.ageStats.over59,
      color: "bg-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Rozkład płci</CardTitle>
          <CardDescription>
            Procentowy udział użytkowników według płci
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.maleCount}
              </div>
              <div className="text-sm text-gray-500">Mężczyźni</div>
              <div className="text-xs text-gray-400">
                {Math.round((stats.maleCount / stats.totalUsage) * 100)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">
                {stats.femaleCount}
              </div>
              <div className="text-sm text-gray-500">Kobiety</div>
              <div className="text-xs text-gray-400">
                {Math.round((stats.femaleCount / stats.totalUsage) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rozkład wieku</CardTitle>
          <CardDescription>Przedziały wiekowe użytkowników</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ageRanges.map((range) => (
              <AgeBar
                key={range.label}
                range={range}
                totalUsage={stats.totalUsage}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

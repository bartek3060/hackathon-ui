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

export function ChartsSection({ stats }: ChartsSectionProps) {
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
            <div className="flex justify-between items-center">
              <span className="text-sm">30-40 lat</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">1</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">40-50 lat</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">3</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">50+ lat</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">1</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

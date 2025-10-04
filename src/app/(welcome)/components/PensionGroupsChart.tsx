"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { PensionGroup } from "@/api/pension-groups";

interface PensionGroupsChartProps {
  pensionGroups: PensionGroup[];
  userAmount: number;
}

const COLORS = {
  default: "rgb(0, 153, 63)",
  userRange: "rgb(255, 179, 79)",
};

export function PensionGroupsChart({ pensionGroups, userAmount }: PensionGroupsChartProps) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  const chartData = pensionGroups.map((group) => ({
    name: group.name,
    population: group.population,
    description: group.description,
    lowerBound: group.lowerBound,
    upperBound: group.upperBound,
  }));

  const maxUpperBound = Math.max(...pensionGroups.map((g) => g.upperBound));
  const minLowerBound = Math.min(...pensionGroups.map((g) => g.lowerBound));
  const isAboveAllGroups = userAmount > maxUpperBound;
  const isBelowAllGroups = userAmount < minLowerBound;

  const isUserInGroup = (lowerBound: number, upperBound: number, isLastGroup: boolean, isFirstGroup: boolean) => {
    if (isAboveAllGroups && isLastGroup) {
      return true;
    }
    if (isBelowAllGroups && isFirstGroup) {
      return true;
    }
    return userAmount >= lowerBound && userAmount <= upperBound;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="p-4 shadow-xl border-2 max-w-sm">
          <h3 className="font-bold text-lg mb-2">{data.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{data.description}</p>
          <div className="space-y-2 mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Zakres:</span>
              <span className="text-sm font-bold text-gray-900">
                {data.upperBound > 0
                  ? `${new Intl.NumberFormat("pl-PL").format(data.lowerBound)} - ${new Intl.NumberFormat("pl-PL").format(data.upperBound)}`
                  : `${new Intl.NumberFormat("pl-PL").format(data.lowerBound)}+`
                } PLN
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Populacja:</span>
              <span className="text-lg font-bold text-custom-2">{data.population}%</span>
            </div>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          Rozkład emerytur w Polsce
        </h2>
        <p className="text-lg text-gray-600">
          Twoja wybrana kwota: <span className="font-bold text-custom-1">{new Intl.NumberFormat("pl-PL").format(userAmount)} PLN</span>
        </p>
      </div>

      <Card className="p-6 bg-transparent border-0 shadow-none">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
            onMouseMove={(state: any) => {
              if (state.activeTooltipIndex !== undefined) {
                setHoveredGroup(chartData[state.activeTooltipIndex]?.name || null);
              }
            }}
            onMouseLeave={() => setHoveredGroup(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              label={{ value: "Procent populacji (%)", angle: -90, position: "insideLeft" }}
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 153, 63, 0.1)" }} />
            <Bar dataKey="population" radius={[8, 8, 0, 0]} isAnimationActive={false}>
              {chartData.map((entry, index) => {
                const isLastGroup = index === chartData.length - 1;
                const isFirstGroup = index === 0;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      isUserInGroup(entry.lowerBound, entry.upperBound, isLastGroup, isFirstGroup)
                        ? COLORS.userRange
                        : COLORS.default
                    }
                    opacity={hoveredGroup === null || hoveredGroup === entry.name ? 1 : 0.3}
                  />
                );
              })}
              <LabelList 
                dataKey="population" 
                position="top" 
                formatter={(value: number) => `${value}%`}
                style={{ fill: '#4b5563', fontSize: '12px', fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-custom-2/5 border-custom-2">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-[rgb(0,153,63)]" />
            <span className="text-sm font-medium">Inne grupy</span>
          </div>
        </Card>
        <Card className="p-4 bg-custom-1/10 border-custom-1">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-[rgb(255,179,79)]" />
            <span className="text-sm font-medium">Twoja grupa</span>
          </div>
        </Card>
      </div>
    </div>
  );
}


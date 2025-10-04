"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  genderFilter: string;
  setGenderFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  uniqueDates: string[];
}

export function DataFilters({
  searchTerm,
  setSearchTerm,
  genderFilter,
  setGenderFilter,
  dateFilter,
  setDateFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  uniqueDates,
}: DataFiltersProps) {
  const hasActiveFilters =
    searchTerm ||
    genderFilter !== "all" ||
    dateFilter !== "all" ||
    startDate ||
    endDate;

  const clearAllFilters = () => {
    setSearchTerm("");
    setGenderFilter("all");
    setDateFilter("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-4 mb-6 no-print">
      {/* First row of filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Szukaj po kodzie pocztowym, dacie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Płeć" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="M">Mężczyźni</SelectItem>
            <SelectItem value="F">Kobiety</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Konkretna data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie daty</SelectItem>
            {uniqueDates.map((date) => (
              <SelectItem key={date} value={date}>
                {new Date(date).toLocaleDateString("pl-PL")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Second row - Date range filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Zakres dat:</span>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="date"
            placeholder="Data od"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40"
          />
          <span className="text-gray-500">do</span>
          <Input
            type="date"
            placeholder="Data do"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40"
          />
        </div>
        {(startDate || endDate) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="text-xs"
          >
            Wyczyść zakres
          </Button>
        )}
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Aktywne filtry:</span>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Szukaj: "{searchTerm}"
            </Badge>
          )}
          {genderFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Płeć: {genderFilter === "M" ? "Mężczyźni" : "Kobiety"}
            </Badge>
          )}
          {dateFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Data: {new Date(dateFilter).toLocaleDateString("pl-PL")}
            </Badge>
          )}
          {startDate && (
            <Badge variant="secondary" className="text-xs">
              Od: {new Date(startDate).toLocaleDateString("pl-PL")}
            </Badge>
          )}
          {endDate && (
            <Badge variant="secondary" className="text-xs">
              Do: {new Date(endDate).toLocaleDateString("pl-PL")}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Wyczyść wszystkie
          </Button>
        </div>
      )}
    </div>
  );
}

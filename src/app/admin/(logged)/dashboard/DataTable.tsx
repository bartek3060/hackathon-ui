"use client";

import { Download, Printer, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SimulatorUsage } from "./types";

interface DataTableProps {
  data: SimulatorUsage[];
  onExport: () => void;
  onPrint: () => void;
}

export function DataTable({ data, onExport, onPrint }: DataTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Szczegółowe dane symulacji</CardTitle>
            <CardDescription>
              Pełne dane wszystkich symulacji emerytury
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={onExport}
              className="flex items-center space-x-2 no-print"
            >
              <Download className="h-4 w-4" />
              <span>Eksportuj do Excel</span>
            </Button>
            <Button
              onClick={onPrint}
              variant="outline"
              className="flex items-center space-x-2 no-print"
            >
              <Printer className="h-4 w-4" />
              <span>Drukuj</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data użycia</TableHead>
                <TableHead>Godzina</TableHead>
                <TableHead>Emerytura oczekiwana</TableHead>
                <TableHead>Wiek</TableHead>
                <TableHead>Płeć</TableHead>
                <TableHead>Wynagrodzenie</TableHead>
                <TableHead>Okresy choroby</TableHead>
                <TableHead>Środki na koncie</TableHead>
                <TableHead>Środki na Subkoncie</TableHead>
                <TableHead>Emerytura rzeczywista</TableHead>
                <TableHead>Emerytura urealniona</TableHead>
                <TableHead>Kod pocztowy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.usageDate}</TableCell>
                  <TableCell>{item.usageTime}</TableCell>
                  <TableCell>
                    {item.expectedPension.toLocaleString()} zł
                  </TableCell>
                  <TableCell>{item.age}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.gender === "M" ? "default" : "secondary"}
                    >
                      {item.gender === "M" ? "M" : "K"}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.salary.toLocaleString()} zł</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.includesSickPeriods ? "destructive" : "outline"
                      }
                    >
                      {item.includesSickPeriods ? "Tak" : "Nie"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.accumulatedFunds.toLocaleString()} zł
                  </TableCell>
                  <TableCell>
                    {item.subAccountFunds.toLocaleString()} zł
                  </TableCell>
                  <TableCell>
                    {item.actualPension.toLocaleString()} zł
                  </TableCell>
                  <TableCell>
                    {item.realizedPension.toLocaleString()} zł
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span>{item.postalCode}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Brak danych spełniających kryteria wyszukiwania
          </div>
        )}
      </CardContent>
    </Card>
  );
}

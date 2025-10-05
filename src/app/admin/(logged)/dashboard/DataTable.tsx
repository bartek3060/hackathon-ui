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
import { v4 as uuidv4 } from "uuid";
import { SimulatorUsage } from "./types";
import { ReceiveAdminReportDto } from "@/api/dtos/receive-admin-report.dto";
import { uuid } from "zod";

interface DataTableProps {
  data: ReceiveAdminReportDto[];
  onExport: () => void;
  onPrint: () => void;
}

export function DataTable({ data, onExport, onPrint }: DataTableProps) {
  console.log(data);
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
                <TableRow key={uuidv4()}>
                  <TableCell>{item.createdAt}</TableCell>
                  <TableCell>
                    {item.expectedPension.toLocaleString()} zł
                  </TableCell>
                  <TableCell>{item.age}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.gender === "man" ? "default" : "secondary"}
                    >
                      {item.gender === "man" ? "man" : "woman"}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.salaryAmount.toLocaleString()} zł</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.sickPeriodDays ? "destructive" : "outline"}
                    >
                      {item.sickPeriodDays ? "Tak" : "Nie"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.accumulatedFundsInZusAccountAmount?.toLocaleString() ??
                      "Puste"}{" "}
                    zł
                  </TableCell>
                  <TableCell>
                    {item.accumulatedFundsInZusSubAccountAmount?.toLocaleString() ??
                      "Puste"}{" "}
                    zł
                  </TableCell>
                  <TableCell>
                    {item.realPensionWithIllness.toLocaleString()} zł
                  </TableCell>
                  <TableCell>
                    {item.realisticPensionWithIllness.toLocaleString()} zł
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

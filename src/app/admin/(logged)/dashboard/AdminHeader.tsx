"use client";

import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel Administratora - Symulator Emerytury
              </h1>
              <p className="text-sm text-gray-500">
                Raportowanie zainteresowania symulatorem
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant="secondary"
              className="flex items-center space-x-1 no-print"
            >
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </Badge>
            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center space-x-2 no-print"
            >
              <LogOut className="h-4 w-4" />
              <span>Wyloguj</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Loader2 } from "lucide-react";
import type { ComponentType } from "react";

interface PostalCodeData {
  postalCode: string;
  count: number;
  lat?: number;
  lng?: number;
}

const Map = dynamic<{ postalCodeData: PostalCodeData[] }>(
  () => import("./MapComponent") as Promise<{ default: ComponentType<{ postalCodeData: PostalCodeData[] }> }>,
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    ),
  }
);

interface PostalCodeMapProps {
  data: Array<{ postalCode: string }>;
}

export function PostalCodeMap({ data }: PostalCodeMapProps) {
  const [postalCodeDistribution, setPostalCodeDistribution] = useState<
    PostalCodeData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const aggregateData = async () => {
      setIsLoading(true);

      const countRecord: Record<string, number> = {};
      data.forEach((item) => {
        if (item.postalCode && item.postalCode.trim() !== "") {
          countRecord[item.postalCode] = (countRecord[item.postalCode] || 0) + 1;
        }
      });

      const aggregated: PostalCodeData[] = Object.entries(countRecord).map(
        ([postalCode, count]) => ({
          postalCode,
          count,
        })
      );

      const enrichedData = await enrichWithCoordinates(aggregated);
      setPostalCodeDistribution(enrichedData);
      setIsLoading(false);
    };

    aggregateData();
  }, [data]);

  const totalUsers = postalCodeDistribution.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Rozkład użytkowników według kodów pocztowych
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Wizualizacja {totalUsers} użytkowników z{" "}
            {postalCodeDistribution.length} różnych kodów pocztowych
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">
            Wszystkich użytkowników
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {totalUsers}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">Kodów pocztowych</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            {postalCodeDistribution.length}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-medium">
            Średnia użytkowników/kod
          </div>
          <div className="text-2xl font-bold text-purple-900 mt-1">
            {postalCodeDistribution.length > 0
              ? (totalUsers / postalCodeDistribution.length).toFixed(1)
              : 0}
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-orange-600 font-medium">
            Najpopularniejszy kod
          </div>
          <div className="text-2xl font-bold text-orange-900 mt-1">
            {postalCodeDistribution.length > 0
              ? postalCodeDistribution.sort((a, b) => b.count - a.count)[0]
                  .postalCode
              : "-"}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Ładowanie mapy...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <Map postalCodeData={postalCodeDistribution} />
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 10 kodów pocztowych
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {postalCodeDistribution
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map((item, index) => (
              <div
                key={item.postalCode}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? "bg-yellow-400 text-yellow-900"
                          : index === 1
                          ? "bg-gray-300 text-gray-700"
                          : index === 2
                          ? "bg-orange-300 text-orange-900"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="font-mono text-sm font-semibold">
                      {item.postalCode}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

async function enrichWithCoordinates(
  data: PostalCodeData[]
): Promise<PostalCodeData[]> {
  const postalCodeCoordinates: Record<string, [number, number]> = {
    "00-001": [52.2297, 21.0122],
    "30-001": [50.0647, 19.945],
    "80-001": [54.352, 18.6466],
    "50-001": [51.1079, 17.0385],
    "60-001": [52.4064, 16.9252],
    "90-001": [51.7592, 19.4560],
    "40-001": [50.2649, 19.0238],
    "70-001": [53.4285, 14.5528],
    "10-001": [53.7784, 20.4801],
    "20-001": [51.2465, 22.5684],
  };

  return data.map((item) => {
    const coords = postalCodeCoordinates[item.postalCode];
    if (coords) {
      return {
        ...item,
        lat: coords[0],
        lng: coords[1],
      };
    }

    const prefix = item.postalCode.split("-")[0];
    const prefixNum = parseInt(prefix, 10);

    let lat = 52.0;
    let lng = 19.0;

    if (prefixNum >= 0 && prefixNum <= 9) {
      lat = 52.2297;
      lng = 21.0122;
    } else if (prefixNum >= 10 && prefixNum <= 19) {
      lat = 53.7784;
      lng = 20.4801;
    } else if (prefixNum >= 20 && prefixNum <= 29) {
      lat = 51.2465;
      lng = 22.5684;
    } else if (prefixNum >= 30 && prefixNum <= 39) {
      lat = 50.0647;
      lng = 19.945;
    } else if (prefixNum >= 40 && prefixNum <= 49) {
      lat = 50.2649;
      lng = 19.0238;
    } else if (prefixNum >= 50 && prefixNum <= 59) {
      lat = 51.1079;
      lng = 17.0385;
    } else if (prefixNum >= 60 && prefixNum <= 69) {
      lat = 52.4064;
      lng = 16.9252;
    } else if (prefixNum >= 70 && prefixNum <= 79) {
      lat = 53.4285;
      lng = 14.5528;
    } else if (prefixNum >= 80 && prefixNum <= 89) {
      lat = 54.352;
      lng = 18.6466;
    } else if (prefixNum >= 90 && prefixNum <= 99) {
      lat = 51.7592;
      lng = 19.4560;
    }

    return {
      ...item,
      lat,
      lng,
    };
  });
}


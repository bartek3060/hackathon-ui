"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PostalCodeData {
  postalCode: string;
  count: number;
  lat?: number;
  lng?: number;
}

interface MapComponentProps {
  postalCodeData: PostalCodeData[];
}

export default function MapComponent({ postalCodeData }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map(mapContainerRef.current).setView([52.0, 19.0], 6);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const maxCount = Math.max(...postalCodeData.map((d) => d.count), 1);

    postalCodeData.forEach((data) => {
      if (data.lat && data.lng) {
        const radius = Math.max(5, (data.count / maxCount) * 30);

        const circle = L.circleMarker([data.lat, data.lng], {
          radius: radius,
          fillColor: getColorByCount(data.count, maxCount),
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
        }).addTo(map);

        circle.bindPopup(`
          <div style="text-align: center; padding: 4px;">
            <strong style="font-size: 16px;">${data.postalCode}</strong>
            <br/>
            <span style="font-size: 14px; color: #666;">
              ${data.count} ${data.count === 1 ? "użytkownik" : data.count < 5 ? "użytkowników" : "użytkowników"}
            </span>
          </div>
        `);

        circle.on("mouseover", () => {
          circle.openPopup();
        });
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [postalCodeData]);

  return <div ref={mapContainerRef} style={{ height: "600px", width: "100%" }} />;
}

function getColorByCount(count: number, maxCount: number): string {
  const ratio = count / maxCount;

  if (ratio > 0.8) return "#dc2626";
  if (ratio > 0.6) return "#f97316";
  if (ratio > 0.4) return "#f59e0b";
  if (ratio > 0.2) return "#10b981";
  return "#3b82f6";
}


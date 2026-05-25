"use client";

import { useEffect, useRef } from "react";
import { load } from "@2gis/mapgl";
import type {
  Map as MapGLMap,
  Marker as MapGLMarker,
  HtmlMarker as MapGLHtmlMarker,
} from "@2gis/mapgl/types";
import type { Store } from "@/data/stores";

type Props = {
  stores: Store[];
  activeId: string | null;
  onMarkerClick: (id: string) => void;
};

const API_KEY = process.env.NEXT_PUBLIC_2GIS_API_KEY!;

function popupHtml(s: Store): string {
  const tel = s.phone.replace(/\s/g, "");
  return `
    <div class="tumar-popup">
      <div class="tumar-popup__city">${s.city}</div>
      <div class="tumar-popup__name">${s.name}</div>
      <div class="tumar-popup__addr">${s.address}</div>
      <a class="tumar-popup__phone" href="tel:${tel}">${s.phone}</a>
    </div>
  `;
}

type MapGLNamespace = Awaited<ReturnType<typeof load>>;

export default function MapView({ stores, activeId, onMarkerClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapGLMap | null>(null);
  const markersRef = useRef<Map<string, MapGLMarker>>(new Map());
  const popupRef = useRef<MapGLHtmlMarker | null>(null);
  const mapglRef = useRef<MapGLNamespace | null>(null);

  useEffect(() => {
    let map: MapGLMap | null = null;
    let cancelled = false;

    load().then((mapgl) => {
      if (cancelled || !containerRef.current) return;
      mapglRef.current = mapgl;

      const bounds = stores.reduce(
        (acc, s) => {
          acc.minLng = Math.min(acc.minLng, s.coordinates[0]);
          acc.maxLng = Math.max(acc.maxLng, s.coordinates[0]);
          acc.minLat = Math.min(acc.minLat, s.coordinates[1]);
          acc.maxLat = Math.max(acc.maxLat, s.coordinates[1]);
          return acc;
        },
        { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity }
      );

      map = new mapgl.Map(containerRef.current, {
        center: [
          (bounds.minLng + bounds.maxLng) / 2,
          (bounds.minLat + bounds.maxLat) / 2,
        ],
        zoom: 6.5,
        key: API_KEY,
      });
      mapRef.current = map;

      stores.forEach((s) => {
        const marker = new mapgl.Marker(map!, {
          coordinates: s.coordinates,
        });
        marker.on("click", () => {
          onMarkerClick(s.id);
        });
        markersRef.current.set(s.id, marker);
      });
    });

    return () => {
      cancelled = true;
      if (popupRef.current) {
        popupRef.current.destroy();
        popupRef.current = null;
      }
      markersRef.current.forEach((m) => m.destroy());
      markersRef.current.clear();
      if (map) map.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const mapgl = mapglRef.current;
    if (!map || !mapgl) return;

    if (popupRef.current) {
      popupRef.current.destroy();
      popupRef.current = null;
    }

    if (!activeId) return;
    const store = stores.find((s) => s.id === activeId);
    if (!store) return;

    map.setCenter(store.coordinates);
    map.setZoom(15);

    popupRef.current = new mapgl.HtmlMarker(map, {
      coordinates: store.coordinates,
      html: popupHtml(store),
      anchor: [130, 115],
      zIndex: 9999,
    });
  }, [activeId, stores]);

  return <div ref={containerRef} className="w-full h-full" />;
}

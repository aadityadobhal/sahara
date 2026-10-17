import { useEffect, useMemo, useState } from "react";
import { WifiOff } from "lucide-react";
import { mapToLatLng } from "@/lib/community";
import {
  calculateWalkingRoute,
  haversineMetres,
  loadOfflineMap,
  resolveUserLocation,
  type LatLng,
  type OfflineMapData,
  type OfflineRoute,
  type ResolvedLocation,
} from "@/lib/offline-routing";
import { SHELTERS, type LiveShelter } from "@/lib/shelters";

export interface OfflineNavigationState {
  map: OfflineMapData | null;
  location: ResolvedLocation | null;
  route: OfflineRoute | null;
  loading: boolean;
  error: string | null;
}

export function shelterPoint(shelter: { pos: { x: number; y: number } }): LatLng {
  const point = mapToLatLng(shelter.pos);
  return { lat: point.latitude, lng: point.longitude };
}

export function useOfflineNavigation(destinationId?: string | null): OfflineNavigationState {
  const [map, setMap] = useState<OfflineMapData | null>(null);
  const [location, setLocation] = useState<ResolvedLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([loadOfflineMap(), resolveUserLocation()])
      .then(([nextMap, nextLocation]) => {
        if (!active) return;
        setMap(nextMap);
        setLocation(nextLocation);
      })
      .catch((reason: unknown) => {
        if (active)
          setError(reason instanceof Error ? reason.message : "Offline map could not be loaded");
      });
    return () => {
      active = false;
    };
  }, []);

  const route = useMemo(() => {
    if (!map || !location || !destinationId) return null;
    const shelter = SHELTERS.find((item) => item.id === destinationId);
    return shelter ? calculateWalkingRoute(map, location.point, shelterPoint(shelter)) : null;
  }, [map, location, destinationId]);

  return { map, location, route, loading: !error && (!map || !location), error };
}

export function nearestAvailableByRoad(
  map: OfflineMapData | null,
  location: ResolvedLocation | null,
  shelters: LiveShelter[],
) {
  if (!map || !location) return null;
  return (
    shelters
      .filter(
        (shelter) =>
          shelter.status !== "FULL" &&
          haversineMetres(location.point, shelterPoint(shelter)) <= 5_000,
      )
      .map((shelter) => ({
        shelter,
        route: calculateWalkingRoute(map, location.point, shelterPoint(shelter)),
      }))
      .filter(
        (item): item is { shelter: LiveShelter; route: OfflineRoute } =>
          item.route !== null && item.route.distanceKm <= 5,
      )
      .sort((a, b) => a.route.distanceKm - b.route.distanceKm)[0] ?? null
  );
}

export function OfflineMap({
  navigation,
  selectedId,
  onSelect,
  compact = false,
}: {
  navigation: OfflineNavigationState;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  compact?: boolean;
}) {
  const { map, location, route, loading, error } = navigation;
  if (error) {
    return (
      <div className="grid min-h-56 place-items-center rounded-xl border-2 border-warning-border bg-warning-soft p-5 text-center">
        <div>
          <WifiOff className="mx-auto h-8 w-8 text-warning-foreground" aria-hidden />
          <p className="mt-2 font-extrabold">OSM MAP DATA MISSING</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <p className="mt-2 text-xs font-bold">
            Add the real Aluva extract at public/maps/aluva.osm. No fake route is being shown.
          </p>
        </div>
      </div>
    );
  }
  if (loading || !map || !location)
    return (
      <div className="grid min-h-56 place-items-center rounded-xl border bg-muted text-sm font-bold">
        Loading local Aluva roads…
      </div>
    );

  const viewBounds = boundsFor(map, route);
  const project = (point: LatLng) => ({
    x:
      ((point.lng - viewBounds.minLng) /
        Math.max(0.000001, viewBounds.maxLng - viewBounds.minLng)) *
      1000,
    y:
      ((viewBounds.maxLat - point.lat) /
        Math.max(0.000001, viewBounds.maxLat - viewBounds.minLat)) *
      700,
  });
  const path = (points: LatLng[]) =>
    points
      .map((point, index) => {
        const p = project(point);
        return `${index === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <div className="relative overflow-hidden rounded-xl border bg-[#e8efe8]">
      <div className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-[11px] font-extrabold tracking-widest text-navy-foreground shadow">
        <WifiOff className="h-3.5 w-3.5" aria-hidden /> OFFLINE MAP
      </div>
      <div className="absolute right-2 top-2 z-10 rounded-full bg-card/95 px-2.5 py-1 text-[10px] font-bold shadow">
        {location.source === "gps"
          ? "CURRENT LOCATION"
          : location.source === "cached"
            ? "LAST KNOWN LOCATION"
            : "ALUVA DEMO LOCATION"}
      </div>
      <svg
        viewBox="0 0 1000 700"
        role="img"
        aria-label="Offline OpenStreetMap road map of Aluva"
        className={compact ? "aspect-[4/3] w-full" : "aspect-square w-full"}
      >
        <rect width="1000" height="700" fill="#e8efe8" />
        <path
          d={map.roads.map((road) => path(road.coordinates)).join(" ")}
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={map.roads.map((road) => path(road.coordinates)).join(" ")}
          fill="none"
          stroke="#aab7ad"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {route && (
          <>
            <path
              d={path(route.coordinates)}
              fill="none"
              stroke="#ffffff"
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={path(route.coordinates)}
              fill="none"
              stroke="#1261a0"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        {SHELTERS.map((shelter) => {
          const point = project(shelterPoint(shelter));
          const selected = shelter.id === selectedId;
          const fill =
            shelter.status === "FULL"
              ? "#cf2e2e"
              : shelter.status === "LIMITED"
                ? "#d58b00"
                : "#16814b";
          return (
            <g
              key={shelter.id}
              transform={`translate(${point.x} ${point.y})`}
              onClick={() => onSelect?.(shelter.id)}
              className={onSelect ? "cursor-pointer" : ""}
              role={onSelect ? "button" : undefined}
            >
              <title>{shelter.name.en}</title>
              {selected && <circle r="18" fill="none" stroke={fill} strokeWidth="4" />}
              <circle r={selected ? 13 : 10} fill={fill} stroke="#fff" strokeWidth="4" />
              <text y="4" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">
                S
              </text>
            </g>
          );
        })}
        {(() => {
          const user = project(location.point);
          return (
            <g transform={`translate(${user.x} ${user.y})`}>
              <circle r="20" fill="#1261a0" opacity="0.2" />
              <circle r="10" fill="#1261a0" stroke="#fff" strokeWidth="4" />
            </g>
          );
        })()}
      </svg>
      <p className="border-t bg-card/95 px-3 py-2 text-[10px] text-muted-foreground">
        © OpenStreetMap contributors · locally packaged road data
      </p>
    </div>
  );
}

function boundsFor(map: OfflineMapData, route: OfflineRoute | null) {
  if (!route || route.coordinates.length < 2) return map.bounds;
  const lats = route.coordinates.map((point) => point.lat);
  const lngs = route.coordinates.map((point) => point.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latPadding = Math.max((maxLat - minLat) * 0.18, 0.001);
  const lngPadding = Math.max((maxLng - minLng) * 0.18, 0.001);
  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding,
  };
}

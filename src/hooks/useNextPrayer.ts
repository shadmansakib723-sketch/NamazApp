import { useEffect, useState } from "react";
import * as Location from "expo-location";

import {
  formatCountdown,
  formatDate,
  formatTime,
  getNextPrayer,
} from "@/utils/prayerTimes";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NextPrayerState {
  prayerName: string;
  prayerTime: string;
  countdown: string;
  city: string;
  country: string;
  date: string;
  isLoading: boolean;
  error: string | null;
}

// ─── Fallback values shown while loading ─────────────────────────────────────

const LOADING_STATE: NextPrayerState = {
  prayerName: "—",
  prayerTime: "—",
  countdown: "Locating…",
  city: "Locating…",
  country: "—",
  date: formatDate(new Date()),
  isLoading: true,
  error: null,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useNextPrayer
 *
 * Fetches the device location once on mount, reverse-geocodes it to get
 * city and country, then uses adhan to calculate the next upcoming prayer.
 *
 * A 60-second interval keeps the countdown live without re-fetching location.
 */
export function useNextPrayer(): NextPrayerState {
  const [state, setState] = useState<NextPrayerState>(LOADING_STATE);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let latitude = 0;
    let longitude = 0;

    /**
     * Rebuilds prayer name, time, and countdown from cached coordinates.
     * Called on mount and every 60 seconds.
     */
    function refreshPrayerData(): void {
      const next = getNextPrayer(latitude, longitude);
      setState((prev) => ({
        ...prev,
        prayerName: next.name,
        prayerTime: formatTime(next.time),
        countdown: formatCountdown(next.time),
        date: formatDate(new Date()),
        isLoading: false,
        error: null,
      }));
    }

    async function init(): Promise<void> {
      try {
        // 1. Request foreground location permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setState({
            ...LOADING_STATE,
            prayerName: "—",
            prayerTime: "—",
            countdown: "—",
            city: "Location denied",
            country: "—",
            date: formatDate(new Date()),
            isLoading: false,
            error: "Location permission denied",
          });
          return;
        }

        // 2. Get current GPS position (balanced accuracy is enough for prayer times)
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        // 3. Reverse geocode to get city & country
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const city =
          geocode?.city ??
          geocode?.district ??
          geocode?.subregion ??
          "Unknown city";
        const country = geocode?.country ?? "Unknown country";

        // 4. Calculate initial prayer data
        const next = getNextPrayer(latitude, longitude);

        setState({
          prayerName: next.name,
          prayerTime: formatTime(next.time),
          countdown: formatCountdown(next.time),
          city,
          country,
          date: formatDate(new Date()),
          isLoading: false,
          error: null,
        });

        // 5. Refresh countdown every 60 seconds
        intervalId = setInterval(refreshPrayerData, 60_000);
      } catch {
        setState({
          ...LOADING_STATE,
          prayerName: "—",
          prayerTime: "—",
          countdown: "—",
          city: "Unavailable",
          country: "—",
          date: formatDate(new Date()),
          isLoading: false,
          error: "Could not fetch location",
        });
      }
    }

    void init();

    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, []);

  return state;
}

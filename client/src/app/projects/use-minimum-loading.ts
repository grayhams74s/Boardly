import { useEffect, useState } from "react";

const DEFAULT_MINIMUM_LOADING_MS = 500;

export const useMinimumLoading = (
  isLoading: boolean,
  minimumDuration = DEFAULT_MINIMUM_LOADING_MS,
) => {
  const [minimumDurationElapsed, setMinimumDurationElapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMinimumDurationElapsed(true);
    }, minimumDuration);

    return () => window.clearTimeout(timer);
  }, [minimumDuration]);

  return isLoading || !minimumDurationElapsed;
};

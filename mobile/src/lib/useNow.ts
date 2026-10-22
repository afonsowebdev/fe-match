import { useEffect, useState } from 'react';

// Hora atual que se atualiza sozinha (para contagens decrescentes, como o Destaque).
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}

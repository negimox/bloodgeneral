import { useEffect, useState } from 'react';
import { fetchBloodCollectionStats } from '../lib/api';

export function useBloodCollectionStats(stateCode: number, month: number, year: number) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchBloodCollectionStats(stateCode, month, year)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [stateCode, month, year]);

  return { data, loading, error };
}

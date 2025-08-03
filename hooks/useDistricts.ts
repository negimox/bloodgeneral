import { useEffect, useState } from 'react';
import { fetchDistricts } from '../lib/api';

export function useDistricts(stateCode: number) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stateCode) return;
    setLoading(true);
    fetchDistricts(stateCode)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [stateCode]);

  return { data, loading, error };
}

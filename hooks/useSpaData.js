import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';

const useSpaData = (apiPath, dependencies = []) => {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const depsKey = useMemo(() => JSON.stringify(dependencies), [dependencies]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Build URL with userId if not already included
        let url = apiPath;
        if (!url.includes('userId=') && session.user._id) {
          const separator = url.includes('?') ? '&' : '?';
          url = `${url}${separator}userId=${session.user._id}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          // Handle 404 errors gracefully for missing API endpoints
          if (response.status === 404) {
            console.warn(`API endpoint not found: ${url}`);
            setData(null);
            setLoading(false);
            return;
          }
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Data fetching error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?._id, apiPath, depsKey]);

  const refetch = () => {
    if (session?.user?._id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          let url = apiPath;
          if (!url.includes('userId=') && session.user._id) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}userId=${session.user._id}`;
          }

          const response = await fetch(url);

          if (!response.ok) {
            // Handle 404 errors gracefully for missing API endpoints
            if (response.status === 404) {
              console.warn(`API endpoint not found: ${url}`);
              setData(null);
              setLoading(false);
              return;
            }
            throw new Error(`Failed to fetch data: ${response.statusText}`);
          }

          const result = await response.json();
          setData(result);
        } catch (err) {
          console.error('Data refetch error:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  };

  return { data, loading, error, refetch, session };
};

export default useSpaData;
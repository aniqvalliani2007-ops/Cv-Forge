import { useState, useEffect } from 'react';

export const useUsage = () => {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock usage data
    const mockUsage = {
      current: 0,
      limit: 3
    };
    setUsage(mockUsage);
    setLoading(false);
  }, []);

  const incrementUsage = () => {
    setUsage(prev => ({
      ...prev,
      current: Math.min(prev.current + 1, prev.limit)
    }));
  };

  return { usage, loading, incrementUsage };
};

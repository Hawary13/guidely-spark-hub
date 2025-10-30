import { useEffect, useState } from 'react';
import { queryClient } from '@/lib/queryClient';
import { 
  FastProgramService, 
  FastEventService, 
  FastStatisticsService,
  FastSuccessStoryService,
  FastNewsService,
  FastTeamMemberService,
  FastPartnerService,
  FastPageContentService
} from '@/lib/fastFirestore';

interface CacheStatus {
  isLoading: boolean;
  isComplete: boolean;
  progress: number;
  errors: string[];
}

const CACHE_KEYS = [
  ['admin', 'programs'],
  ['admin', 'events'],
  ['admin', 'submissions'],
  ['admin', 'statistics'],
  ['admin', 'success-stories'],
  ['admin', 'news'],
  ['admin', 'team'],
  ['admin', 'partners'],
  ['admin', 'pages'],
  ['admin', 'hero-sections'],
  ['admin', 'about-sections'],
  ['admin', 'mission-vision'],
];

const CACHE_SERVICES = [
  () => FastProgramService.getAll().catch(() => []),
  () => FastEventService.getAll().catch(() => []),
  () => Promise.resolve([]), // Skip form submissions for faster loading
  () => FastStatisticsService.get().catch(() => ({})),
  () => FastSuccessStoryService.getAll().catch(() => []),
  () => FastNewsService.getAll().catch(() => []),
  () => FastTeamMemberService.getAll().catch(() => []),
  () => FastPartnerService.getAll().catch(() => []),
  () => FastPageContentService.getAll().catch(() => []),
  () => Promise.resolve([]), // Skip hero sections for faster loading
  () => Promise.resolve([]), // Skip about sections for faster loading
  () => Promise.resolve([]), // Skip mission vision for faster loading
];

export function useAdminCache() {
  const [status, setStatus] = useState<CacheStatus>({
    isLoading: false,
    isComplete: false,
    progress: 0,
    errors: []
  });

  const preloadAdminData = async () => {
    setStatus({
      isLoading: true,
      isComplete: false,
      progress: 0,
      errors: []
    });

    const errors: string[] = [];
    let completed = 0;

    // Load data in parallel with timeout for faster loading
    const loadPromises = CACHE_KEYS.map(async (queryKey, i) => {
      try {
        const service = CACHE_SERVICES[i];
        
        // Check if data is already cached
        const cachedData = queryClient.getQueryData(queryKey);
        
        if (!cachedData) {
          // Race between timeout and actual query
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 2000)
          );
          
          await Promise.race([
            queryClient.prefetchQuery({
              queryKey,
              queryFn: service,
              staleTime: 10 * 60 * 1000, // 10 minutes
              gcTime: 60 * 60 * 1000, // 1 hour
            }),
            timeoutPromise
          ]);
        }
        
        completed++;
        setStatus(prev => ({
          ...prev,
          progress: (completed / CACHE_KEYS.length) * 100
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to cache ${queryKey.join('/')}: ${errorMessage}`);
        completed++;
        setStatus(prev => ({
          ...prev,
          progress: (completed / CACHE_KEYS.length) * 100
        }));
      }
    });

    // Wait for all loading to complete
    await Promise.allSettled(loadPromises);

    setStatus({
      isLoading: false,
      isComplete: true,
      progress: 100,
      errors
    });
  };

  const invalidateCache = () => {
    CACHE_KEYS.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey });
    });
  };

  const clearCache = () => {
    CACHE_KEYS.forEach(queryKey => {
      queryClient.removeQueries({ queryKey });
    });
    setStatus({
      isLoading: false,
      isComplete: false,
      progress: 0,
      errors: []
    });
  };

  const refreshCache = async () => {
    clearCache();
    await preloadAdminData();
  };

  return {
    status,
    preloadAdminData,
    invalidateCache,
    clearCache,
    refreshCache
  };
}

// Hook to check if specific data is cached
export function useIsCached(queryKey: string[]) {
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const data = queryClient.getQueryData(queryKey);
    setIsCached(!!data);
  }, [queryKey]);

  return isCached;
}

// Hook to get cache statistics
export function useCacheStats() {
  const [stats, setStats] = useState({
    totalQueries: 0,
    cachedQueries: 0,
    cacheHitRate: 0
  });

  useEffect(() => {
    const updateStats = () => {
      const cachedQueries = CACHE_KEYS.filter(key => 
        queryClient.getQueryData(key)
      ).length;
      
      const cacheHitRate = CACHE_KEYS.length > 0 
        ? (cachedQueries / CACHE_KEYS.length) * 100 
        : 0;

      setStats({
        totalQueries: CACHE_KEYS.length,
        cachedQueries,
        cacheHitRate
      });
    };

    updateStats();
    
    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return stats;
}
'use client';

import { useEffect } from 'react';

export function Analytics() {
  useEffect(() => {
    // Track Web Vitals using sendBeacon for reliability
    const trackMetric = (name: string, value: number, delta: number) => {
      const beacon = {
        metric: name,
        value: Math.round(value),
        delta: Math.round(delta),
        timestamp: Date.now(),
        pathname: typeof window !== 'undefined' ? window.location.pathname : '',
      };

      // Send to Vercel Analytics endpoint (static-export compatible)
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/_vercel/insights/pageview',
          JSON.stringify(beacon)
        );
      }
    };

    // Observe Web Vitals
    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackMetric('LCP', entry.renderTime || entry.loadTime, entry.duration);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            trackMetric('CLS', clsValue, (entry as any).value);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Input Delay (via Web Vitals)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          const perfData = performance.getEntriesByName('first-input');
          if (perfData.length > 0) {
            const entry = perfData[0] as any;
            trackMetric('FID', entry.processingDuration, entry.processingDuration);
          }
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange, true);

      return () => {
        lcpObserver.disconnect();
        clsObserver.disconnect();
        document.removeEventListener('visibilitychange', handleVisibilityChange, true);
      };
    } catch (e) {
      // Silently fail in unsupported browsers
    }
  }, []);

  return null;
}

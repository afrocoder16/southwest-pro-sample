import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Adds `.in` to every `.reveal` element as it scrolls into view. Re-scans on route changes. */
export default function useReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const els = [...document.querySelectorAll('.reveal:not(.in)')];
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);
}

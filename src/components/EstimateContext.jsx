import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/*
 * Notes a visitor builds up while browsing (what they are painting, services, colors, scope).
 * They stay in this browser tab (sessionStorage) and are only used to pre-fill an email DRAFT
 * (mailto:) that the visitor chooses to open. Nothing is sent or stored anywhere else.
 */

const KEY = 'swp-estimate-notes';
const empty = {
  project: null, // id from projectTypes
  services: [], // chosen service names
  colors: null, // { siding, trim, door } names from the try-on
  zones: [], // storefront walk-through zones
  propertyType: '',
  propertyTouched: false, // true once the visitor chooses a property type themselves
  occupancy: '',
  brandSpecs: '',
};

const Ctx = createContext(null);

function load() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

export function EstimateProvider({ children }) {
  const [notes, setNotes] = useState(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(notes));
    } catch {
      /* storage can be blocked; the page works without it */
    }
  }, [notes]);

  const patch = useCallback((p) => setNotes((n) => ({ ...n, ...(typeof p === 'function' ? p(n) : p) })), []);
  const reset = useCallback(() => setNotes(empty), []);
  const value = useMemo(() => ({ notes, patch, reset }), [notes, patch, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEstimate() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useEstimate must be used inside EstimateProvider');
  return v;
}

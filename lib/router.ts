import { useEffect, useState } from 'react';

const normalize = (raw: string) => {
  if (!raw) return '/';
  const stripped = raw.startsWith('#') ? raw.slice(1) : raw;
  if (!stripped.startsWith('/')) return '/' + stripped;
  return stripped;
};

export const useHashRoute = (): string => {
  const [path, setPath] = useState(() => (typeof window === 'undefined' ? '/' : normalize(window.location.hash)));

  useEffect(() => {
    const onChange = () => setPath(normalize(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return path;
};

export const navigate = (to: string) => {
  const target = to.startsWith('/') ? to : '/' + to;
  window.location.hash = target;
};

export const matchRoute = (path: string, pattern: string): Record<string, string> | null => {
  const pParts = pattern.split('/').filter(Boolean);
  const xParts = path.split('/').filter(Boolean);
  if (pParts.length !== xParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) params[pParts[i].slice(1)] = decodeURIComponent(xParts[i]);
    else if (pParts[i] !== xParts[i]) return null;
  }
  return params;
};

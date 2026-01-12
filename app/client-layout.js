'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '../lib/serviceWorker';

export default function ClientLayout({ children }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return <>{children}</>;
}

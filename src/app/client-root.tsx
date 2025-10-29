'use client';

import ClientLayout from './client-layout';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
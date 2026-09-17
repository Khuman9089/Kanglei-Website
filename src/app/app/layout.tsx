import type { Metadata, Viewport } from 'next';
import React from 'react';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'KangleiAstro App',
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-[100vh] h-[100dvh] overflow-hidden overscroll-none m-0 p-0">
      {children}
    </div>
  );
}

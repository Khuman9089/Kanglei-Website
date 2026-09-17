import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account & Data Deletion | Kanglei Astro - Manipuri Calendar (Developer: Oinam Robert Singh)',
  description:
    'Official Account and Data Deletion portal for Kanglei Astro (Manipuri Calendar by KangleiAstro / KuthiYengpham), developed by Oinam Robert Singh. Request immediate or web-assisted permanent deletion of your account, sacred birth charts, and user data in compliance with Google Play Data Safety policy.',
  openGraph: {
    title: 'Account & Data Deletion | Kanglei Astro (Developer: Oinam Robert Singh)',
    description:
      'Official Google Play Data Safety account and data deletion request page for Kanglei Astro / Manipuri Calendar mobile app by Oinam Robert Singh.',
    url: 'https://kuthiyengpham.in/delete-account',
    siteName: 'Kanglei Astro - KuthiYengpham',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kuthiyengpham.in/delete-account',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DeleteAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

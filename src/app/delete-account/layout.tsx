import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account & Data Deletion | Manipuri Calendar KangleiAstro (Developer: NexGen Info Lab)',
  description:
    'Official Account and Data Deletion portal for Manipuri Calendar KangleiAstro, developed by NexGen Info Lab. Request permanent deletion of your account and personal user data in compliance with Google Play Data Safety policy.',
  openGraph: {
    title: 'Account & Data Deletion | Manipuri Calendar KangleiAstro (Developer: NexGen Info Lab)',
    description:
      'Official Google Play Data Safety account and data deletion request page for Manipuri Calendar KangleiAstro mobile app by NexGen Info Lab.',
    url: 'https://kuthiyengpham.in/delete-account',
    siteName: 'Manipuri Calendar KangleiAstro - NexGen Info Lab',
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

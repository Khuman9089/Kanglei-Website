import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jyoti AI — Account & Data Deletion Portal | Data Safety',
  description:
    'Official Account and Personal Data Deletion Request Page for Jyoti AI (Your Personal Celestial Intelligence). Submit account and data deletion requests in compliance with Google Play User Data policies.',
  keywords: [
    'Jyoti AI delete account',
    'Jyoti AI account deletion',
    'Jyoti AI data deletion',
    'Jyoti AI privacy controls',
    'Jyoti astrology data safety',
  ],
  alternates: {
    canonical: 'https://kuthiyengpham.in/astroai/delete-account',
  },
  openGraph: {
    title: 'Jyoti AI — Account & Data Deletion Portal',
    description:
      'Official Account & Personal Data Deletion Request Page for Jyoti AI.',
    url: 'https://kuthiyengpham.in/astroai/delete-account',
    siteName: 'Jyoti AI',
    type: 'website',
  },
};

export default function JyotiDeleteAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#07090E] text-[#F8FAFC]">{children}</div>;
}

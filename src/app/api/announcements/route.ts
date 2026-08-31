import { NextResponse } from 'next/server';
import { readPersistentData, writePersistentData } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'ANNOUNCEMENT' | 'PROMO_AD' | 'URGENT_NOTICE' | 'POLICY_UPDATE';
  badge: string;
  actionText?: string;
  actionUrl?: string;
  imageUrl?: string;
  createdAt: string;
  targetAudience: 'ALL_ASTROLOGERS' | 'SPECIFIC_ASTROLOGER' | 'ALL_USERS';
  isActive: boolean;
}

const DEFAULT_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: 'ann-1',
    title: '🛒 Astrologer E-Store Marketplace is Live!',
    message: 'You can now list your own consecrated remedies, energised rosaries, and yantras to sell on the KangleiAstro Store. Submit items under "My Products & Stock" for fast Admin approval.',
    type: 'ANNOUNCEMENT',
    badge: 'NEW FEATURE',
    actionText: 'Add Product Now',
    actionUrl: '/dashboard/astrologer?tab=astro_products',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString().split('T')[0],
    targetAudience: 'ALL_ASTROLOGERS',
    isActive: true,
  },
  {
    id: 'ann-2',
    title: '🔥 Mahashivratri Special Bonus Payout Promo!',
    message: 'Empaneled astrologers get an extra 5% bonus credit on all Kuthi consultations completed between 1st & 15th next month. Keep your online availability updated!',
    type: 'PROMO_AD',
    badge: 'SPECIAL PROMO',
    actionText: 'View Earnings',
    actionUrl: '/dashboard/astrologer?tab=wallet',
    imageUrl: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString().split('T')[0],
    targetAudience: 'ALL_ASTROLOGERS',
    isActive: true,
  },
  {
    id: 'ann-3',
    title: '📌 Standard Operating Guidelines for Kuthi Reports',
    message: 'Please double-check birth details (Sakabta, Bengali Date, Lahiri Ayanamsa) and ensure PDFs are clear before marking orders as COMPLETED.',
    type: 'URGENT_NOTICE',
    badge: 'IMPORTANT',
    createdAt: new Date().toISOString().split('T')[0],
    targetAudience: 'ALL_ASTROLOGERS',
    isActive: true,
  },
];

export async function GET() {
  const announcements = readPersistentData<AdminAnnouncement[]>('announcements', DEFAULT_ANNOUNCEMENTS);
  return NextResponse.json({
    success: true,
    announcements,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let announcements = readPersistentData<AdminAnnouncement[]>('announcements', DEFAULT_ANNOUNCEMENTS);

    if (body.action === 'CREATE') {
      const newAnn: AdminAnnouncement = {
        id: 'ann-' + Date.now(),
        title: body.announcement.title,
        message: body.announcement.message,
        type: body.announcement.type || 'ANNOUNCEMENT',
        badge: body.announcement.badge || 'NOTICE',
        actionText: body.announcement.actionText,
        actionUrl: body.announcement.actionUrl,
        imageUrl: body.announcement.imageUrl,
        createdAt: new Date().toISOString().split('T')[0],
        targetAudience: body.announcement.targetAudience || 'ALL_ASTROLOGERS',
        isActive: true,
      };

      announcements.unshift(newAnn);
      writePersistentData('announcements', announcements);
      return NextResponse.json({
        success: true,
        message: 'Announcement published live for Astrologers!',
        announcements,
      });
    }

    if (body.action === 'UPDATE') {
      const idx = announcements.findIndex((a) => a.id === body.announcement.id);
      if (idx >= 0) {
        announcements[idx] = { ...announcements[idx], ...body.announcement };
        writePersistentData('announcements', announcements);
      }
      return NextResponse.json({
        success: true,
        message: 'Announcement updated!',
        announcements,
      });
    }

    if (body.action === 'DELETE') {
      announcements = announcements.filter((a) => a.id !== body.id);
      writePersistentData('announcements', announcements);
      return NextResponse.json({
        success: true,
        message: 'Announcement removed.',
        announcements,
      });
    }

    if (body.action === 'TOGGLE_ACTIVE') {
      const ann = announcements.find((a) => a.id === body.id);
      if (ann) {
        ann.isActive = !ann.isActive;
        writePersistentData('announcements', announcements);
      }
      return NextResponse.json({
        success: true,
        message: 'Announcement status toggled!',
        announcements,
      });
    }

    return NextResponse.json({ success: true, announcements });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

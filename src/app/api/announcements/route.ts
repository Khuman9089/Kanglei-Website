import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

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

let storedAnnouncements: AdminAnnouncement[] = [
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
  return NextResponse.json({
    success: true,
    announcements: storedAnnouncements,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

      storedAnnouncements.unshift(newAnn);
      return NextResponse.json({
        success: true,
        message: 'Announcement published live for Astrologers!',
        announcements: storedAnnouncements,
      });
    }

    if (body.action === 'UPDATE') {
      const idx = storedAnnouncements.findIndex((a) => a.id === body.announcement.id);
      if (idx >= 0) {
        storedAnnouncements[idx] = { ...storedAnnouncements[idx], ...body.announcement };
      }
      return NextResponse.json({
        success: true,
        message: 'Announcement updated!',
        announcements: storedAnnouncements,
      });
    }

    if (body.action === 'DELETE') {
      storedAnnouncements = storedAnnouncements.filter((a) => a.id !== body.id);
      return NextResponse.json({
        success: true,
        message: 'Announcement removed.',
        announcements: storedAnnouncements,
      });
    }

    if (body.action === 'TOGGLE_ACTIVE') {
      const ann = storedAnnouncements.find((a) => a.id === body.id);
      if (ann) {
        ann.isActive = !ann.isActive;
      }
      return NextResponse.json({
        success: true,
        message: 'Announcement status toggled!',
        announcements: storedAnnouncements,
      });
    }

    return NextResponse.json({ success: true, announcements: storedAnnouncements });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

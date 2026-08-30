import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export interface CustomerReview {
  id: string;
  clientName: string;
  location: string;
  rating: number; // 1 to 5
  comment: string;
  serviceName?: string;
  astrologerName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified: boolean;
  createdAt: string;
}

let REVIEWS_DATABASE: CustomerReview[] = [
  {
    id: 'rev-1',
    clientName: 'Priya S.',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    comment: 'The accuracy of the predictions was remarkable. The career guidance helped me make a crucial decision.',
    serviceName: 'Career & Financial Outlook',
    status: 'APPROVED',
    isVerified: true,
    createdAt: '12 January 2026',
  },
  {
    id: 'rev-2',
    clientName: 'Rahul M.',
    location: 'Delhi, NCR',
    rating: 5,
    comment: 'I was skeptical at first, but the detailed birth chart analysis changed my perspective completely.',
    serviceName: 'Kuthi Yengba Consultation',
    status: 'APPROVED',
    isVerified: true,
    createdAt: '28 January 2026',
  },
  {
    id: 'rev-3',
    clientName: 'Ananya K.',
    location: 'Bangalore, Karnataka',
    rating: 5,
    comment: 'The marriage compatibility report was incredibly detailed and accurate. Highly recommended!',
    serviceName: 'Marriage Matching (পক্ন-ৱাইনবা য়েংবা)',
    status: 'APPROVED',
    isVerified: true,
    createdAt: '05 February 2026',
  },
  {
    id: 'rev-4',
    clientName: 'Vikram P.',
    location: 'Hyderabad, Telangana',
    rating: 5,
    comment: "Best astrology consultation I've ever had. The remedies suggested actually worked!",
    serviceName: 'Kuthi Yengba Consultation',
    status: 'APPROVED',
    isVerified: true,
    createdAt: '14 February 2026',
  },
  {
    id: 'rev-5',
    clientName: 'Meera R.',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    comment: 'The Vimshottari Dasha analysis was spot-on. Every prediction matched my life events.',
    serviceName: '30-Page Kuthi Report',
    status: 'APPROVED',
    isVerified: true,
    createdAt: '20 February 2026',
  },
  {
    id: 'rev-6',
    clientName: 'Thoibi Ningthoujam',
    location: 'Imphal East, Manipur',
    rating: 5,
    comment: 'Hand-written Kuthi Iba (কুঠি ইবা) was delivered within 24 hours on WhatsApp and physical hardcopy! Excellent service.',
    serviceName: 'Kuthi Iba (কুঠি ইবা)',
    status: 'APPROVED',
    isVerified: true,
    createdAt: '25 February 2026',
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const approvedOnly = searchParams.get('approvedOnly') === 'true';

  if (approvedOnly) {
    const approved = REVIEWS_DATABASE.filter((r) => r.status === 'APPROVED');
    return NextResponse.json({ success: true, reviews: approved });
  }

  return NextResponse.json({ success: true, reviews: REVIEWS_DATABASE });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, review, reviewId } = body;

    // 1. SUBMIT_REVIEW (From Client Dashboard)
    if (action === 'SUBMIT_REVIEW' && review) {
      const newReview: CustomerReview = {
        id: 'rev-' + Date.now(),
        clientName: review.clientName || 'Anonymous Client',
        location: review.location || 'Imphal, Manipur',
        rating: review.rating || 5,
        comment: review.comment || '',
        serviceName: review.serviceName || 'Consultation Service',
        astrologerName: review.astrologerName || 'Acharya',
        status: 'PENDING', // Customer submitted reviews start as PENDING moderation!
        isVerified: true,
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      };

      REVIEWS_DATABASE = [newReview, ...REVIEWS_DATABASE];
      return NextResponse.json({ success: true, message: 'Review submitted successfully for admin approval!', review: newReview });
    }

    // 2. APPROVE_REVIEW (Admin Action)
    if (action === 'APPROVE_REVIEW' && reviewId) {
      REVIEWS_DATABASE = REVIEWS_DATABASE.map((r) =>
        r.id === reviewId ? { ...r, status: 'APPROVED', isVerified: true } : r
      );
      return NextResponse.json({ success: true, message: 'Review approved and published live!', reviews: REVIEWS_DATABASE });
    }

    // 3. REJECT_REVIEW (Admin Action)
    if (action === 'REJECT_REVIEW' && reviewId) {
      REVIEWS_DATABASE = REVIEWS_DATABASE.map((r) =>
        r.id === reviewId ? { ...r, status: 'REJECTED' } : r
      );
      return NextResponse.json({ success: true, message: 'Review rejected.', reviews: REVIEWS_DATABASE });
    }

    // 4. CREATE_REVIEW (Admin Manual Add)
    if (action === 'CREATE_REVIEW' && review) {
      const newReview: CustomerReview = {
        id: 'rev-' + Date.now(),
        clientName: review.clientName,
        location: review.location || 'Imphal, Manipur',
        rating: review.rating || 5,
        comment: review.comment,
        serviceName: review.serviceName || 'Consultation',
        status: review.status || 'APPROVED',
        isVerified: true,
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      };

      REVIEWS_DATABASE = [newReview, ...REVIEWS_DATABASE];
      return NextResponse.json({ success: true, message: 'New verified review added!', reviews: REVIEWS_DATABASE });
    }

    // 5. UPDATE_REVIEW (Admin Edit)
    if (action === 'UPDATE_REVIEW' && reviewId && review) {
      REVIEWS_DATABASE = REVIEWS_DATABASE.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              clientName: review.clientName ?? r.clientName,
              location: review.location ?? r.location,
              rating: review.rating ?? r.rating,
              comment: review.comment ?? r.comment,
              serviceName: review.serviceName ?? r.serviceName,
              status: review.status ?? r.status,
            }
          : r
      );
      return NextResponse.json({ success: true, message: 'Review updated successfully!', reviews: REVIEWS_DATABASE });
    }

    // 6. DELETE_REVIEW (Admin Action)
    if (action === 'DELETE_REVIEW' && reviewId) {
      REVIEWS_DATABASE = REVIEWS_DATABASE.filter((r) => r.id !== reviewId);
      return NextResponse.json({ success: true, message: 'Review deleted.', reviews: REVIEWS_DATABASE });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

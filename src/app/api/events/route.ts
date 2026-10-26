import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const EVENTS_FILE = path.join(process.cwd(), 'data', 'upcoming_events.json');

export interface CulturalEvent {
  id: string;
  titleEn: string;
  titleMeetei?: string;
  titleBengali?: string;
  dateStr: string;
  endDateStr?: string;
  timeStr?: string;
  venue: string;
  category: string;
  description: string;
  imageUrl?: string;
  organizer?: string;
  submitterName?: string;
  submitterContact?: string;
  status: 'approved' | 'pending' | 'rejected';
  isFeatured?: boolean;
  createdAt: string;
}

function getStoredEvents(): CulturalEvent[] {
  try {
    if (!fs.existsSync(EVENTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(EVENTS_FILE, 'utf8');
    return JSON.parse(data) || [];
  } catch (err) {
    console.error('Error reading upcoming_events.json:', err);
    return [];
  }
}

function saveEvents(events: CulturalEvent[]): boolean {
  try {
    const dir = path.dirname(EVENTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing upcoming_events.json:', err);
    return false;
  }
}

// GET /api/events
// By default returns only 'approved' events for mobile app / homepage
// If ?all=true is passed (used by admin), returns all events including pending
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    const statusFilter = searchParams.get('status');

    let events = getStoredEvents();

    if (statusFilter) {
      events = events.filter((e) => e.status === statusFilter);
    } else if (!showAll) {
      events = events.filter((e) => e.status === 'approved');
    }

    // Sort by dateStr ascending
    events.sort((a, b) => (a.dateStr || '').localeCompare(b.dateStr || ''));

    return NextResponse.json({
      success: true,
      events,
      total: events.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events
// Submits a new cultural event.
// From mobile app: status is 'pending' (requires admin approval)
// From admin: status can be 'approved' directly
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.titleEn || !body.dateStr || !body.venue) {
      return NextResponse.json(
        { success: false, error: 'Please provide event title, date, and venue location.' },
        { status: 400 }
      );
    }

    const events = getStoredEvents();
    const isAdmin = body.isAdmin === true || body.status === 'approved';

    const newEvent: CulturalEvent = {
      id: 'evt-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      titleEn: String(body.titleEn).trim(),
      titleMeetei: body.titleMeetei ? String(body.titleMeetei).trim() : '',
      titleBengali: body.titleBengali ? String(body.titleBengali).trim() : '',
      dateStr: String(body.dateStr).trim(),
      endDateStr: body.endDateStr ? String(body.endDateStr).trim() : '',
      timeStr: body.timeStr ? String(body.timeStr).trim() : 'All Day',
      venue: String(body.venue).trim(),
      category: body.category || 'festival',
      description: body.description ? String(body.description).trim() : '',
      imageUrl: body.imageUrl ? String(body.imageUrl).trim() : '',
      organizer: body.organizer ? String(body.organizer).trim() : '',
      submitterName: body.submitterName ? String(body.submitterName).trim() : 'Anonymous Community Member',
      submitterContact: body.submitterContact ? String(body.submitterContact).trim() : '',
      status: isAdmin ? 'approved' : 'pending',
      isFeatured: body.isFeatured === true,
      createdAt: new Date().toISOString(),
    };

    events.unshift(newEvent);
    const saved = saveEvents(events);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Failed to write event to storage' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      event: newEvent,
      message: isAdmin
        ? 'Event published successfully!'
        : 'Event submitted successfully! It will appear on the calendar once approved by admin.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit event' },
      { status: 500 }
    );
  }
}

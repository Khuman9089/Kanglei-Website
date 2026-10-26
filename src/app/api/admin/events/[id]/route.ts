import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const EVENTS_FILE = path.join(process.cwd(), 'data', 'upcoming_events.json');

function getStoredEvents(): any[] {
  try {
    if (!fs.existsSync(EVENTS_FILE)) return [];
    const data = fs.readFileSync(EVENTS_FILE, 'utf8');
    return JSON.parse(data) || [];
  } catch (err) {
    console.error('Error reading upcoming_events.json:', err);
    return [];
  }
}

function saveEvents(events: any[]): boolean {
  try {
    const dir = path.dirname(EVENTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing upcoming_events.json:', err);
    return false;
  }
}

// PATCH /api/admin/events/[id]
// Approve, reject, feature, or update an event
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const events = getStoredEvents();
    const eventIndex = events.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    let targetStatus = body.status;
    if (body.action === 'approve') targetStatus = 'approved';
    if (body.action === 'reject') targetStatus = 'rejected';

    // Update allowable fields
    const current = events[eventIndex];
    const updated = {
      ...current,
      ...(targetStatus && { status: targetStatus }),
      ...(typeof body.isFeatured === 'boolean' && { isFeatured: body.isFeatured }),
      ...(body.titleEn && { titleEn: body.titleEn }),
      ...(body.titleMeetei !== undefined && { titleMeetei: body.titleMeetei }),
      ...(body.titleBengali !== undefined && { titleBengali: body.titleBengali }),
      ...(body.dateStr && { dateStr: body.dateStr }),
      ...(body.endDateStr !== undefined && { endDateStr: body.endDateStr }),
      ...(body.timeStr !== undefined && { timeStr: body.timeStr }),
      ...(body.venue && { venue: body.venue }),
      ...(body.category && { category: body.category }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.organizer !== undefined && { organizer: body.organizer }),
      updatedAt: new Date().toISOString(),
    };

    events[eventIndex] = updated;
    const saved = saveEvents(events);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Failed to save updated event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      event: updated,
      message: body.status === 'approved' ? 'Event approved & published!' : 'Event updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events/[id]
// Permanently remove an event
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = getStoredEvents();
    const filtered = events.filter((e) => e.id !== id);

    if (filtered.length === events.length) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const saved = saveEvents(filtered);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}

import upcomingEventsData from '../../data/upcoming_events.json';

export interface UpcomingEvent {
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

export const SEED_UPCOMING_EVENTS: UpcomingEvent[] = upcomingEventsData as UpcomingEvent[];

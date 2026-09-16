import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_FILE = path.join(process.cwd(), 'data', 'useful_topics.json');

export interface UsefulTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  content_html: string;
  is_published: boolean;
  updated_at: string;
}

function readTopics(): UsefulTopic[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading useful topics:', err);
    return [];
  }
}

function writeTopics(topics: UsefulTopic[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(topics, null, 2), 'utf8');
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const includeDrafts = searchParams.get('all') === 'true' || searchParams.get('admin') === 'true';

    let topics = readTopics();

    if (id) {
      const topic = topics.find((t) => t.id === id);
      if (!topic) {
        return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, topic });
    }

    if (!includeDrafts) {
      topics = topics.filter((t) => t.is_published);
    }

    if (category && category !== 'All') {
      topics = topics.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    // Sort by updated_at descending
    topics.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return NextResponse.json({ success: true, topics });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch topics' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, summary, content_html, is_published } = body;

    if (!title || !category || !content_html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const topics = readTopics();
    const newTopic: UsefulTopic = {
      id: `topic-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      summary: (summary || '').trim(),
      content_html: content_html.trim(),
      is_published: is_published !== false,
      updated_at: new Date().toISOString(),
    };

    topics.unshift(newTopic);
    writeTopics(topics);

    return NextResponse.json({ success: true, topic: newTopic });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create topic' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, category, summary, content_html, is_published } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing topic ID' }, { status: 400 });
    }

    const topics = readTopics();
    const index = topics.findIndex((t) => t.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    topics[index] = {
      ...topics[index],
      title: title !== undefined ? title.trim() : topics[index].title,
      category: category !== undefined ? category.trim() : topics[index].category,
      summary: summary !== undefined ? summary.trim() : topics[index].summary,
      content_html: content_html !== undefined ? content_html.trim() : topics[index].content_html,
      is_published: is_published !== undefined ? is_published : topics[index].is_published,
      updated_at: new Date().toISOString(),
    };

    writeTopics(topics);

    return NextResponse.json({ success: true, topic: topics[index] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update topic' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing topic ID' }, { status: 400 });
    }

    let topics = readTopics();
    const initialLen = topics.length;
    topics = topics.filter((t) => t.id !== id);

    if (topics.length === initialLen) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    writeTopics(topics);

    return NextResponse.json({ success: true, message: 'Topic deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete topic' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const REPORTS_FILE = path.join(process.cwd(), 'data', 'leipung_reports.json');
const POSTS_FILE = path.join(process.cwd(), 'data', 'leipung_posts.json');

function readReports(): any[] {
  try {
    if (!fs.existsSync(REPORTS_FILE)) return [];
    const raw = fs.readFileSync(REPORTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeReports(data: any[]) {
  const dir = path.dirname(REPORTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function readPosts(): any[] {
  try {
    if (!fs.existsSync(POSTS_FILE)) return [];
    const raw = fs.readFileSync(POSTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writePosts(data: any[]) {
  const dir = path.dirname(POSTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await request.json();
    const { reporterId, reporterName, reason, details, contentType = 'post' } = body;

    if (!postId || !reason) {
      return NextResponse.json(
        { error: 'Post ID and report reason are required' },
        { status: 400 }
      );
    }

    const reports = readReports();
    const newReport = {
      id: `report-${Date.now()}`,
      postId,
      contentType,
      reporterId: reporterId || 'anonymous-user',
      reporterName: reporterName || 'Anonymous Reporter',
      reason,
      details: details || '',
      status: 'PENDING_REVIEW', // PENDING_REVIEW, DISMISSED, ACTION_TAKEN
      created_at: new Date().toISOString(),
    };

    reports.unshift(newReport);
    writeReports(reports);

    // Increment report flag count on the post
    const posts = readPosts();
    const postIndex = posts.findIndex((p: any) => p.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].report_count = (posts[postIndex].report_count || 0) + 1;
      posts[postIndex].is_flagged = true;
      writePosts(posts);
    }

    return NextResponse.json({
      success: true,
      reportId: newReport.id,
      message: 'Report submitted. Our moderation team reviews flagged content within 24 hours.',
    });
  } catch (err: any) {
    console.error('Report submission error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to submit content report' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // In a production environment, this is where you would dispatch the payload
    // to your database, Tinybird, PostHog, or Plausible.
    console.log('[Analytics API] Logged page view:', data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}

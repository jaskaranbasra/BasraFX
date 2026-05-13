import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing id', { status: 400 });
  }

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY?.trim();
  if (!apiKey) {
    return new NextResponse('Missing API Key', { status: 500 });
  }

  // Pass along Range header for video streaming
  const range = request.headers.get('range');
  const headersInit: HeadersInit = {};
  if (range) {
    headersInit['Range'] = range;
  }

  const driveUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${apiKey}`;

  try {
    const res = await fetch(driveUrl, {
      headers: headersInit,
    });
    
    if (!res.ok) {
      console.error('Drive API error fetching media:', await res.text());
      return new NextResponse('Failed to fetch media', { status: res.status });
    }

    // Proxy the response
    const headers = new Headers();
    headers.set('Content-Type', res.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    // Support range requests natively
    if (res.headers.has('Content-Length')) {
        headers.set('Content-Length', res.headers.get('Content-Length') as string);
    }
    if (res.headers.has('Content-Range')) {
        headers.set('Content-Range', res.headers.get('Content-Range') as string);
    }
    headers.set('Accept-Ranges', 'bytes');

    return new NextResponse(res.body, {
      status: res.status,
      headers
    });
  } catch (error) {
    console.error('Error proxying media:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

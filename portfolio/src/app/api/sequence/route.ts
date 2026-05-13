import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const apiKey = process.env.GOOGLE_DRIVE_API_KEY?.trim();
const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim() || '1SzjZbX6qh54EUPCCAKgd4H6pkWbyH103';

async function findSequenceFolderId(): Promise<string | null> {
  if (!apiKey) return null;
  const q = `'${rootFolderId}' in parents and name='sequence' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&key=${apiKey}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
}

export async function GET() {
  if (!apiKey) {
    return NextResponse.json({ urls: [] }, { status: 500 });
  }

  try {
    const sequenceFolderId = await findSequenceFolderId();
    if (!sequenceFolderId) {
      return NextResponse.json({ urls: [] });
    }

    const q = `'${sequenceFolderId}' in parents and mimeType!='application/vnd.google-apps.folder' and trashed=false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&key=${apiKey}&pageSize=1000`;
    
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ urls: [] });
    }
    
    const data = await res.json();
    const files = data.files || [];
    
    // Sort files by name so they play in the correct order
    files.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));

    // Use robust proxy endpoint to prevent 403 rate-limits from Google APIs
    const urls = files.map((f: { id: string }) => `/api/media?id=${f.id}`);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Error fetching sequence:', error);
    return NextResponse.json({ urls: [] });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const apiKey = process.env.GOOGLE_DRIVE_API_KEY?.trim();
const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim() || '1SzjZbX6qh54EUPCCAKgd4H6pkWbyH103';

async function findFolderId(parentFolderId: string, folderName: string): Promise<string | null> {
  if (!apiKey) return null;
  const q = `'${parentFolderId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&key=${apiKey}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache Google Drive API calls for 1 hour
  if (!res.ok) {
    console.error(`Failed to find folder ${folderName}`, await res.text());
    return null;
  }
  const data = await res.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
}

async function listFilesInFolder(folderId: string, category: string) {
  if (!apiKey) return [];
  const q = `'${folderId}' in parents and mimeType!='application/vnd.google-apps.folder' and trashed=false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType)&key=${apiKey}&pageSize=50`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error(`Failed to list files in ${folderId}`, await res.text());
    return [];
  }
  const data = await res.json();
  
  return (data.files || []).map((file: { id: string; name: string; mimeType: string }) => {
    const isVideo = file.mimeType.startsWith('video/');
    return {
      id: file.id,
      title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
      category: category,
      src: `/api/media?id=${file.id}`,
      type: isVideo ? 'video' : 'image'
    };
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    if (!apiKey) {
      console.error("GOOGLE_DRIVE_API_KEY is not defined in environment variables.");
      return NextResponse.json({ error: 'Google Drive API Key is missing', files: [] }, { status: 500 });
    }

    // Traverse the path to find the correct subfolder ID
    const pathParts = category.split('/').filter(Boolean);
    let currentFolderId = rootFolderId;

    for (const part of pathParts) {
      const nextFolderId = await findFolderId(currentFolderId, part);
      if (!nextFolderId) {
        return NextResponse.json({ files: [] }); // Folder not found
      }
      currentFolderId = nextFolderId;
    }

    // List files in the target subfolder
    const fileItems = await listFilesInFolder(currentFolderId, category);

    return NextResponse.json({ files: fileItems });
  } catch (error) {
    console.error('Error reading from Google Drive:', error);
    return NextResponse.json({ error: 'Failed to read directory' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const publicDir = path.join(process.cwd(), 'public', category);
    
    // Check if directory exists
    if (!fs.existsSync(publicDir)) {
      return NextResponse.json({ files: [] });
    }

    // Read all files in directory
    const files = fs.readdirSync(publicDir);
    
    // Map to simple URLs
    const fileItems = files.map((fileName, index) => {
      const ext = path.extname(fileName).toLowerCase();
      const isVideo = ['.mp4', '.webm', '.mov'].includes(ext);
      
      return {
        id: `${category}-${index}`,
        title: fileName.replace(ext, '').replace(/[-_]/g, ' '),
        category: category,
        src: `/${encodeURIComponent(category).replace(/%20/g, '+')}/${encodeURIComponent(fileName)}`.replace(/\+/g, '%20'), // Simple spaces fix
        type: isVideo ? 'video' : 'image'
      };
    }).slice(0, 50); // Limit to 50 items per category as requested

    return NextResponse.json({ files: fileItems });
  } catch (error) {
    console.error('Error reading category folder:', error);
    return NextResponse.json({ error: 'Failed to read directory' }, { status: 500 });
  }
}

const apiKey = "AIzaSyDpct-ERxmRa1zWiUnlI008AQ68J4Ok7eM";
const rootFolderId = "1SzjZbX6qh54EUPCCAKgd4H6pkWbyH103";

async function run() {
  const q = `'${rootFolderId}' in parents and name='sequence'`;
  let url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&key=${apiKey}`;
  let res = await fetch(url);
  let data = await res.json();
  const sequenceFolderId = data.files[0].id;
  
  const q2 = `'${sequenceFolderId}' in parents and trashed=false`;
  url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q2)}&fields=files(name)&key=${apiKey}&pageSize=1000`;
  res = await fetch(url);
  data = await res.json();
  
  let files = data.files;
  console.log("Total files:", files.length);
  
  let localeSorted = [...files].sort((a, b) => a.name.localeCompare(b.name));
  console.log("localeCompare front:", localeSorted.slice(0, 5).map(f=>f.name));
  console.log("localeCompare back:", localeSorted.slice(-5).map(f=>f.name));
  
  let numericSorted = [...files].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  console.log("numeric front:", numericSorted.slice(0, 5).map(f=>f.name));
  console.log("numeric back:", numericSorted.slice(-5).map(f=>f.name));
}

run();

import imageCompression from "browser-image-compression";

export async function compressToDataUrl(file: File, maxWidth = 1800, quality = 0.82): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 1.4,
    maxWidthOrHeight: maxWidth,
    useWebWorker: true,
    initialQuality: quality,
    fileType: "image/jpeg",
  });
  return await imageCompression.getDataUrlFromFile(compressed);
}

export async function compressManyToDataUrls(files: File[]): Promise<string[]> {
  return Promise.all(Array.from(files).map((f) => compressToDataUrl(f)));
}
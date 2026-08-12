import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export function validateImage(file: File | null): string | null {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_IMAGE_BYTES) return "La imagen supera el limite de 8MB.";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Formato de imagen no soportado.";
  return null;
}

// En Vercel el sistema de archivos del servidor es de solo lectura, asi que
// los archivos subidos se guardan en Vercel Blob (almacenamiento en la nube).
// Sin BLOB_READ_WRITE_TOKEN (por ejemplo en desarrollo local) se guardan en
// disco, dentro de /public, para poder seguir probando sin configurar nada.
export async function saveImage(
  file: File,
  category: string,
  folder: string,
  defaultExt = ".jpg"
): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || defaultExt;
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${category}/${folder}/${filename}`, bytes, {
      access: "public",
      contentType: file.type || undefined,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads", category, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  return `/uploads/${category}/${folder}/${filename}`;
}

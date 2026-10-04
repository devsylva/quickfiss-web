const MAX_SIDE = 1600;
const SKIP_BELOW_BYTES = 300 * 1024;

/**
 * Make a picked file safe to upload from a phone.
 *
 * A File chosen from a phone's gallery or WhatsApp is only a pointer to the original on disk.
 * If that original is moved, deleted or still syncing, the browser aborts the upload with a bare
 * "Failed to fetch" before anything reaches the server. Reading the bytes into memory first avoids that,
 * and shrinking big photos also saves the user's mobile data.
 */
export async function prepareUpload(file: File): Promise<File> {
  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`We couldn't read "${file.name}". Please pick the photo again.`);
  }
  const copy = new File([bytes], file.name, { type: file.type, lastModified: file.lastModified });

  const isShrinkable = /^image\/(jpeg|png|webp)$/.test(file.type) && file.size > SKIP_BELOW_BYTES;
  if (!isShrinkable || typeof createImageBitmap === "undefined") return copy;

  try {
    const bitmap = await createImageBitmap(copy);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob || blob.size >= copy.size) return copy;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return copy; // anything odd about the image: send it untouched
  }
}

/** A copy of the form with every file made upload-safe. */
export async function prepareFormData(form: FormData): Promise<FormData> {
  const out = new FormData();
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") out.append(key, value);
    else out.append(key, await prepareUpload(value as File));
  }
  return out;
}

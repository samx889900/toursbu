import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// Create a single supabase client for server-side storage operations
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export type BucketName = "trip-covers" | "trip-gallery" | "brochures" | "booking-documents";

export interface UploadOptions {
  bucket: BucketName;
  path: string; // e.g. 'trip-id/filename.webp'
  contentType?: string;
  upsert?: boolean;
}

export class StorageService {
  /**
   * Process and upload an image file (cover or gallery).
   * Validates size, compresses, and converts to WebP.
   */
  static async uploadImage(
    file: File,
    bucket: "trip-covers" | "trip-gallery",
    tripId: string,
    options?: { isCover?: boolean; maxWidth?: number; quality?: number }
  ): Promise<string> {
    const { isCover = false, maxWidth = 1920, quality = 80 } = options || {};

    // 1. Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(`File size exceeds 5MB limit: ${file.size}`);
    }

    // 2. Validate it's actually an image
    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid file type. Only images are allowed.");
    }

    // 3. Process with Sharp
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const processedBuffer = await sharp(buffer)
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();

    // 4. Generate unique path
    const filename = isCover ? "cover.webp" : `${uuidv4()}.webp`;
    const path = `${tripId}/${filename}`;

    // 5. Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, processedBuffer, {
        contentType: "image/webp",
        upsert: true, // Allow overwriting covers
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // 6. Return public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrlData.publicUrl;
  }

  /**
   * Upload a PDF brochure.
   */
  static async uploadBrochure(file: File, tripId: string): Promise<string> {
    // 1. Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error("File size exceeds 10MB limit");
    }

    // 2. Validate it's a PDF
    if (file.type !== "application/pdf") {
      throw new Error("Invalid file type. Only PDFs are allowed for brochures.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const filename = "brochure.pdf";
    const path = `${tripId}/${filename}`;

    const { error } = await supabase.storage
      .from("brochures")
      .upload(path, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload brochure: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("brochures")
      .getPublicUrl(path);

    return publicUrlData.publicUrl;
  }

  /**
   * Upload a traveler document (Aadhaar, Passport, etc.) to a private bucket.
   * Only returns the storage path, since the bucket is private.
   */
  static async uploadTravelerDocument(file: File, tripId: string, travelerId: string): Promise<{ path: string, size: number, mimeType: string }> {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
    if (file.size > MAX_SIZE) {
      throw new Error(`File size exceeds 5MB limit: ${file.size}`);
    }

    const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only PDF, JPG, and PNG are allowed.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // File name like: tripId/travelerId/uuid-filename.ext
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const path = `${tripId}/${travelerId}/${filename}`;

    const { error } = await supabase.storage
      .from("booking-documents")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload document: ${error.message}`);
    }

    return {
      path,
      size: file.size,
      mimeType: file.type
    };
  }

  /**
   * Generates a signed URL for private bucket files.
   */
  static async getSignedUrl(bucket: BucketName, path: string, expiresIn: number = 300): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error("Failed to generate signed URL:", error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Delete a specific file from a bucket.
   * Useful when a user deletes a gallery image or brochure.
   */
  static async deleteFile(bucket: BucketName, path: string): Promise<void> {
    // If the path is a full URL, extract the relative path
    let relativePath = path;
    const searchString = `/storage/v1/object/public/${bucket}/`;
    
    if (path.includes(searchString)) {
      relativePath = path.split(searchString)[1];
    }

    if (!relativePath) return;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([relativePath]);

    if (error) {
      console.error("Failed to delete file from Supabase:", error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Deletes all files in a folder (used when a trip is hard-deleted, though we use soft deletes)
   */
  static async deleteFolder(bucket: BucketName, folderPath: string): Promise<void> {
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(folderPath);

    if (listError) {
      throw new Error(`Failed to list folder: ${listError.message}`);
    }

    if (!files || files.length === 0) return;

    const pathsToRemove = files.map(file => `${folderPath}/${file.name}`);
    
    const { error: removeError } = await supabase.storage
      .from(bucket)
      .remove(pathsToRemove);

    if (removeError) {
      throw new Error(`Failed to delete folder contents: ${removeError.message}`);
    }
  }
}

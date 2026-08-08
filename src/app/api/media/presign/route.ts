import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { validateUploadRequest, buildObjectKey } from "@/lib/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Presigned URL lifetime — 5 minutes (spec §2). */
const PRESIGN_TTL_SECONDS = 300;

export async function POST(request: Request) {
  // Admin-only. Same session gate the /manage surfaces use.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { filename?: string; contentType?: string; size?: number; workSlug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { filename = "", contentType = "", size = 0, workSlug = "untitled" } = body;
  const check = validateUploadRequest({ filename, contentType, size });
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const key = buildObjectKey(workSlug, filename);

  // Read via process.env rather than the typed `Resource` accessor from
  // "sst" — that binding only exists in sst-env.d.ts after a real `sst
  // deploy` regenerates it, which would make typecheck/build depend on
  // deploy state. MEDIA_BUCKET_NAME is set on the Web component's
  // `environment` block in sst.config.ts (media.name), so it's always
  // present once deployed; fail loudly rather than silently building a
  // broken presigned URL against an empty bucket name.
  const bucket = process.env.MEDIA_BUCKET_NAME;
  if (!bucket) {
    return NextResponse.json(
      { error: "Server misconfiguration: MEDIA_BUCKET_NAME is not set." },
      { status: 500 }
    );
  }

  const client = new S3Client({});

  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: PRESIGN_TTL_SECONDS }
  );

  const host = process.env.NEXT_PUBLIC_MEDIA_HOST ?? `${bucket}.s3.amazonaws.com`;
  return NextResponse.json({ uploadUrl, publicUrl: `https://${host}/${key}`, key });
}

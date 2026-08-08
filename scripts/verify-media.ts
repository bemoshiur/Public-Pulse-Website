import assert from "node:assert/strict";
import {
  MEDIA_MAX_BYTES,
  MEDIA_ALLOWED_MIME,
  validateUploadRequest,
  buildObjectKey,
  workMediaSchema,
} from "../src/lib/media";

assert.equal(MEDIA_MAX_BYTES, 8 * 1024 * 1024, "max upload must be 8 MB");
assert.deepEqual([...MEDIA_ALLOWED_MIME].sort(), [
  "image/avif", "image/jpeg", "image/png", "image/webp",
]);

// rejects oversize
let r = validateUploadRequest({ contentType: "image/png", size: MEDIA_MAX_BYTES + 1, filename: "a.png" });
assert.equal(r.ok, false);
assert.match(r.ok === false ? r.error : "", /8 MB/);

// rejects disallowed mime
r = validateUploadRequest({ contentType: "image/gif", size: 100, filename: "a.gif" });
assert.equal(r.ok, false);

// rejects empty
r = validateUploadRequest({ contentType: "image/png", size: 0, filename: "a.png" });
assert.equal(r.ok, false);

// accepts valid
r = validateUploadRequest({ contentType: "image/webp", size: 1024, filename: "a.webp" });
assert.equal(r.ok, true);

// object key: namespaced, uuid'd, extension preserved, traversal-safe
const key = buildObjectKey("cox-resort", "My Photo (1).PNG");
assert.match(key, /^works\/cox-resort\/[0-9a-f-]{36}\.png$/, `bad key: ${key}`);
assert.ok(!buildObjectKey("../../etc", "x.png").includes(".."), "must not allow traversal");

// zod schema requires dimensions on images
assert.equal(workMediaSchema.safeParse({
  kind: "image", url: "https://x/y.png", alt: "a", role: "hero",
}).success, false, "image without width/height must fail");
assert.equal(workMediaSchema.safeParse({
  kind: "image", url: "https://x/y.png", alt: "a", role: "hero", width: 1200, height: 630,
}).success, true);

console.log("✓ media validators OK");

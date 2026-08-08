import assert from "node:assert/strict";
import { DISCIPLINES, getDiscipline, isDisciplineSlug } from "../src/lib/taxonomies/disciplines";

assert.ok(DISCIPLINES.length >= 6, "expected at least 6 disciplines");
const slugs = DISCIPLINES.map((d) => d.slug);
assert.equal(new Set(slugs).size, slugs.length, "discipline slugs must be unique");
for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/, `slug not kebab-case: ${s}`);
assert.equal(getDiscipline("branding")?.name, "Branding");
assert.equal(getDiscipline("nope"), undefined);
assert.equal(isDisciplineSlug("film"), true);
assert.equal(isDisciplineSlug("nope"), false);
console.log("✓ disciplines catalog OK");

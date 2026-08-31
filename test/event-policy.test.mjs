import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { validateGameEvent } from "../src/event-policy.mjs";

test("daily export fixture conforms to the controlled event vocabulary", async () => {
  const rows = (await readFile(new URL("../fixtures/events.ndjson", import.meta.url), "utf8"))
    .trim().split("\n").map(JSON.parse);
  assert.equal(rows.length, 2);
  for (const event of rows) assert.deepEqual(validateGameEvent(event), []);
});

test("unknown and sensitive free-form properties are rejected", () => {
  const errors = validateGameEvent({
    eventId: "event-bad",
    schemaVersion: 1,
    sessionId: "s",
    occurredAt: "2026-08-31T00:00:00Z",
    eventName: "login_completed",
    properties: { email: "private@example.invalid" },
  });
  assert.deepEqual(errors, ["properties.email"]);
});

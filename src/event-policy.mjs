export const CONTROLLED_EVENT_NAMES = Object.freeze([
  "login_started",
  "login_completed",
  "load_started",
  "load_completed",
  "pack_opened",
  "deck_saved",
  "match_started",
  "match_ended",
  "connection_lost",
  "client_error",
  "performance_sample",
]);

export const CONTROLLED_PROPERTIES = Object.freeze({
  login_started: ["provider"],
  login_completed: ["provider", "durationMs", "result"],
  load_started: ["surface", "bundle"],
  load_completed: ["surface", "bundle", "durationMs", "bytes"],
  pack_opened: ["packType", "count"],
  deck_saved: ["format", "cardCount", "valid"],
  match_started: ["mode", "format", "transport"],
  match_ended: ["mode", "format", "result", "durationMs", "disconnects"],
  connection_lost: ["transport", "reason", "resumeSucceeded", "durationMs"],
  client_error: ["code", "surface", "fatal"],
  performance_sample: ["surface", "fps", "memoryBytes", "frameP95Ms"],
});

export function validateGameEvent(event) {
  const errors = [];
  if (typeof event?.eventId !== "string" || event.eventId.length < 8) errors.push("eventId");
  if (!Number.isInteger(event?.schemaVersion) || event.schemaVersion < 1) errors.push("schemaVersion");
  if (typeof event?.sessionId !== "string" || event.sessionId.length === 0) errors.push("sessionId");
  if (!Number.isFinite(Date.parse(event?.occurredAt ?? ""))) errors.push("occurredAt");
  if (!CONTROLLED_EVENT_NAMES.includes(event?.eventName)) errors.push("eventName");
  if (!event?.properties || Array.isArray(event.properties) || typeof event.properties !== "object") {
    errors.push("properties");
  } else {
    const allowed = new Set(CONTROLLED_PROPERTIES[event.eventName] ?? []);
    for (const key of Object.keys(event.properties)) {
      if (!allowed.has(key)) errors.push(`properties.${key}`);
    }
  }
  return errors;
}

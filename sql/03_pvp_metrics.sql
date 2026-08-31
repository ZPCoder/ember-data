SELECT
  DATE(occurred_at) AS event_date,
  json_extract(properties_json, '$.format') AS format,
  json_extract(properties_json, '$.result') AS result,
  COUNT(*) AS matches,
  ROUND(AVG(CAST(json_extract(properties_json, '$.durationMs') AS REAL)) / 1000.0, 1) AS average_seconds,
  SUM(CAST(COALESCE(json_extract(properties_json, '$.disconnects'), 0) AS INTEGER)) AS disconnects
FROM game_events
WHERE event_name = 'match_ended' AND json_extract(properties_json, '$.mode') = 'pvp'
GROUP BY event_date, format, result
ORDER BY event_date DESC, format, result;

SELECT
  DATE(occurred_at) AS event_date,
  client_build,
  SUM(CASE WHEN event_name = 'client_error' AND json_extract(properties_json, '$.fatal') = 1 THEN 1 ELSE 0 END) AS crashes,
  ROUND(AVG(CASE WHEN event_name = 'performance_sample' THEN CAST(json_extract(properties_json, '$.fps') AS REAL) END), 1) AS average_fps,
  MAX(CASE WHEN event_name = 'performance_sample' THEN CAST(json_extract(properties_json, '$.memoryBytes') AS INTEGER) END) AS peak_memory_bytes
FROM game_events
GROUP BY event_date, client_build
ORDER BY event_date DESC, client_build;

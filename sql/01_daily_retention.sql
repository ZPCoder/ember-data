WITH first_seen AS (
  SELECT player_id, DATE(MIN(occurred_at)) AS cohort_date
  FROM game_events
  WHERE player_id IS NOT NULL AND event_name = 'login_completed'
  GROUP BY player_id
), activity AS (
  SELECT DISTINCT player_id, DATE(occurred_at) AS activity_date
  FROM game_events
  WHERE player_id IS NOT NULL AND event_name = 'login_completed'
)
SELECT
  cohort_date,
  COUNT(*) AS cohort_players,
  SUM(CASE WHEN activity_date = DATE(cohort_date, '+1 day') THEN 1 ELSE 0 END) AS day_1_players,
  ROUND(1.0 * SUM(CASE WHEN activity_date = DATE(cohort_date, '+1 day') THEN 1 ELSE 0 END) / COUNT(*), 4) AS day_1_retention
FROM first_seen
LEFT JOIN activity USING (player_id)
GROUP BY cohort_date
ORDER BY cohort_date DESC;

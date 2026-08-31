SELECT
  DATE(occurred_at) AS event_date,
  COUNT(DISTINCT CASE WHEN event_name = 'login_completed' THEN player_id END) AS logged_in,
  COUNT(DISTINCT CASE WHEN event_name = 'deck_saved' THEN player_id END) AS saved_deck,
  COUNT(DISTINCT CASE WHEN event_name = 'match_started' THEN player_id END) AS started_match,
  COUNT(DISTINCT CASE WHEN event_name = 'match_ended' THEN player_id END) AS ended_match
FROM game_events
GROUP BY event_date
ORDER BY event_date DESC;

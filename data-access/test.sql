WITH filtered_clicks AS (
  SELECT
    ce.source AS source,
    ce.city AS city,
    ce.country AS country,
    ce.continent AS continent,
    user_links.short_url AS short_url,
    user_links.original_url AS original_url,
    ce.created_at AS created_at
  FROM click_events AS ce
  JOIN (
    SELECT *
    FROM links
    WHERE user_id = 'S7wejlkei6tYdFjovfZPMc4cSBU3m2Zq'
  ) AS user_links ON user_links.id = ce.link_id
  -- WHERE ce.created_at >= '2025-03-18T00:00:00.000Z' AND ce.created_at <= '2025-03-25T23:58:23.178Z'
)

SELECT
  date_trunc('day', created_at) AS day,
  SUM(
    CASE
      WHEN source = 'qr' THEN 1
      ELSE 0
    END
  ) AS qrCount,
  SUM(
    CASE
      WHEN source = 'link' THEN 1
      ELSE 0
    END
  ) AS linkCount
FROM filtered_clicks
GROUP BY day;

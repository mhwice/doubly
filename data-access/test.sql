WITH filtered_clicks AS (
  SELECT *
  FROM click_events AS ce
  JOIN (
    SELECT *
    FROM links
    WHERE user_id = $1
  ) AS user_links ON user_links.id = ce.link_id
  WHERE source IN ('qr') AND country IN ('CA', 'RO')
)

	-- ('NOV-20-1980 1:23 AM PST'::TIME WITH TIME STAMP)
WHERE created_at >= startDate AND created_at <= endDate

SELECT 'source' AS field, source::TEXT AS value, COUNT(*) AS count
FROM filtered_clicks
GROUP BY source

UNION ALL

SELECT 'country' AS field, country::TEXT AS value, COUNT(*)
FROM filtered_clicks
GROUP BY country

UNION ALL

SELECT 'continent' AS field, continent::TEXT AS value, COUNT(*)
FROM filtered_clicks
GROUP BY continent

UNION ALL

SELECT 'city' AS field, city::TEXT AS value, COUNT(*)
FROM filtered_clicks
GROUP BY city

UNION ALL

SELECT 'short_url' AS field, short_url::TEXT AS value, COUNT(*)
FROM filtered_clicks
GROUP BY short_url

UNION ALL

SELECT 'original_url' AS field, original_url::TEXT AS value, COUNT(*)
FROM filtered_clicks
GROUP BY original_url;

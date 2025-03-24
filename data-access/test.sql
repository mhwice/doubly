WITH user_links AS (
  SELECT *
  FROM links
  WHERE user_id = 'S7wejlkei6tYdFjovfZPMc4cSBU3m2Zq'
), your_table AS (
  SELECT *
  FROM click_events AS ce
  JOIN user_links ON user_links.id = ce.link_id
)

SELECT 'source' AS field, source::TEXT AS value, COUNT(*) AS count FROM your_table GROUP BY source
UNION ALL
SELECT 'country' AS field, country::TEXT AS value, COUNT(*) FROM your_table GROUP BY country
UNION ALL
SELECT 'continent' AS field, continent::TEXT AS value, COUNT(*) FROM your_table GROUP BY continent
UNION ALL
SELECT 'city' AS field, city::TEXT AS value, COUNT(*) FROM your_table GROUP BY city
UNION ALL
SELECT 'short_url' AS field, short_url::TEXT AS value, COUNT(*) FROM your_table GROUP BY short_url
UNION ALL
SELECT 'original_url' AS field, original_url::TEXT AS value, COUNT(*) FROM your_table GROUP BY original_url;




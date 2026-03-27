UPDATE domains
SET
  title = CASE
    WHEN LOWER(title) LIKE '%mobile%' OR LOWER(title) LIKE '%app%' THEN 'App Development'
    WHEN LOWER(title) LIKE '%uav%' OR LOWER(title) LIKE '%robot%' THEN 'UAV and Robotics'
    WHEN LOWER(title) LIKE '%ai%' OR LOWER(title) LIKE '%ml%' THEN 'AI and ML'
    WHEN LOWER(title) LIKE '%iot%' OR LOWER(title) LIKE '%embedded%' THEN 'IoT and Embedded'
    ELSE title
  END,
  tools = CASE
    WHEN LOWER(title) LIKE '%mobile%' OR LOWER(title) LIKE '%app%' THEN ARRAY['Flutter', 'React Native']
    ELSE tools
  END,
  order_index = CASE
    WHEN LOWER(title) LIKE '%web%' THEN 0
    WHEN LOWER(title) LIKE '%mobile%' OR LOWER(title) LIKE '%app%' THEN 1
    WHEN LOWER(title) LIKE '%uav%' OR LOWER(title) LIKE '%robot%' THEN 2
    WHEN LOWER(title) LIKE '%ai%' OR LOWER(title) LIKE '%ml%' THEN 3
    WHEN LOWER(title) LIKE '%iot%' OR LOWER(title) LIKE '%embedded%' THEN 4
    ELSE order_index
  END;

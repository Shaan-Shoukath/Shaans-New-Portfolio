UPDATE about
SET
  name = 'Shaan Shoukath',
  tagline = 'Engineering Anything.',
  quote = 'Adaptive by default: turning unfamiliar, messy real-world problems into production systems.'
WHERE
  name IN ('Your Name', 'Shaan Shoukath')
  OR tagline IN ('Full-Stack Developer & Innovator', 'Building cool stuff.', 'Engineering Anything.');

UPDATE domains
SET description = 'Adaptive by default: turning unfamiliar, messy real-world problems into production systems across web, mobile, AI, robotics, IoT, and infrastructure.'
WHERE LOWER(title) = 'web development';

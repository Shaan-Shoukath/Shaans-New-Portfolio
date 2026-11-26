-- 008: portfolio revamp content (generated from src/content/site.ts).
-- Non-destructive: old rows are unpublished, never deleted. Safe to re-run.

ALTER TABLE experiences ADD COLUMN IF NOT EXISTS location TEXT;

-- Experiences --------------------------------------------------------------
UPDATE experiences SET published = false;

UPDATE experiences SET description = 'I build and run the backends for Lascade''s travel products: the fare scraper and services behind Flight Dada, the eSIM platform and wallet behind the Simline, SignalSide and eSIM70 stores, and the routing algorithm for the Mixroutes multimodal trip planner. I also work on the shared email and push service, the SEO backend, and the eSIM bots on Telegram and WhatsApp.', location = 'Remote', type = 'professional', start_date = 'May 2026', end_date = NULL, tags = ARRAY['Backend', 'eSIM', 'Travel', 'APIs', 'Bots']::text[], order_index = 0, published = true WHERE lower(company) = lower('Lascade') AND lower(title) = lower('Backend Engineer');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Backend Engineer', 'Lascade', 'Remote', 'I build and run the backends for Lascade''s travel products: the fare scraper and services behind Flight Dada, the eSIM platform and wallet behind the Simline, SignalSide and eSIM70 stores, and the routing algorithm for the Mixroutes multimodal trip planner. I also work on the shared email and push service, the SEO backend, and the eSIM bots on Telegram and WhatsApp.', 'professional', 'May 2026', NULL, ARRAY['Backend', 'eSIM', 'Travel', 'APIs', 'Bots']::text[], 0, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('Lascade') AND lower(title) = lower('Backend Engineer'));

UPDATE experiences SET description = 'I design the LNO360 platform, which handles billing, recharges, dues, complaints and field collection for cable TV and broadband operators across Kerala. I also built the LNO Connection collector app, OLT network monitoring, and the migration archive for operators'' old records.', location = 'Kochi, Kerala', type = 'professional', start_date = 'Feb 2026', end_date = NULL, tags = ARRAY['System Design', 'Billing', 'ISP', 'Android', 'Django']::text[], order_index = 1, published = true WHERE lower(company) = lower('LNO Technologies') AND lower(title) = lower('Solution Architect');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Solution Architect', 'LNO Technologies', 'Kochi, Kerala', 'I design the LNO360 platform, which handles billing, recharges, dues, complaints and field collection for cable TV and broadband operators across Kerala. I also built the LNO Connection collector app, OLT network monitoring, and the migration archive for operators'' old records.', 'professional', 'Feb 2026', NULL, ARRAY['System Design', 'Billing', 'ISP', 'Android', 'Django']::text[], 1, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('LNO Technologies') AND lower(title) = lower('Solution Architect'));

UPDATE experiences SET description = 'Built responsive UIs with React and Tailwind CSS, integrated REST APIs and managed version control with Git.', location = NULL, type = 'professional', start_date = 'May 2024', end_date = 'Jun 2024', tags = ARRAY['React', 'Tailwind CSS', 'REST API', 'Git']::text[], order_index = 2, published = true WHERE lower(company) = lower('Oxpel India Technologies') AND lower(title) = lower('Front-End Developer Intern');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Front-End Developer Intern', 'Oxpel India Technologies', NULL, 'Built responsive UIs with React and Tailwind CSS, integrated REST APIs and managed version control with Git.', 'professional', 'May 2024', 'Jun 2024', ARRAY['React', 'Tailwind CSS', 'REST API', 'Git']::text[], 2, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('Oxpel India Technologies') AND lower(title) = lower('Front-End Developer Intern'));

UPDATE experiences SET description = 'Studied HVAC, electrical distribution and plumbing schematics, with exposure to load estimation and safety standards.', location = NULL, type = 'professional', start_date = 'May 2025', end_date = 'Jun 2025', tags = ARRAY['HVAC', 'Electrical', 'MEP Systems']::text[], order_index = 3, published = true WHERE lower(company) = lower('Voltech Group') AND lower(title) = lower('Student Intern, MEP Systems');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Student Intern, MEP Systems', 'Voltech Group', NULL, 'Studied HVAC, electrical distribution and plumbing schematics, with exposure to load estimation and safety standards.', 'professional', 'May 2025', 'Jun 2025', ARRAY['HVAC', 'Electrical', 'MEP Systems']::text[], 3, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('Voltech Group') AND lower(title) = lower('Student Intern, MEP Systems'));

UPDATE experiences SET description = 'Core organizer of Kerala''s first Maker Faire (5–6 February 2027), run by communities with TinkerHub Foundation, MakerGram and Kerala Startup Mission. I built and run makerfaire.in, lead tech curation of the makers and projects on show, and run the Faire''s social media.', location = 'Kochi, Kerala', type = 'social', start_date = '2026', end_date = NULL, tags = ARRAY['Tech Curation', 'Social Media', 'makerfaire.in', 'Event Organizing']::text[], order_index = 5, published = true WHERE lower(company) = lower('Maker Faire Kochi') AND lower(title) = lower('Core Organizer');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Core Organizer', 'Maker Faire Kochi', 'Kochi, Kerala', 'Core organizer of Kerala''s first Maker Faire (5–6 February 2027), run by communities with TinkerHub Foundation, MakerGram and Kerala Startup Mission. I built and run makerfaire.in, lead tech curation of the makers and projects on show, and run the Faire''s social media.', 'social', '2026', NULL, ARRAY['Tech Curation', 'Social Media', 'makerfaire.in', 'Event Organizing']::text[], 5, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('Maker Faire Kochi') AND lower(title) = lower('Core Organizer'));

UPDATE experiences SET description = 'I run the hardware at TinkerSpace, mentor student builds, and designed how the community flows: membership, lending and project support. I also built SpaceWorks, the open-source makerspace system TinkerSpace uses for inventory and lending. I started as a volunteer and taught a Flutter workshop to 100+ students.', location = 'TinkerSpace, Kochi', type = 'social', start_date = 'May 2025', end_date = NULL, tags = ARRAY['Hardware Operations', 'Inventory Management', 'Makerspace', 'Mentoring', 'Community Design', 'SpaceWorks', 'Electronics', 'Flutter Workshop']::text[], order_index = 4, published = true WHERE lower(company) = lower('TinkerHub') AND lower(title) = lower('Hardware Manager & Mentor');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Hardware Manager & Mentor', 'TinkerHub', 'TinkerSpace, Kochi', 'I run the hardware at TinkerSpace, mentor student builds, and designed how the community flows: membership, lending and project support. I also built SpaceWorks, the open-source makerspace system TinkerSpace uses for inventory and lending. I started as a volunteer and taught a Flutter workshop to 100+ students.', 'social', 'May 2025', NULL, ARRAY['Hardware Operations', 'Inventory Management', 'Makerspace', 'Mentoring', 'Community Design', 'SpaceWorks', 'Electronics', 'Flutter Workshop']::text[], 4, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('TinkerHub') AND lower(title) = lower('Hardware Manager & Mentor'));

UPDATE experiences SET description = 'Organized the Physical AI Hackathon with MakerGram, TinkerHub and Google. Ran the inventory of hundreds of components across teams under pressure, and mentored teams on hardware integration and debugging until they had working prototypes.', location = 'TinkerSpace, Kochi', type = 'social', start_date = 'Apr 2026', end_date = 'Apr 2026', tags = ARRAY['Hackathon', 'Inventory', 'Mentoring']::text[], order_index = 6, published = true WHERE lower(company) = lower('Physical AI Hackathon 2026') AND lower(title) = lower('Organizer, Mentor & Inventory Lead');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Organizer, Mentor & Inventory Lead', 'Physical AI Hackathon 2026', 'TinkerSpace, Kochi', 'Organized the Physical AI Hackathon with MakerGram, TinkerHub and Google. Ran the inventory of hundreds of components across teams under pressure, and mentored teams on hardware integration and debugging until they had working prototypes.', 'social', 'Apr 2026', 'Apr 2026', ARRAY['Hackathon', 'Inventory', 'Mentoring']::text[], 6, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('Physical AI Hackathon 2026') AND lower(title) = lower('Organizer, Mentor & Inventory Lead'));

UPDATE experiences SET description = 'Organized and spoke at Arduino Day 2026. Arduino donated an Arduino Uno Q to the community for hosting it.', location = 'Kochi, Kerala', type = 'social', start_date = 'Mar 2026', end_date = 'Mar 2026', tags = ARRAY['Arduino', 'Public Speaking', 'Organizing']::text[], order_index = 7, published = true WHERE lower(company) = lower('TinkerSpace') AND lower(title) = lower('Organizer & Speaker, Arduino Day 2026');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Organizer & Speaker, Arduino Day 2026', 'TinkerSpace', 'Kochi, Kerala', 'Organized and spoke at Arduino Day 2026. Arduino donated an Arduino Uno Q to the community for hosting it.', 'social', 'Mar 2026', 'Mar 2026', ARRAY['Arduino', 'Public Speaking', 'Organizing']::text[], 7, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('TinkerSpace') AND lower(title) = lower('Organizer & Speaker, Arduino Day 2026'));

UPDATE experiences SET description = 'Led tech for the Electrical and Electronics Students Association and built the EESA CUSAT website with Next.js and Django.', location = 'CUSAT, Kochi', type = 'social', start_date = 'Jul 2025', end_date = 'Oct 2026', tags = ARRAY['Next.js', 'Django', 'Leadership']::text[], order_index = 8, published = true WHERE lower(company) = lower('EESA CUSAT') AND lower(title) = lower('Tech Associate Head');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Tech Associate Head', 'EESA CUSAT', 'CUSAT, Kochi', 'Led tech for the Electrical and Electronics Students Association and built the EESA CUSAT website with Next.js and Django.', 'social', 'Jul 2025', 'Oct 2026', ARRAY['Next.js', 'Django', 'Leadership']::text[], 8, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('EESA CUSAT') AND lower(title) = lower('Tech Associate Head'));

UPDATE experiences SET description = 'Built the ID card generation backend with Node.js and MongoDB, and worked on MERN-stack projects and event infrastructure.', location = 'CUSAT, Kochi', type = 'social', start_date = 'Jan 2025', end_date = 'Oct 2026', tags = ARRAY['Node.js', 'MongoDB', 'MERN']::text[], order_index = 9, published = true WHERE lower(company) = lower('SEDS CUSAT') AND lower(title) = lower('Tech Team Member');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Tech Team Member', 'SEDS CUSAT', 'CUSAT, Kochi', 'Built the ID card generation backend with Node.js and MongoDB, and worked on MERN-stack projects and event infrastructure.', 'social', 'Jan 2025', 'Oct 2026', ARRAY['Node.js', 'MongoDB', 'MERN']::text[], 9, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('SEDS CUSAT') AND lower(title) = lower('Tech Team Member'));

UPDATE experiences SET description = 'Organized and spoke at Raspberry Pi Jam Kochi 2025. The community received a Raspberry Pi 5 (16GB) and a year of The MagPi for hosting it.', location = 'Kochi, Kerala', type = 'social', start_date = 'Feb 2025', end_date = 'Feb 2025', tags = ARRAY['Raspberry Pi', 'Public Speaking', 'Organizing']::text[], order_index = 10, published = true WHERE lower(company) = lower('TinkerSpace') AND lower(title) = lower('Organizer & Speaker, Raspberry Pi Jam 2025');
INSERT INTO experiences (title, company, location, description, type, start_date, end_date, tags, order_index, published)
SELECT 'Organizer & Speaker, Raspberry Pi Jam 2025', 'TinkerSpace', 'Kochi, Kerala', 'Organized and spoke at Raspberry Pi Jam Kochi 2025. The community received a Raspberry Pi 5 (16GB) and a year of The MagPi for hosting it.', 'social', 'Feb 2025', 'Feb 2025', ARRAY['Raspberry Pi', 'Public Speaking', 'Organizing']::text[], 10, true
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE lower(company) = lower('TinkerSpace') AND lower(title) = lower('Organizer & Speaker, Raspberry Pi Jam 2025'));

-- Projects -----------------------------------------------------------------
UPDATE projects SET published = false;

UPDATE projects SET description = 'Open-source, self-hosted makerspace manager that started at TinkerSpace: a public catalog, QR tool lending with photo handovers, 3D-print requests, events and an audit trail, with native Android and iOS apps. One install can host many makerspaces.', tech_stack = ARRAY['Django', 'React', 'Celery', 'Kotlin', 'SwiftUI']::text[], github_url = 'https://github.com/SpaceWorks-Labs/SpaceWorks', live_url = 'https://spaceworks-labs.github.io/SpaceWorks-Labs-Website/', featured = true, order_index = 0, published = true WHERE lower(title) = lower('SpaceWorks');
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, order_index, published)
SELECT 'SpaceWorks', 'Open-source, self-hosted makerspace manager that started at TinkerSpace: a public catalog, QR tool lending with photo handovers, 3D-print requests, events and an audit trail, with native Android and iOS apps. One install can host many makerspaces.', ARRAY['Django', 'React', 'Celery', 'Kotlin', 'SwiftUI']::text[], 'https://github.com/SpaceWorks-Labs/SpaceWorks', 'https://spaceworks-labs.github.io/SpaceWorks-Labs-Website/', true, 0, true
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE lower(title) = lower('SpaceWorks'));

UPDATE projects SET description = 'The website for Maker Faire Kochi, Kerala''s first Maker Faire (5–6 February 2027). One scrolling page told in chapters, each with an interactive three.js drawing, plus the maker interest and volunteer forms.', tech_stack = ARRAY['Nuxt', 'three.js', 'TypeScript']::text[], github_url = NULL, live_url = 'https://makerfaire.in', featured = true, order_index = 1, published = true WHERE lower(title) = lower('makerfaire.in');
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, order_index, published)
SELECT 'makerfaire.in', 'The website for Maker Faire Kochi, Kerala''s first Maker Faire (5–6 February 2027). One scrolling page told in chapters, each with an interactive three.js drawing, plus the maker interest and volunteer forms.', ARRAY['Nuxt', 'three.js', 'TypeScript']::text[], NULL, 'https://makerfaire.in', true, 1, true
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE lower(title) = lower('makerfaire.in'));

UPDATE projects SET description = 'Two autonomous drones on ROS 2 and ArduPilot: one flies a KML-planned survey and finds diseased patches with OpenCV, the other flies to each geotag and sprays it. Geotags travel over the existing MAVLink telemetry radios, and the whole loop is tested in SITL.', tech_stack = ARRAY['ROS 2', 'ArduPilot', 'MAVROS', 'OpenCV', 'Python', 'Raspberry Pi']::text[], github_url = 'https://github.com/Shaan-Shoukath/Arkairo', live_url = NULL, featured = true, order_index = 2, published = true WHERE lower(title) = lower('Arkairo');
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, order_index, published)
SELECT 'Arkairo', 'Two autonomous drones on ROS 2 and ArduPilot: one flies a KML-planned survey and finds diseased patches with OpenCV, the other flies to each geotag and sprays it. Geotags travel over the existing MAVLink telemetry radios, and the whole loop is tested in SITL.', ARRAY['ROS 2', 'ArduPilot', 'MAVROS', 'OpenCV', 'Python', 'Raspberry Pi']::text[], 'https://github.com/Shaan-Shoukath/Arkairo', NULL, true, 2, true
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE lower(title) = lower('Arkairo'));

UPDATE projects SET description = 'A local-first music player for Android 13+ and Wear OS, with a tag editor that writes into the file, MusicBrainz autofill and listening stats. Co-owned and built with Abhiram NJ under Kunj Company; I added streaming sources so you can listen for free.', tech_stack = ARRAY['Kotlin', 'Jetpack Compose', 'Wear OS']::text[], github_url = 'https://github.com/Kunj-Company/LMusic-player', live_url = 'https://github.com/twilighty-abhi/LMusic-player/releases/latest', featured = true, order_index = 3, published = true WHERE lower(title) = lower('LMusic');
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, order_index, published)
SELECT 'LMusic', 'A local-first music player for Android 13+ and Wear OS, with a tag editor that writes into the file, MusicBrainz autofill and listening stats. Co-owned and built with Abhiram NJ under Kunj Company; I added streaming sources so you can listen for free.', ARRAY['Kotlin', 'Jetpack Compose', 'Wear OS']::text[], 'https://github.com/Kunj-Company/LMusic-player', 'https://github.com/twilighty-abhi/LMusic-player/releases/latest', true, 3, true
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE lower(title) = lower('LMusic'));

UPDATE projects SET description = 'Self-hosted internal workspace for maker organisations: projects and kanban, chat, docs, finance, monitoring and an AI assistant that works with the user''s own permissions.', tech_stack = ARRAY['Next.js', 'Prisma', 'PostgreSQL', 'MCP']::text[], github_url = 'https://github.com/SpaceWorks-Labs/SpaceWorks-Workspace', live_url = NULL, featured = false, order_index = 5, published = true WHERE lower(title) = lower('SpaceWorks Workspace');
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, order_index, published)
SELECT 'SpaceWorks Workspace', 'Self-hosted internal workspace for maker organisations: projects and kanban, chat, docs, finance, monitoring and an AI assistant that works with the user''s own permissions.', ARRAY['Next.js', 'Prisma', 'PostgreSQL', 'MCP']::text[], 'https://github.com/SpaceWorks-Labs/SpaceWorks-Workspace', NULL, false, 5, true
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE lower(title) = lower('SpaceWorks Workspace'));

UPDATE projects SET description = 'Self-hosted event platform for makerspaces and communities: registration, live QR tickets, offline check-in, ID cards and badges. Built with Abhiram NJ.', tech_stack = ARRAY['Next.js', 'Prisma', 'PostgreSQL']::text[], github_url = 'https://github.com/SpaceWorks-Labs/SpaceWorks-Events', live_url = NULL, featured = false, order_index = 6, published = true WHERE lower(title) = lower('SpaceWorks Events');
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, order_index, published)
SELECT 'SpaceWorks Events', 'Self-hosted event platform for makerspaces and communities: registration, live QR tickets, offline check-in, ID cards and badges. Built with Abhiram NJ.', ARRAY['Next.js', 'Prisma', 'PostgreSQL']::text[], 'https://github.com/SpaceWorks-Labs/SpaceWorks-Events', NULL, false, 6, true
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE lower(title) = lower('SpaceWorks Events'));

UPDATE projects SET description = 'Inventory, Machines, Bookings and Organization, each split out of SpaceWorks as its own open-source, multi-space app for stock rooms, machine queues, room booking and memberships.', tech_stack = ARRAY['Next.js', 'Prisma', 'PostgreSQL']::text[], github_url = 'https://github.com/SpaceWorks-Labs', live_url = NULL, featured = false, order_index = 7, published = true WHERE lower(title) = lower('SpaceWorks standalone apps');
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, order_index, published)
SELECT 'SpaceWorks standalone apps', 'Inventory, Machines, Bookings and Organization, each split out of SpaceWorks as its own open-source, multi-space app for stock rooms, machine queues, room booking and memberships.', ARRAY['Next.js', 'Prisma', 'PostgreSQL']::text[], 'https://github.com/SpaceWorks-Labs', NULL, false, 7, true
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE lower(title) = lower('SpaceWorks standalone apps'));

UPDATE projects SET description = 'A React inventory and lending tracker for makerspaces, an early step toward SpaceWorks.', tech_stack = ARRAY['React', 'TypeScript', 'Vite']::text[], github_url = 'https://github.com/Shaan-Shoukath/Makerspace-Inventory-Hub', live_url = 'https://makerspace-inventory-hub.vercel.app', featured = false, order_index = 9, published = true WHERE lower(title) = lower('Makerspace Inventory Hub');
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, order_index, published)
SELECT 'Makerspace Inventory Hub', 'A React inventory and lending tracker for makerspaces, an early step toward SpaceWorks.', ARRAY['React', 'TypeScript', 'Vite']::text[], 'https://github.com/Shaan-Shoukath/Makerspace-Inventory-Hub', 'https://makerspace-inventory-hub.vercel.app', false, 9, true
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE lower(title) = lower('Makerspace Inventory Hub'));

UPDATE projects SET description = 'Flutter app built with the BLoC architecture.', tech_stack = ARRAY['Flutter', 'Dart', 'BLoC']::text[], github_url = 'https://github.com/Shaan-Shoukath/FruiteForest', live_url = NULL, featured = false, order_index = 10, published = true WHERE lower(title) = lower('FruiteForest');
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, order_index, published)
SELECT 'FruiteForest', 'Flutter app built with the BLoC architecture.', ARRAY['Flutter', 'Dart', 'BLoC']::text[], 'https://github.com/Shaan-Shoukath/FruiteForest', NULL, false, 10, true
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE lower(title) = lower('FruiteForest'));

UPDATE projects SET description = 'Geospatial analysis with Google Earth Engine behind a FastAPI service.', tech_stack = ARRAY['Python', 'FastAPI', 'Google Earth Engine']::text[], github_url = 'https://github.com/Shaan-Shoukath/Tinkerbluds', live_url = NULL, featured = false, order_index = 11, published = true WHERE lower(title) = lower('Tinkerbluds');
INSERT INTO projects (title, description, tech_stack, github_url, live_url, featured, order_index, published)
SELECT 'Tinkerbluds', 'Geospatial analysis with Google Earth Engine behind a FastAPI service.', ARRAY['Python', 'FastAPI', 'Google Earth Engine']::text[], 'https://github.com/Shaan-Shoukath/Tinkerbluds', NULL, false, 11, true
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE lower(title) = lower('Tinkerbluds'));

-- Domains (no published flag: rows not listed here are pushed to the end) --
UPDATE domains SET order_index = order_index + 100;

UPDATE domains SET title = 'Backend & Platforms', description = 'Production backends for travel, eSIM and ISP billing: APIs, provisioning, payments, bots, notifications and the infrastructure that keeps them running.', background_tone = 'ember', tools = ARRAY['Python', 'Django', 'Node.js', 'PostgreSQL', 'Docker']::text[], order_index = 0 WHERE lower(title) IN (lower('Backend & Platforms'));
INSERT INTO domains (title, description, background_tone, tools, order_index)
SELECT 'Backend & Platforms', 'Production backends for travel, eSIM and ISP billing: APIs, provisioning, payments, bots, notifications and the infrastructure that keeps them running.', 'ember', ARRAY['Python', 'Django', 'Node.js', 'PostgreSQL', 'Docker']::text[], 0
WHERE NOT EXISTS (SELECT 1 FROM domains WHERE lower(title) IN (lower('Backend & Platforms')));

UPDATE domains SET title = 'Web Development', description = 'Fast, server-rendered web apps that turn messy real-world problems into products people actually use.', background_tone = 'graphite', tools = ARRAY['Next.js', 'React', 'TypeScript', 'Prisma']::text[], order_index = 1 WHERE lower(title) IN (lower('Web Development'));
INSERT INTO domains (title, description, background_tone, tools, order_index)
SELECT 'Web Development', 'Fast, server-rendered web apps that turn messy real-world problems into products people actually use.', 'graphite', ARRAY['Next.js', 'React', 'TypeScript', 'Prisma']::text[], 1
WHERE NOT EXISTS (SELECT 1 FROM domains WHERE lower(title) IN (lower('Web Development')));

UPDATE domains SET title = 'App Development', description = 'Cross-platform and native mobile apps with solid architecture and interactions that feel right.', background_tone = 'midnight', tools = ARRAY['Flutter', 'React Native', 'Kotlin', 'SwiftUI']::text[], order_index = 2 WHERE lower(title) IN (lower('App Development'));
INSERT INTO domains (title, description, background_tone, tools, order_index)
SELECT 'App Development', 'Cross-platform and native mobile apps with solid architecture and interactions that feel right.', 'midnight', ARRAY['Flutter', 'React Native', 'Kotlin', 'SwiftUI']::text[], 2
WHERE NOT EXISTS (SELECT 1 FROM domains WHERE lower(title) IN (lower('App Development')));

UPDATE domains SET title = 'UAV & Robotics', description = 'Autonomous multi-drone systems: KML mission planning, MAVLink control, onboard computer vision and SITL testing before anything flies.', background_tone = 'graphite', tools = ARRAY['ROS 2', 'ArduPilot', 'MAVLink', 'OpenCV']::text[], order_index = 3 WHERE lower(title) IN (lower('UAV & Robotics'), lower('UAV and Robotics'));
INSERT INTO domains (title, description, background_tone, tools, order_index)
SELECT 'UAV & Robotics', 'Autonomous multi-drone systems: KML mission planning, MAVLink control, onboard computer vision and SITL testing before anything flies.', 'graphite', ARRAY['ROS 2', 'ArduPilot', 'MAVLink', 'OpenCV']::text[], 3
WHERE NOT EXISTS (SELECT 1 FROM domains WHERE lower(title) IN (lower('UAV & Robotics'), lower('UAV and Robotics')));

UPDATE domains SET title = 'AI & ML', description = 'Applied machine learning, from geospatial analysis with Earth Engine to TinyML on edge hardware and LLM-powered tools.', background_tone = 'plum', tools = ARRAY['Python', 'PyTorch', 'Earth Engine', 'LLMs']::text[], order_index = 4 WHERE lower(title) IN (lower('AI & ML'), lower('AI and ML'));
INSERT INTO domains (title, description, background_tone, tools, order_index)
SELECT 'AI & ML', 'Applied machine learning, from geospatial analysis with Earth Engine to TinyML on edge hardware and LLM-powered tools.', 'plum', ARRAY['Python', 'PyTorch', 'Earth Engine', 'LLMs']::text[], 4
WHERE NOT EXISTS (SELECT 1 FROM domains WHERE lower(title) IN (lower('AI & ML'), lower('AI and ML')));

UPDATE domains SET title = 'IoT & Embedded', description = 'Connected hardware with real-time telemetry, edge computing and reliable links between device and cloud.', background_tone = 'moss', tools = ARRAY['ESP32', 'Raspberry Pi', 'MQTT', 'Arduino']::text[], order_index = 5 WHERE lower(title) IN (lower('IoT & Embedded'), lower('IoT and Embedded'));
INSERT INTO domains (title, description, background_tone, tools, order_index)
SELECT 'IoT & Embedded', 'Connected hardware with real-time telemetry, edge computing and reliable links between device and cloud.', 'moss', ARRAY['ESP32', 'Raspberry Pi', 'MQTT', 'Arduino']::text[], 5
WHERE NOT EXISTS (SELECT 1 FROM domains WHERE lower(title) IN (lower('IoT & Embedded'), lower('IoT and Embedded')));


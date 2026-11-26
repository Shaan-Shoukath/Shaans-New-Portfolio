-- 009: the Oxpel internship ran May–Jun 2024 (it was stored with no end date, so it showed as "Present").
UPDATE experiences SET end_date = 'Jun 2024'
WHERE lower(company) = lower('Oxpel India Technologies') AND lower(title) = lower('Front-End Developer Intern');

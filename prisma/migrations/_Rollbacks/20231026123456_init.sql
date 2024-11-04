-- Rollback for the initial migration (20231026123456_init)

-- Drop the Activity table
DROP TABLE IF EXISTS "Activity";

-- Drop the Goal table
DROP TABLE IF EXISTS "Goal";

-- Drop the User table
DROP TABLE IF EXISTS "User";
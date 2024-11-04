-- Create the User table
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "name" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the Goal table
CREATE TABLE "Goal" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "target" VARCHAR(255) NOT NULL,
  "userId" INT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create the Activity table
CREATE TABLE "Activity" (
  "id" SERIAL PRIMARY KEY,
  "type" VARCHAR(255) NOT NULL,
  "date" DATE NOT NULL,
  "duration" INT NOT NULL,
  "goalId" INT NOT NULL,
  "userId" INT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT "Activity_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE,
  CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create an index on "userId" in the Goal table
CREATE INDEX "Goal_userId_idx" ON "Goal" ("userId");

-- Create an index on "goalId" and "userId" in the Activity table
CREATE INDEX "Activity_goalId_userId_idx" ON "Activity" ("goalId", "userId");
-- Drop existing unique constraint on email
DROP INDEX IF EXISTS "User_email_key";

-- Create composite unique constraint on email + role
CREATE UNIQUE INDEX "User_email_role_key" ON "User"("email", "role");

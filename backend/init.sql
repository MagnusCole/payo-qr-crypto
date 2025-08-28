-- Payo Database Initialization

-- Create database if it doesn't exist
-- (This would be run by the postgres service)

-- The tables will be created automatically by SQLAlchemy
-- when the application starts

-- You can add any additional database initialization here
-- such as creating indexes, triggers, or seed data

-- Example: Create an index for faster invoice lookups
-- CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
-- CREATE INDEX IF NOT EXISTS idx_invoices_method ON invoices(method);
-- CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Example: Create a function for invoice expiry
-- CREATE OR REPLACE FUNCTION check_invoice_expiry()
-- RETURNS void AS $$
-- BEGIN
--     UPDATE invoices
--     SET status = 'expired'
--     WHERE status = 'pending'
--     AND created_at + INTERVAL '24 hours' < NOW();
-- END;
-- $$ LANGUAGE plpgsql;

-- Example: Create a trigger to automatically expire invoices
-- CREATE OR REPLACE FUNCTION trigger_check_invoice_expiry()
-- RETURNS trigger AS $$
-- BEGIN
--     PERFORM check_invoice_expiry();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER invoice_expiry_trigger
--     AFTER INSERT OR UPDATE ON invoices
--     FOR EACH STATEMENT
--     EXECUTE FUNCTION trigger_check_invoice_expiry();

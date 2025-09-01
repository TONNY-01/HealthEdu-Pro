-- Add location column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN location TEXT;

-- Update existing records with default location if needed
UPDATE public.bookings 
SET location = 'Nairobi, Kenya' 
WHERE location IS NULL;

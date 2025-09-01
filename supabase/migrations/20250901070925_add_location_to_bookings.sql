-- Add location column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add a default location for existing bookings
UPDATE public.bookings 
SET location = 'Nairobi, Kenya' 
WHERE location IS NULL;

import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { NeonText } from "@/components/ui/neon-text";
import { Calendar, Clock, MapPin, User, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, addMonths, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isBefore, isAfter, addYears } from 'date-fns';

const Booking = () => {
  // Comprehensive list of hospitals in Nairobi with locations
  const HOSPITALS = [
    { id: "1", name: "Nairobi Hospital", location: "Argwings Kodhek Road, Nairobi", rating: 4.8 },
    { id: "2", name: "Aga Khan University Hospital", location: "3rd Parklands Avenue, Nairobi", rating: 4.9 },
    { id: "3", name: "Kenyatta National Hospital", location: "Hospital Road, Nairobi", rating: 4.5 },
    { id: "4", name: "Mater Misericordiae Hospital", location: "Dunga Road, South C", rating: 4.6 },
    { id: "5", name: "MP Shah Hospital", location: "Shivaji Road, Parklands", rating: 4.7 },
    { id: "6", name: "The Nairobi West Hospital", location: "Mbagathi Road, Nairobi", rating: 4.4 },
    { id: "7", name: "Gertrude's Children's Hospital", location: "Muthaiga Road, Nairobi", rating: 4.7 },
    { id: "8", name: "Nairobi Women's Hospital", location: "Hurlingham, Nairobi", rating: 4.3 },
    { id: "9", name: "Avenue Hospital", location: "1st Parklands Avenue, Nairobi", rating: 4.4 },
    { id: "10", name: "Metropolitan Hospital", location: "Buruburu, Nairobi", rating: 4.2 },
  ];

  // Time slots for appointments
  const TIME_SLOTS = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter hospitals based on search term
  const filteredHospitals = useMemo(() => {
    return HOSPITALS.filter(hospital => 
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Generate days for the current month view
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Check if a date is selectable (not in the past and within 1 year)
  const isDateSelectable = (date: Date) => {
    const today = new Date();
    const oneYearFromNow = addYears(today, 1);
    return !isBefore(date, today) && !isAfter(date, oneYearFromNow);
  };

  // Handle month navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' 
      ? addMonths(prev, -1) 
      : addMonths(prev, 1));
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (isDateSelectable(date)) {
      setSelectedDate(date);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Send booking confirmation email
  const sendConfirmationEmail = async (bookingDetails: any) => {
    try {
      const { error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          to: user?.email,
          subject: 'Your Neon Care Booking Confirmation',
          html: `
            <h2>Booking Confirmed!</h2>
            <p>Thank you for booking with Neon Care. Here are your appointment details:</p>
            <p><strong>Hospital:</strong> ${bookingDetails.clinic_name}</p>
            <p><strong>Location:</strong> ${bookingDetails.location}</p>
            <p><strong>Date:</strong> ${format(new Date(bookingDetails.date), 'EEEE, MMMM d, yyyy')}</p>
            <p><strong>Time:</strong> ${bookingDetails.time_slot}</p>
            <p>We look forward to seeing you!</p>
          `
        }
      });

      if (error) {
        console.error('Email error:', error);
        toast.error('Booking confirmed, but there was an issue sending the confirmation email.');
      }
    } catch (error) {
      console.error('Email error:', error);
      toast.error('Booking confirmed, but there was an issue sending the confirmation email.');
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedClinic || !selectedDate || !selectedTime || !user) {
      toast.error("Please complete all booking details");
      return;
    }

    setLoading(true);
    try {
      const selectedClinicData = HOSPITALS.find(c => c.id === selectedClinic);
      const clinicName = selectedClinicData?.name || 'Unknown Clinic';
      
      // Create booking without the location field
      const { data: bookingData, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          clinic_name: clinicName,
          date: selectedDate.toISOString().split('T')[0],
          time_slot: selectedTime,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;

      // Get the location from HOSPITALS array
      const location = selectedClinicData?.location || 'Nairobi, Kenya';
      
      // Send confirmation email with location from our local data
      await sendConfirmationEmail({
        ...bookingData,
        clinic_name: clinicName,
        location: location,
        date: selectedDate.toISOString().split('T')[0],
        time_slot: selectedTime
      });
      
      toast.success("Booking confirmed! Check your email for details.");
      
      // Reset form
      setSelectedClinic("");
      setSelectedDate(null);
      setSelectedTime("");
      
      // Navigate to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 2000);
      
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,255,0.1),transparent_50%)]" />
      
      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <NeonText as="h1" variant="glow" size="4xl" className="font-bold mb-4">
            Book Your Appointment
          </NeonText>
          <p className="text-muted-foreground text-xl">
            Schedule a consultation with our expert medical professionals
          </p>
        </div>

        {/* Booking Form */}
        <GlassCard className="p-6 md:p-8 space-y-8">
          {/* Step 1: Select Clinic */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">1</span>
              </div>
              <NeonText as="h3" variant="primary" size="xl" className="font-semibold">
                Choose a Hospital
              </NeonText>
            </div>

            {/* Hospital Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search hospitals by name or location..."
                className="w-full p-3 rounded-lg bg-white/10 border border-glass-border text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3 top-3 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-2">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  onClick={() => setSelectedClinic(hospital.id)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedClinic === hospital.id
                      ? "border-primary bg-primary/10 shadow-neon"
                      : "border-glass-border bg-muted hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{hospital.name}</h4>
                      <div className="flex items-start space-x-1 text-muted-foreground text-sm mt-1">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{hospital.location}</span>
                      </div>
                    </div>
                    {selectedClinic === hospital.id && (
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <span className="text-accent font-semibold">{hospital.rating}</span>
                    <span className="text-muted-foreground text-sm">★★★★★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Select Date */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <span className="text-secondary-foreground font-bold text-sm">2</span>
                </div>
                <NeonText as="h3" variant="secondary" size="xl" className="font-semibold">
                  Select Date
                </NeonText>
              </div>
              <div className="text-lg font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-full hover:bg-muted-foreground/10 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-full hover:bg-muted-foreground/10 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm text-muted-foreground">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="py-1 font-medium">{day}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, i) => {
                  const isSelectable = isDateSelectable(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handleDateSelect(day)}
                      disabled={!isSelectable}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                        ${!isCurrentMonth ? 'text-muted-foreground/30' : ''}
                        ${isSelected 
                          ? 'bg-gradient-secondary text-secondary-foreground shadow-neon' 
                          : isSelectable 
                            ? 'hover:bg-muted-foreground/10' 
                            : 'opacity-50 cursor-not-allowed'}
                      `}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Display */}
            {selectedDate && (
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
            )}
          </div>

          {/* Step 3: Select Time */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">3</span>
              </div>
              <NeonText as="h3" variant="accent" size="xl" className="font-semibold">
                Choose Time
              </NeonText>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {TIME_SLOTS.map((time, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg text-center transition-all duration-300 ${
                    selectedTime === time
                      ? "bg-gradient-accent text-accent-foreground shadow-neon"
                      : "bg-muted hover:bg-muted-foreground/10 text-foreground"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          {selectedClinic && selectedDate && selectedTime && (
            <div className="pt-6 border-t border-glass-border">
              <NeonText as="h4" variant="glow" size="lg" className="font-semibold mb-4">
                Booking Summary
              </NeonText>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{HOSPITALS.find(c => c.id === selectedClinic)?.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span>{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>{selectedTime}</span>
                </div>
              </div>

              <NeonButton 
                onClick={handleConfirmBooking}
                disabled={!selectedClinic || !selectedDate || !selectedTime || loading}
                className="w-full py-4 text-lg font-semibold"
                variant="accent"
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </NeonButton>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default Booking;
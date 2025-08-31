import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { NeonText } from "@/components/ui/neon-text";
import { Calendar, Clock, MapPin, User, Check } from "lucide-react";
import { useState } from "react";

const Booking = () => {
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const clinics = [
    { id: "1", name: "City Medical Center", location: "Downtown", rating: 4.8 },
    { id: "2", name: "HealthPlus Clinic", location: "Westlands", rating: 4.9 },
    { id: "3", name: "Family Care Hospital", location: "Karen", rating: 4.7 },
    { id: "4", name: "Wellness Medical Center", location: "Kilimani", rating: 4.6 }
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,255,0.1),transparent_50%)]" />
      
      <div className="max-w-4xl mx-auto relative">
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
        <GlassCard className="p-8 space-y-8">
          {/* Step 1: Select Clinic */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">1</span>
              </div>
              <NeonText as="h3" variant="primary" size="xl" className="font-semibold">
                Choose a Clinic
              </NeonText>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedClinic === clinic.id
                      ? "border-primary bg-primary/10 shadow-neon"
                      : "border-glass-border bg-muted hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{clinic.name}</h4>
                      <div className="flex items-center space-x-1 text-muted-foreground text-sm mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{clinic.location}</span>
                      </div>
                    </div>
                    {selectedClinic === clinic.id && (
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-accent font-semibold">{clinic.rating}</span>
                    <span className="text-muted-foreground text-sm">★★★★★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Select Date */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-sm">2</span>
              </div>
              <NeonText as="h3" variant="secondary" size="xl" className="font-semibold">
                Select Date
              </NeonText>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 14 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();
                
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-3 rounded-lg text-center cursor-pointer transition-all duration-300 ${
                      selectedDate === dateStr
                        ? "bg-gradient-secondary text-secondary-foreground shadow-neon"
                        : "bg-muted hover:bg-glass-hover text-foreground"
                    }`}
                  >
                    <div className="text-xs font-medium">{dayName}</div>
                    <div className="text-lg font-bold">{dayNum}</div>
                  </div>
                );
              })}
            </div>
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

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedTime === time
                      ? "bg-gradient-accent text-accent-foreground shadow-neon"
                      : "bg-muted hover:bg-glass-hover text-foreground border border-glass-border"
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
                  <span>{clinics.find(c => c.id === selectedClinic)?.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span>{new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>{selectedTime}</span>
                </div>
              </div>

              <NeonButton size="lg" className="w-full animate-pulse-neon">
                <User className="w-5 h-5 mr-2" />
                Confirm Booking
              </NeonButton>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default Booking;
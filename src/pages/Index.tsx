import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { NeonText } from "@/components/ui/neon-text";
import heroImage from "@/assets/hero-health.jpg";
import { 
  Calendar, 
  Brain, 
  BookOpen, 
  Crown, 
  Heart, 
  Stethoscope, 
  Shield, 
  Zap 
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,255,0.1),transparent_50%)]" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <NeonText 
                as="h1" 
                variant="glow" 
                size="5xl" 
                className="font-bold leading-tight"
              >
                HealthEdu
                <NeonText as="span" variant="secondary" size="5xl" className="font-bold ml-2">
                  Pro
                </NeonText>
              </NeonText>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Your AI-powered health education platform. Book appointments, get personalized health tips, and learn with interactive lessons.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NeonButton size="lg" className="animate-pulse-neon">
                <Zap className="w-5 h-5 mr-2" />
                Get Started Free
              </NeonButton>
              <NeonButton variant="glass" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                Learn More
              </NeonButton>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 animate-pulse-neon" />
            <img 
              src={heroImage} 
              alt="Futuristic Health Education Interface"
              className="relative z-10 w-full h-auto rounded-3xl shadow-glass animate-float"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <NeonText as="h2" variant="glow" size="4xl" className="font-bold mb-4">
              Transform Your Health Journey
            </NeonText>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of health education with AI-powered insights and seamless appointment booking.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Book Appointments */}
            <GlassCard variant="interactive" className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-neon">
                <Calendar className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="space-y-3">
                <NeonText as="h3" variant="primary" size="xl" className="font-semibold">
                  Smart Booking
                </NeonText>
                <p className="text-muted-foreground">
                  Book clinic appointments with intelligent scheduling and automated reminders.
                </p>
              </div>
            </GlassCard>

            {/* AI Health Tips */}
            <GlassCard variant="interactive" className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-neon">
                <Brain className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div className="space-y-3">
                <NeonText as="h3" variant="secondary" size="xl" className="font-semibold">
                  AI Daktari
                </NeonText>
                <p className="text-muted-foreground">
                  Get personalized health insights powered by advanced AI technology.
                </p>
              </div>
            </GlassCard>

            {/* Interactive Lessons */}
            <GlassCard variant="interactive" className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-accent rounded-2xl flex items-center justify-center shadow-neon">
                <BookOpen className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="space-y-3">
                <NeonText as="h3" variant="accent" size="xl" className="font-semibold">
                  Learn & Grow
                </NeonText>
                <p className="text-muted-foreground">
                  Interactive micro-lessons designed to expand your health knowledge.
                </p>
              </div>
            </GlassCard>

            {/* Premium Features */}
            <GlassCard variant="interactive" className="p-8 text-center space-y-6 border-2 border-neon-lime/30">
              <div className="w-16 h-16 mx-auto bg-gradient-accent rounded-2xl flex items-center justify-center shadow-neon">
                <Crown className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="space-y-3">
                <NeonText as="h3" variant="accent" size="xl" className="font-semibold">
                  Premium Access
                </NeonText>
                <p className="text-muted-foreground">
                  Unlock unlimited AI consultations and exclusive health content.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12 space-y-8">
            <div className="space-y-4">
              <NeonText as="h2" variant="glow" size="4xl" className="font-bold">
                Ready to Start Your Health Journey?
              </NeonText>
              <p className="text-xl text-muted-foreground">
                Join thousands of users already transforming their health with HealthEdu Pro.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NeonButton size="lg" className="animate-pulse-neon">
                <Shield className="w-5 h-5 mr-2" />
                Sign Up - It's Free
              </NeonButton>
              <NeonButton variant="outline" size="lg">
                <Stethoscope className="w-5 h-5 mr-2" />
                Book Demo
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Index;
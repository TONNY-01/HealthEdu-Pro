import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { NeonText } from "@/components/ui/neon-text";
import { 
  Calendar, 
  Brain, 
  BookOpen, 
  Crown, 
  Activity,
  MessageCircle,
  Clock,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen pt-24 px-6 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,255,255,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Welcome Section */}
        <div className="mb-12">
          <NeonText as="h1" variant="glow" size="3xl" className="font-bold mb-2">
            Welcome back, Sarah!
          </NeonText>
          <p className="text-muted-foreground text-lg">
            Ready to continue your health journey today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Book Appointment Card */}
          <GlassCard variant="interactive" className="p-8">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-neon flex-shrink-0">
                <Calendar className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <NeonText as="h3" variant="primary" size="xl" className="font-semibold mb-2">
                    Book Your Next Appointment
                  </NeonText>
                  <p className="text-muted-foreground">
                    Schedule a consultation with our expert medical professionals
                  </p>
                </div>
                <NeonButton>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </NeonButton>
              </div>
            </div>
          </GlassCard>

          {/* AI Health Tip Card */}
          <GlassCard variant="interactive" className="p-8">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-neon flex-shrink-0">
                <Brain className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <NeonText as="h3" variant="secondary" size="xl" className="font-semibold mb-2">
                    Ask AI Daktari
                  </NeonText>
                  <p className="text-muted-foreground">
                    Get personalized health insights powered by AI
                  </p>
                </div>
                <NeonButton variant="secondary">
                  <Brain className="w-4 h-4 mr-2" />
                  Get Tips
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <NeonText as="div" variant="primary" size="2xl" className="font-bold mb-1">
              12
            </NeonText>
            <p className="text-muted-foreground text-sm">Health Tips Received</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-secondary-foreground" />
            </div>
            <NeonText as="div" variant="secondary" size="2xl" className="font-bold mb-1">
              3
            </NeonText>
            <p className="text-muted-foreground text-sm">Appointments Booked</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-accent-foreground" />
            </div>
            <NeonText as="div" variant="accent" size="2xl" className="font-bold mb-1">
              8
            </NeonText>
            <p className="text-muted-foreground text-sm">Lessons Completed</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <NeonText as="div" variant="primary" size="2xl" className="font-bold mb-1">
              92%
            </NeonText>
            <p className="text-muted-foreground text-sm">Health Score</p>
          </GlassCard>
        </div>

        {/* Recent Activity & Lessons */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Health Tips */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <NeonText as="h3" variant="glow" size="xl" className="font-semibold">
                Recent Health Tips
              </NeonText>
              <NeonButton variant="glass" size="sm">
                View All
              </NeonButton>
            </div>
            <div className="space-y-4">
              {[
                { icon: MessageCircle, tip: "Stay hydrated - aim for 8 glasses of water daily", time: "2 hours ago" },
                { icon: Activity, tip: "Take short breaks every hour to reduce eye strain", time: "1 day ago" },
                { icon: Clock, tip: "Maintain a consistent sleep schedule for better rest", time: "3 days ago" }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-muted rounded-xl">
                  <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-foreground text-sm">{item.tip}</p>
                    <p className="text-muted-foreground text-xs mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Continue Learning */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <NeonText as="h3" variant="glow" size="xl" className="font-semibold">
                Continue Learning
              </NeonText>
              <NeonButton variant="glass" size="sm">
                Browse All
              </NeonButton>
            </div>
            <div className="space-y-4">
              {[
                { title: "Understanding Blood Pressure", progress: 75, lessons: "3 of 4 lessons" },
                { title: "Nutrition Basics", progress: 40, lessons: "2 of 5 lessons" },
                { title: "Mental Health Awareness", progress: 100, lessons: "4 of 4 lessons" }
              ].map((course, index) => (
                <div key={index} className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">{course.title}</h4>
                    <Crown className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-background rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{course.lessons}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { NeonText } from "@/components/ui/neon-text";
import { 
  Crown, 
  Check, 
  Zap, 
  Brain, 
  BookOpen, 
  Calendar,
  Infinity,
  Shield,
  Star,
  Sparkles
} from "lucide-react";

const Premium = () => {
  const features = [
    {
      icon: Brain,
      title: "Unlimited AI Consultations",
      description: "Get unlimited health insights from our advanced AI Daktari"
    },
    {
      icon: BookOpen,
      title: "Premium Health Lessons",
      description: "Access exclusive educational content and specialized courses"
    },
    {
      icon: Calendar,
      title: "Priority Booking",
      description: "Skip the queue with priority appointment scheduling"
    },
    {
      icon: Shield,
      title: "Advanced Health Analytics",
      description: "Detailed health reports and personalized recommendations"
    },
    {
      icon: Sparkles,
      title: "24/7 Support",
      description: "Round-the-clock customer support from our medical team"
    },
    {
      icon: Star,
      title: "Exclusive Content",
      description: "Early access to new features and premium health resources"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      features: [
        "3 AI consultations per month",
        "Basic health lessons",
        "Standard booking",
        "Community support"
      ],
      limited: true
    },
    {
      name: "Premium",
      price: "299",
      period: "month",
      features: [
        "Unlimited AI consultations",
        "All premium lessons",
        "Priority booking",
        "Advanced analytics",
        "24/7 support",
        "Exclusive content"
      ],
      popular: true
    },
    {
      name: "Premium Annual",
      price: "2,990",
      period: "year",
      originalPrice: "3,588",
      savings: "Save 17%",
      features: [
        "Everything in Premium",
        "2 months free",
        "Priority support",
        "Exclusive webinars",
        "Health coaching sessions"
      ],
      bestValue: true
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,255,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-neon animate-float">
            <Crown className="w-12 h-12 text-accent-foreground" />
          </div>
          <NeonText as="h1" variant="glow" size="5xl" className="font-bold mb-6">
            Upgrade to Premium
          </NeonText>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            Unlock the full potential of HealthEdu Pro with unlimited AI consultations, premium content, and priority support
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <GlassCard key={index} variant="hover" className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-neon">
                <feature.icon className="w-8 h-8 text-accent-foreground" />
              </div>
              <NeonText as="h3" variant="accent" size="xl" className="font-semibold mb-3">
                {feature.title}
              </NeonText>
              <p className="text-muted-foreground">{feature.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <GlassCard 
              key={index} 
              className={`relative p-8 ${
                plan.popular ? 'border-2 border-primary/50 shadow-neon' : 
                plan.bestValue ? 'border-2 border-accent/50 shadow-neon' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary px-6 py-2 rounded-full">
                    <span className="text-primary-foreground font-semibold text-sm">Most Popular</span>
                  </div>
                </div>
              )}
              
              {plan.bestValue && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-accent px-6 py-2 rounded-full">
                    <span className="text-accent-foreground font-semibold text-sm">Best Value</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center space-x-2">
                  <span className="text-4xl font-bold text-foreground">KES {plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="mt-2">
                    <span className="text-muted-foreground line-through">KES {plan.originalPrice}</span>
                    <span className="ml-2 text-accent font-semibold">{plan.savings}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.limited ? 'bg-muted' : 'bg-gradient-primary'
                    }`}>
                      {plan.limited && idx >= 2 ? (
                        <span className="text-muted-foreground text-xs">×</span>
                      ) : (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className={`text-sm ${plan.limited && idx >= 2 ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <NeonButton 
                className={`w-full ${plan.popular ? 'animate-pulse-neon' : ''}`}
                variant={plan.limited ? 'outline' : plan.bestValue ? 'accent' : 'default'}
                size="lg"
              >
                {plan.limited ? (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Current Plan
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade Now
                  </>
                )}
              </NeonButton>
            </GlassCard>
          ))}
        </div>

        {/* Stats Section */}
        <GlassCard className="p-12 text-center">
          <NeonText as="h3" variant="glow" size="2xl" className="font-bold mb-8">
            Join Thousands of Happy Premium Members
          </NeonText>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <NeonText as="div" variant="primary" size="3xl" className="font-bold mb-2">
                10,000+
              </NeonText>
              <p className="text-muted-foreground">Active Premium Users</p>
            </div>
            <div>
              <NeonText as="div" variant="secondary" size="3xl" className="font-bold mb-2">
                50,000+
              </NeonText>
              <p className="text-muted-foreground">AI Consultations Monthly</p>
            </div>
            <div>
              <NeonText as="div" variant="accent" size="3xl" className="font-bold mb-2">
                4.9★
              </NeonText>
              <p className="text-muted-foreground">Average User Rating</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Premium;
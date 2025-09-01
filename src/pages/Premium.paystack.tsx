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
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const Premium = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
      description: "Access to members-only health resources and webinars"
    }
  ];

  const plans = [
    {
      name: "Monthly",
      price: 999,
      period: "month",
      popular: false,
      features: [
        "Unlimited AI Consultations",
        "Premium Health Lessons",
        "Priority Booking",
        "Basic Analytics"
      ]
    },
    {
      name: "Annual",
      price: 9999,
      period: "year",
      popular: true,
      features: [
        "Everything in Monthly",
        "Advanced Health Analytics",
        "24/7 Priority Support",
        "2 Free Months"
      ]
    },
    {
      name: "Lifetime",
      price: 24999,
      period: "lifetime",
      popular: false,
      features: [
        "Everything in Annual",
        "Lifetime Access",
        "VIP Support",
        "Exclusive Content"
      ]
    }
  ];

  const handleUpgradeClick = async (plan: any) => {
    setLoadingPlan(plan.name);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !user.email) {
        toast.error('You must be logged in to upgrade.');
        setLoadingPlan(null);
        return;
      }

      if (!window.PaystackPop) {
        throw new Error('Payment processor not ready. Please refresh the page and try again.');
      }

      // Generate a unique reference
      const reference = `premium-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create payment handler with test key
      const handler = window.PaystackPop.setup({
        key: 'pk_test_5ff43473557d4ffbc086205fd2d205001ef7038d', // Test public key
        email: user.email,
        amount: plan.price * 100, // Convert to kobo
        ref: reference,
        currency: 'KES',
        metadata: {
          planName: plan.name,
          userId: user.id,
          custom_fields: [
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: user.id
            },
            {
              display_name: "Plan Name",
              variable_name: "plan_name",
              value: plan.name
            }
          ]
        },
        callback: function(response: any) {
          // Update user's premium status
          (async () => {
            try {
              const { error } = await supabase
                .from('profiles')
                .update({ is_premium: true })
                .eq('id', user.id);

              if (error) throw error;
              toast.success('Payment successful! Your account has been upgraded.');
            } catch (error) {
              console.error('Update error:', error);
              toast.error('Payment successful but failed to update your account. Please contact support.');
            }
          })();
        },
        onClose: function() {
          toast.info('Payment window closed');
          setLoadingPlan(null);
        }
      });
      
      handler.openIframe();

    } catch (error: any) {
      console.error('Payment Error:', error);
      toast.error(error.message || 'An error occurred while initializing payment. Please try again.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20 px-4">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mb-6">
          <Crown className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Premium Membership</span>
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Upgrade Your Health Experience
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Get unlimited access to premium features and take control of your health journey
          with our comprehensive healthcare platform.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Premium Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassCard key={index} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                plan.popular 
                  ? 'transform scale-105 shadow-2xl shadow-purple-500/20' 
                  : 'shadow-lg shadow-purple-500/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              <div className="bg-gray-800 p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    KES {plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
                <NeonButton
                  onClick={() => handleUpgradeClick(plan)}
                  disabled={!!loadingPlan}
                  className={`w-full py-3 ${plan.popular ? 'from-purple-500 to-blue-500' : ''}`}
                >
                  {loadingPlan === plan.name ? (
                    'Processing...'
                  ) : (
                    `Get ${plan.name} Plan`
                  )}
                </NeonButton>
              </div>
              <div className="bg-gray-900 p-8">
                <h4 className="text-lg font-semibold mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Premium;

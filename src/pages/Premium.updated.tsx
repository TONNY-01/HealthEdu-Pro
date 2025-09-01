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
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Premium = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
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

      // Generate a unique reference for this transaction
      const reference = `premium-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Initialize payment with Paystack
      const { data, error } = await supabase.functions.invoke('paystack-payment', {
        body: {
          email: user.email,
          amount: plan.price,
          planName: plan.name,
          reference: reference
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error('Could not initialize payment. Please try again.');
      }

    } catch (error: any) {
      console.error('Payment Error:', error);
      toast.error(error.message || 'An error occurred while processing your payment. Please try again.');
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

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-32 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              question: "How does the free trial work?",
              answer: "You get full access to all premium features for 7 days. No credit card required to start your trial."
            },
            {
              question: "Can I change plans later?",
              answer: "Yes, you can upgrade or downgrade your plan at any time. The changes will be reflected in your next billing cycle."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit/debit cards and mobile money through our secure payment processor."
            },
            {
              question: "Is my payment information secure?",
              answer: "Absolutely. We use industry-standard encryption and never store your payment details on our servers."
            },
            {
              question: "How do I cancel my subscription?",
              answer: "You can cancel your subscription at any time from your account settings. No questions asked."
            }
          ].map((item, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
              <p className="text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Premium;

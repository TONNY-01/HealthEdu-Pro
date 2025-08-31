import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { NeonText } from "@/components/ui/neon-text";
import { Brain, Send, Sparkles, TrendingUp, Clock, Star } from "lucide-react";
import { useState } from "react";

const AITips = () => {
  const [symptom, setSymptom] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [confidence, setConfidence] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom.trim()) return;
    
    setLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setResponse(`Based on your symptoms "${symptom}", here are some personalized health recommendations: Stay hydrated, get adequate rest, and consider consulting with a healthcare professional if symptoms persist. This is general advice and should not replace professional medical consultation.`);
      setConfidence(Math.floor(Math.random() * 20) + 80); // 80-99%
      setLoading(false);
    }, 2000);
  };

  const recentTips = [
    {
      input: "Feeling tired and stressed",
      response: "Consider meditation and regular sleep schedule",
      confidence: 92,
      time: "2 hours ago"
    },
    {
      input: "Lower back pain from sitting",
      response: "Take breaks every hour and do stretching exercises",
      confidence: 88,
      time: "1 day ago"
    },
    {
      input: "Seasonal allergies",
      response: "Monitor pollen levels and consider natural remedies",
      confidence: 95,
      time: "3 days ago"
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,255,0.1),transparent_50%)]" />
      
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-neon animate-pulse-neon">
            <Brain className="w-10 h-10 text-secondary-foreground" />
          </div>
          <NeonText as="h1" variant="glow" size="4xl" className="font-bold mb-4">
            Ask AI Daktari
          </NeonText>
          <p className="text-muted-foreground text-xl">
            Get personalized health insights powered by advanced AI technology
          </p>
        </div>

        {/* Main Input Section */}
        <GlassCard className="p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-foreground font-medium mb-3">
                Describe your symptoms or health concerns:
              </label>
              <textarea
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="e.g., I've been feeling tired lately and having trouble sleeping..."
                className="input-glass w-full h-32 resize-none"
                disabled={loading}
              />
            </div>
            
            <NeonButton 
              type="submit" 
              size="lg" 
              className={`w-full ${loading ? 'animate-pulse-neon' : ''}`}
              disabled={loading || !symptom.trim()}
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  AI is analyzing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Get AI Health Insights
                </>
              )}
            </NeonButton>
          </form>
        </GlassCard>

        {/* AI Response */}
        {response && (
          <GlassCard className="p-8 mb-8 border-2 border-secondary/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-secondary-foreground" />
                </div>
                <NeonText as="h3" variant="secondary" size="xl" className="font-semibold">
                  AI Health Insight
                </NeonText>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-accent font-semibold">{confidence}% Confidence</span>
              </div>
            </div>
            
            <div className="bg-muted rounded-xl p-6">
              <p className="text-foreground leading-relaxed">{response}</p>
            </div>
            
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <p className="text-destructive text-sm">
                <strong>Disclaimer:</strong> This AI-generated advice is for informational purposes only and should not replace professional medical consultation. Always consult with a qualified healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </GlassCard>
        )}

        {/* Recent Tips History */}
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-6">
            <NeonText as="h3" variant="glow" size="xl" className="font-semibold">
              Your Recent Health Tips
            </NeonText>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Updated in real-time</span>
            </div>
          </div>

          <div className="space-y-4">
            {recentTips.map((tip, index) => (
              <div key={index} className="p-6 bg-muted rounded-xl border border-glass-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                      <span className="text-foreground font-medium text-sm">Your Question:</span>
                    </div>
                    <p className="text-muted-foreground italic mb-3">"{tip.input}"</p>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-secondary" />
                      <span className="text-foreground font-medium text-sm">AI Response:</span>
                    </div>
                    <p className="text-foreground">{tip.response}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <span className="text-accent font-semibold">{tip.confidence}% Confidence</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground">{tip.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AITips;
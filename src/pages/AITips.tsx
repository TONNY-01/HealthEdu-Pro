import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { NeonText } from "@/components/ui/neon-text";
import { Brain, Send, Sparkles, TrendingUp, Clock, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AITips = () => {
  const [symptom, setSymptom] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [recentTips, setRecentTips] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom.trim()) return;
    
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful healthcare assistant. Provide clear, concise, and accurate medical information.'
            },
            {
              role: 'user',
              content: `I'm experiencing: ${symptom}. Can you provide some health insights?`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from Groq API:', errorData);
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'No response from AI';
      
      // Save the response to Supabase
      const { error } = await supabase
        .from('tips')
        .insert([
          { 
            symptom: symptom,
            response: aiResponse,
            confidence: 0.85 // You can adjust this based on your needs
          }
        ]);

      if (error) {
        console.error('Error saving to Supabase:', error);
      }

      setResponse(aiResponse);
      setConfidence(85); // Set a default confidence level
      setSymptom(""); // Clear input after successful submission
      
      // Refresh recent tips
      await loadRecentTips();
      
      toast.success('AI health insight generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get AI response. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentTips = async () => {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error loading recent tips:', error);
        return;
      }

      setRecentTips(data || []);
    } catch (error) {
      console.error('Error loading recent tips:', error);
    }
  };

  useEffect(() => {
    loadRecentTips();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

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
            {recentTips.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent tips yet. Ask AI Daktari your first health question!</p>
              </div>
            ) : (
              recentTips.map((tip, index) => (
                <div key={tip.id} className="p-6 bg-muted rounded-xl border border-glass-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                        <span className="text-foreground font-medium text-sm">Your Question:</span>
                      </div>
                      <p className="text-muted-foreground italic mb-3">"{tip.input_text}"</p>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-secondary" />
                        <span className="text-foreground font-medium text-sm">AI Response:</span>
                      </div>
                      <p className="text-foreground">{tip.ai_response}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <span className="text-accent font-semibold">{tip.confidence}% Confidence</span>
                      </div>
                    </div>
                    <span className="text-muted-foreground">{formatTimeAgo(tip.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AITips;
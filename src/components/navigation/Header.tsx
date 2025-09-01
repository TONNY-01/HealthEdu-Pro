import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { NeonText } from "@/components/ui/neon-text";
import { Menu, X, Heart, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleLogoClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <GlassCard className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-neon">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <NeonText as="span" variant="glow" size="xl" className="font-bold">
              HealthEdu Pro
            </NeonText>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/dashboard')}
                className={`text-foreground hover:text-primary transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : ''}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/booking')}
                className={`text-foreground hover:text-primary transition-colors ${location.pathname === '/booking' ? 'text-primary' : ''}`}
              >
                Booking
              </button>
              <button 
                onClick={() => navigate('/ai-tips')}
                className={`text-foreground hover:text-primary transition-colors ${location.pathname === '/ai-tips' ? 'text-primary' : ''}`}
              >
                AI Tips
              </button>
              <button 
                onClick={() => navigate('/premium')}
                className={`text-foreground hover:text-primary transition-colors ${location.pathname === '/premium' ? 'text-primary' : ''}`}
              >
                Premium
              </button>
            </nav>
          )}

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-foreground">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email?.split('@')[0]}</span>
                </div>
                <NeonButton variant="glass" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </NeonButton>
              </>
            ) : (
              <>
                <NeonButton variant="glass" size="sm" onClick={handleSignIn}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </NeonButton>
                <NeonButton size="sm" onClick={handleGetStarted}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Get Started
                </NeonButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg glass-card"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 pt-6 border-t border-glass-border">
            {user && (
              <nav className="flex flex-col space-y-4 mb-6">
                <button 
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-foreground hover:text-primary transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : ''}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => {
                    navigate('/booking');
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-foreground hover:text-primary transition-colors ${location.pathname === '/booking' ? 'text-primary' : ''}`}
                >
                  Booking
                </button>
                <button 
                  onClick={() => {
                    navigate('/ai-tips');
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-foreground hover:text-primary transition-colors ${location.pathname === '/ai-tips' ? 'text-primary' : ''}`}
                >
                  AI Tips
                </button>
                <button 
                  onClick={() => {
                    navigate('/premium');
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-foreground hover:text-primary transition-colors ${location.pathname === '/premium' ? 'text-primary' : ''}`}
                >
                  Premium
                </button>
              </nav>
            )}
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-foreground">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.email?.split('@')[0]}</span>
                  </div>
                  <NeonButton variant="glass" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </NeonButton>
                </>
              ) : (
                <>
                  <NeonButton variant="glass" size="sm" onClick={handleSignIn}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </NeonButton>
                  <NeonButton size="sm" onClick={handleGetStarted}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Get Started
                  </NeonButton>
                </>
              )}
            </div>
          </div>
        )}
      </GlassCard>
    </header>
  );
};

export default Header;
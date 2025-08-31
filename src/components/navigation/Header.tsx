import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { NeonText } from "@/components/ui/neon-text";
import { Menu, X, Heart, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <GlassCard className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-neon">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <NeonText as="span" variant="glow" size="xl" className="font-bold">
              HealthEdu Pro
            </NeonText>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <NeonButton variant="glass" size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </NeonButton>
            <NeonButton size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Get Started
            </NeonButton>
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
            <nav className="flex flex-col space-y-4 mb-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors">Features</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">Pricing</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">About</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">Contact</a>
            </nav>
            <div className="flex flex-col space-y-3">
              <NeonButton variant="glass" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </NeonButton>
              <NeonButton size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Get Started
              </NeonButton>
            </div>
          </div>
        )}
      </GlassCard>
    </header>
  );
};

export default Header;
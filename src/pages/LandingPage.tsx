import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, GraduationCap, DollarSign, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section with Animation */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className={`text-center transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="inline-block mb-8">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-pulse-slow">
                KalaSetu
              </h1>
              <p className="text-lg text-muted-foreground mt-2 animate-fade-in">
                Bridge Your Skills to Success
              </p>
            </div>
            
            <div className={`mt-12 transform transition-all duration-1000 delay-300 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                From Idea to Market Success
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                A comprehensive platform that takes you through every step: 
                <span className="text-primary font-semibold"> Idea → Training → Funding → Market Access</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => navigate('/signup')}
                  className="group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute top-1/4 left-1/4 animate-bounce opacity-20">
          <Lightbulb className="h-16 w-16 text-primary" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-pulse opacity-20">
          <GraduationCap className="h-14 w-14 text-primary" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-500 opacity-20">
          <DollarSign className="h-12 w-12 text-primary" />
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-pulse delay-700 opacity-20">
          <TrendingUp className="h-15 w-15 text-primary" />
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 transform transition-all duration-1000 delay-500 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How KalaSetu Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "Idea",
                description: "Transform your vision into a structured business concept",
                color: "text-yellow-500"
              },
              {
                icon: GraduationCap,
                title: "Training",
                description: "Develop skills and knowledge needed for success",
                color: "text-blue-500"
              },
              {
                icon: DollarSign,
                title: "Funding",
                description: "Connect with investors and funding opportunities",
                color: "text-green-500"
              },
              {
                icon: TrendingUp,
                title: "Market Access",
                description: "Launch and scale your business in the marketplace",
                color: "text-purple-500"
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
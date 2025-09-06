import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Lock, User, MapPin, Star, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const SignupPage = () => {
  const [activeTab, setActiveTab] = useState('artisan');
  const [artisanFormData, setArtisanFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [mentorFormData, setMentorFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    skills: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleArtisanInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtisanFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleMentorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMentorFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleArtisanSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (artisanFormData.password !== artisanFormData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (!artisanFormData.full_name || !artisanFormData.email || !artisanFormData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await signUp(artisanFormData.email, artisanFormData.password, {
        full_name: artisanFormData.full_name,
        role: 'artisan'
      });
      toast({
        title: "Welcome to KalaSetu!",
        description: "Account created successfully. Let's set up your profile.",
      });
      navigate('/profile-setup');
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMentorSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mentorFormData.password !== mentorFormData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (!mentorFormData.full_name || !mentorFormData.email || !mentorFormData.password || !mentorFormData.skills || !mentorFormData.bio) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const skillsArray = mentorFormData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      await signUp(mentorFormData.email, mentorFormData.password, {
        full_name: mentorFormData.full_name,
        role: 'mentor',
        location: mentorFormData.location,
        skills: skillsArray,
        bio: mentorFormData.bio
      });
      
      toast({
        title: "Welcome to KalaSetu!",
        description: "Mentor account created successfully. You can now help artisans!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-zoom-in">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-medium">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                KalaSetu
              </h1>
            </div>
            <CardTitle className="text-2xl">Join KalaSetu</CardTitle>
            <CardDescription>
              Choose your role and start your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="artisan">Artisan</TabsTrigger>
                <TabsTrigger value="mentor">Mentor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="artisan" className="mt-6">
                <form onSubmit={handleArtisanSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="artisan-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="artisan-name"
                        name="full_name"
                        type="text"
                        placeholder="Your full name"
                        value={artisanFormData.full_name}
                        onChange={handleArtisanInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artisan-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="artisan-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={artisanFormData.email}
                        onChange={handleArtisanInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="artisan-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="artisan-password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={artisanFormData.password}
                        onChange={handleArtisanInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artisan-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="artisan-confirm"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={artisanFormData.confirmPassword}
                        onChange={handleArtisanInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="hero"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Artisan Account'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="mentor" className="mt-6">
                <form onSubmit={handleMentorSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mentor-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mentor-name"
                        name="full_name"
                        type="text"
                        placeholder="Your full name"
                        value={mentorFormData.full_name}
                        onChange={handleMentorInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mentor-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mentor-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={mentorFormData.email}
                        onChange={handleMentorInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mentor-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mentor-password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={mentorFormData.password}
                        onChange={handleMentorInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mentor-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mentor-confirm"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={mentorFormData.confirmPassword}
                        onChange={handleMentorInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mentor-location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mentor-location"
                        name="location"
                        type="text"
                        placeholder="City, State/Country"
                        value={mentorFormData.location}
                        onChange={handleMentorInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mentor-skills">Skills & Expertise</Label>
                    <div className="relative">
                      <Star className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mentor-skills"
                        name="skills"
                        type="text"
                        placeholder="pottery, business strategy, marketing (comma-separated)"
                        value={mentorFormData.skills}
                        onChange={handleMentorInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mentor-bio">Bio</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="mentor-bio"
                        name="bio"
                        placeholder="Tell us about your experience and how you can help artisans..."
                        value={mentorFormData.bio}
                        onChange={handleMentorInputChange}
                        className="pl-10 min-h-[100px]"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="hero"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Mentor Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, User, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    experience: ''
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills(prev => [...prev, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate profile setup
    setTimeout(() => {
      toast({
        title: "Profile Created!",
        description: "Welcome to KalaSetu. Your journey starts now!",
      });
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-zoom-in">
        <Card className="shadow-medium">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                KalaSetu
              </h1>
            </div>
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>
              Tell us about yourself to get personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself, your interests, and goals..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="pl-10 min-h-[100px]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="text"
                    placeholder="e.g., Beginner, Intermediate, Expert"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Skills & Interests</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Add a skill (e.g., Web Development, Marketing)"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={addSkill}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="hero"
                size="lg"
                disabled={isLoading || skills.length === 0}
              >
                {isLoading ? 'Creating Profile...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
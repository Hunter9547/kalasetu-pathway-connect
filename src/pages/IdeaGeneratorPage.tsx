import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface GeneratedIdea {
  id: string;
  title: string;
  description: string;
  rationale: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
}

const IdeaGeneratorPage = () => {
  const [formData, setFormData] = useState({
    skills: '',
    materials: ''
  });
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.skills.trim() || !formData.materials.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both your skills and available materials',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.generateIdea({
        skills: formData.skills.split(',').map(s => s.trim()),
        materials: formData.materials.split(',').map(m => m.trim())
      });
      
      setIdeas(response.ideas || []);
      
      toast({
        title: 'Ideas Generated!',
        description: `Generated ${response.ideas?.length || 0} product ideas for you`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate ideas. Please try again.',
        variant: 'destructive'
      });
      
      // Mock ideas for demo purposes
      const mockIdeas: GeneratedIdea[] = [
        {
          id: '1',
          title: 'Handcrafted Wooden Phone Stand',
          description: 'A minimalist wooden phone stand perfect for video calls and media consumption.',
          rationale: 'Combines woodworking skills with modern technology needs. High demand for home office accessories.',
          difficulty: 'Easy',
          estimatedTime: '2-3 hours'
        },
        {
          id: '2',
          title: 'Custom Jewelry Organizer',
          description: 'Multi-tier jewelry display case with felt-lined compartments.',
          rationale: 'Leverages crafting skills and addresses common storage problems. Good profit margins.',
          difficulty: 'Medium',
          estimatedTime: '1-2 days'
        },
        {
          id: '3',
          title: 'Eco-Friendly Planters',
          description: 'Biodegradable planters made from recycled materials for urban gardening.',
          rationale: 'Taps into sustainability trends and urban gardening movement. Scalable product.',
          difficulty: 'Medium',
          estimatedTime: '4-6 hours'
        }
      ];
      setIdeas(mockIdeas);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/10 text-success';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Hard': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">AI Product Idea Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tell us about your skills and available materials, and our AI will generate personalized product ideas for your business.
          </p>
        </div>

        {/* Input Form */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Generate New Ideas</CardTitle>
            <CardDescription>
              Provide your skills and materials to get tailored product suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateIdeas} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="skills">Your Skills</Label>
                  <Textarea
                    id="skills"
                    name="skills"
                    placeholder="e.g., woodworking, painting, sewing, 3D printing..."
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    List your skills separated by commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials">Available Materials</Label>
                  <Textarea
                    id="materials"
                    name="materials"
                    placeholder="e.g., wood, fabric, clay, electronics, metal..."
                    value={formData.materials}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    List your available materials separated by commas
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Product Ideas
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Generated Ideas */}
        {ideas.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Generated Ideas</h2>
            <div className="grid gap-6">
              {ideas.map((idea, index) => (
                <Card key={idea.id} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{idea.title}</CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(idea.difficulty)}`}>
                            {idea.difficulty}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ⏱️ {idea.estimatedTime}
                          </span>
                        </div>
                      </div>
                      <div className="text-primary font-bold text-lg">
                        #{index + 1}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-muted-foreground">{idea.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Why This Works</h4>
                      <p className="text-muted-foreground">{idea.rationale}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Save Idea
                      </Button>
                      <Button variant="outline" size="sm">
                        Find Collaborators
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {ideas.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Generate Ideas?</h3>
              <p className="text-muted-foreground">
                Fill in your skills and materials above to get started with AI-powered product suggestions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IdeaGeneratorPage;
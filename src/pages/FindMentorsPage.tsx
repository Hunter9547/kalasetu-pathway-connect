import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Search, Loader2, Users, MapPin, Mail } from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Mentor {
  uid: string;
  name: string;
  email: string;
  location?: string;
  skills: string[];
  bio?: string;
  role: string;
}

const FindMentorsPage = () => {
  const [searchSkill, setSearchSkill] = useState('');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestingMentorship, setRequestingMentorship] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchSkill.trim()) {
      toast({
        title: 'Search Required',
        description: 'Please enter a skill or expertise to search for mentors',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      const response = await api.searchUsers(searchSkill);
      // Filter only users with role: "mentor"
      const mentorResults = response.results?.filter((user: Mentor) => user.role === 'mentor') || [];
      setMentors(mentorResults);
      
      if (mentorResults.length > 0) {
        toast({
          title: 'Mentors Found!',
          description: `Found ${mentorResults.length} mentor${mentorResults.length > 1 ? 's' : ''} matching your search`
        });
      }
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'Unable to search for mentors. Please try again.',
        variant: 'destructive'
      });
      
      // Mock data for demo purposes
      const mockMentors: Mentor[] = [
        {
          uid: '1',
          name: 'Sarah Kumar',
          email: 'sarah.kumar@example.com',
          location: 'Mumbai, India',
          skills: ['Pottery', 'Ceramics', 'Business Strategy'],
          bio: 'Award-winning ceramic artist with 15+ years of experience. I help artisans scale their pottery businesses and develop unique glazing techniques.',
          role: 'mentor'
        },
        {
          uid: '2',
          name: 'Rajesh Patel',
          email: 'rajesh.patel@example.com',
          location: 'Ahmedabad, Gujarat',
          skills: ['Textile Design', 'Block Printing', 'Marketing'],
          bio: 'Traditional block printing master and business mentor. I guide textile artisans in modern market strategies while preserving ancient techniques.',
          role: 'mentor'
        },
        {
          uid: '3',
          name: 'Maya Singh',
          email: 'maya.singh@example.com',
          location: 'Jaipur, Rajasthan',
          skills: ['Jewelry Making', 'Silver Work', 'E-commerce'],
          bio: 'Master jeweler specializing in traditional Rajasthani silver work. I mentor artisans on online business development and quality standards.',
          role: 'mentor'
        }
      ];
      setMentors(mockMentors);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async (mentorUid: string, mentorName: string) => {
    setRequestingMentorship(mentorUid);
    
    try {
      await api.sendCollaborationRequest({
        recipientId: mentorUid,
        message: `Hi ${mentorName}, I would like to request your mentorship to help grow my craft and business. I believe your expertise would be invaluable to my journey as an artisan.`,
        type: 'mentorship'
      });
      
      toast({
        title: 'Mentorship Request Sent!',
        description: `Your mentorship request has been sent to ${mentorName}`
      });
    } catch (error) {
      toast({
        title: 'Request Failed',
        description: 'Unable to send mentorship request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setRequestingMentorship(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Find Mentors</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with experienced artisan mentors who can guide you in developing your skills, growing your business, and navigating the creative industry.
          </p>
        </div>

        {/* Search Form */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Search for Mentors</CardTitle>
            <CardDescription>
              Find mentors by their skills and expertise areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Search by skill or expertise (e.g., pottery, business strategy, marketing...)"
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="sm:w-auto w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search Mentors
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {mentors.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Available Mentors ({mentors.length})</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor) => (
                <Card key={mentor.uid} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{mentor.name}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {mentor.email}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mentor.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {mentor.location}
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Expertise</h4>
                      <div className="flex flex-wrap gap-1">
                        {mentor.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {mentor.bio && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">About</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {mentor.bio}
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => handleRequestMentorship(mentor.uid, mentor.name)}
                      disabled={requestingMentorship === mentor.uid}
                      className="w-full"
                      variant="default"
                    >
                      {requestingMentorship === mentor.uid ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Request Mentorship
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {searched && mentors.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Mentors Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any mentors matching "{searchSkill}". Try searching with different skills or broader terms.
              </p>
              <Button variant="outline" onClick={() => setSearchSkill('')}>
                Try Different Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!searched && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Discover Your Perfect Mentor</h3>
              <p className="text-muted-foreground">
                Search for experienced artisan mentors who can help guide your creative journey and business growth.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FindMentorsPage;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Check, X, MessageCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase, MentorshipRequest, UserProfile } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface RequestWithProfile extends MentorshipRequest {
  artisan_profile: UserProfile;
}

const MentorshipRequestsPage = () => {
  const [requests, setRequests] = useState<RequestWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role !== 'mentor') {
      navigate('/dashboard');
      return;
    }
    fetchRequests();
  }, [profile, navigate]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mentorship_requests')
        .select(`
          *,
          artisan_profile:profiles!mentorship_requests_artisan_id_fkey(*)
        `)
        .eq('mentor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentorship requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId: string, status: 'accepted' | 'rejected') => {
    setProcessingRequest(requestId);

    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: status === 'accepted' ? 'Request Accepted' : 'Request Rejected',
        description: status === 'accepted' 
          ? 'You can now start mentoring this artisan!' 
          : 'The request has been declined.',
      });

      // Refresh requests
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: 'Error',
        description: 'Failed to update request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleStartChat = (artisanId: string, artisanName: string) => {
    navigate(`/chat/${artisanId}?name=${encodeURIComponent(artisanName)}`);
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const acceptedRequests = requests.filter(req => req.status === 'accepted');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading mentorship requests...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold">Mentorship Requests</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage incoming mentorship requests from artisans seeking your guidance and expertise.
          </p>
        </div>

        {/* Pending Requests */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">Pending Requests</h2>
            <Badge variant="secondary">{pendingRequests.length}</Badge>
          </div>
          
          {pendingRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground">
                  You don't have any pending mentorship requests at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{request.artisan_profile.full_name}</CardTitle>
                        <CardDescription>{request.artisan_profile.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {request.artisan_profile.location && (
                      <p className="text-sm text-muted-foreground">
                        📍 {request.artisan_profile.location}
                      </p>
                    )}
                    
                    {request.artisan_profile.skills && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {request.artisan_profile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Message</h4>
                      <p className="text-sm text-muted-foreground">
                        {request.message}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleRequestResponse(request.id, 'accepted')}
                        disabled={processingRequest === request.id}
                        className="flex-1"
                        variant="default"
                      >
                        {processingRequest === request.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Accept
                      </Button>
                      <Button 
                        onClick={() => handleRequestResponse(request.id, 'rejected')}
                        disabled={processingRequest === request.id}
                        variant="outline"
                        className="flex-1"
                      >
                        {processingRequest === request.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 mr-2" />
                        )}
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Accepted Requests */}
        {acceptedRequests.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">Active Mentorships</h2>
              <Badge variant="default">{acceptedRequests.length}</Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {acceptedRequests.map((request) => (
                <Card key={request.id} className="shadow-soft hover:shadow-medium transition-shadow border-green-200">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{request.artisan_profile.full_name}</CardTitle>
                        <Badge variant="default" className="text-xs">Active Mentorship</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={() => handleStartChat(request.artisan_id, request.artisan_profile.full_name)}
                      className="w-full"
                      variant="default"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipRequestsPage;
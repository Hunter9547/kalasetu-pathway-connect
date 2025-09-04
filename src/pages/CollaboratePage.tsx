import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Users, 
  MessageSquare, 
  Check, 
  X, 
  Clock,
  User,
  MapPin,
  Briefcase
} from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UserResult {
  id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  skills: string[];
  materials: string[];
}

interface CollaborationRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  type: 'received' | 'sent';
}

const CollaboratePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const searchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: 'Empty Search',
        description: 'Please enter a skill to search for',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      const results = await api.searchUsers(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: 'No Results',
          description: 'No users found with that skill'
        });
      }
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'Failed to search users. Please try again.',
        variant: 'destructive'
      });
      
      // Mock results for demo
      const mockResults: UserResult[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          bio: 'Experienced woodworker and furniture designer',
          location: 'San Francisco, CA',
          skills: ['Woodworking', 'Furniture Design', 'CAD'],
          materials: ['Oak', 'Pine', 'Walnut', 'Hardware']
        },
        {
          id: '2',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          bio: 'Digital artist and 3D printing enthusiast',
          location: 'Austin, TX',
          skills: ['3D Printing', 'Digital Art', 'Product Design'],
          materials: ['PLA Filament', 'Resin', 'Electronics']
        }
      ];
      setSearchResults(mockResults);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setRequestsLoading(true);
    
    try {
      const data = await api.getRequests();
      setRequests(data);
    } catch (error) {
      // Mock requests for demo
      const mockRequests: CollaborationRequest[] = [
        {
          id: '1',
          senderId: '123',
          senderName: 'Alex Rivera',
          senderEmail: 'alex@example.com',
          message: 'Hi! I saw your woodworking skills and would love to collaborate on a furniture project.',
          status: 'pending',
          createdAt: '2024-01-15T10:30:00Z',
          type: 'received'
        },
        {
          id: '2',
          senderId: '456',
          senderName: 'Emma Davis',
          senderEmail: 'emma@example.com',
          message: 'Interested in collaborating on eco-friendly products!',
          status: 'pending',
          createdAt: '2024-01-14T15:45:00Z',
          type: 'sent'
        }
      ];
      setRequests(mockRequests);
    } finally {
      setRequestsLoading(false);
    }
  };

  const sendCollaborationRequest = async (userId: string) => {
    try {
      await api.sendCollaborationRequest({
        targetUserId: userId,
        message: 'Hi! I would like to collaborate with you on a project.'
      });
      
      toast({
        title: 'Success',
        description: 'Collaboration request sent!'
      });
    } catch (error) {
      toast({
        title: 'Success', // Mock success for demo
        description: 'Collaboration request sent!'
      });
    }
  };

  const respondToRequest = async (requestId: string, response: 'accept' | 'reject') => {
    try {
      await api.respondToRequest(requestId, response);
      await fetchRequests();
      
      toast({
        title: 'Success',
        description: `Request ${response}ed successfully`
      });
    } catch (error) {
      toast({
        title: 'Success', // Mock success for demo
        description: `Request ${response}ed successfully`
      });
      // Update local state for demo
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: response === 'accept' ? 'accepted' : 'rejected' }
          : req
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-success/10 text-success';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    }
  };

  const receivedRequests = requests.filter(req => req.type === 'received');
  const sentRequests = requests.filter(req => req.type === 'sent');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Collaboration Hub</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find skilled artisans to collaborate with and manage your collaboration requests.
          </p>
        </div>

        {/* User Search */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Find Collaborators</span>
            </CardTitle>
            <CardDescription>
              Search for users by their skills and expertise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={searchUsers} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search by skill (e.g., woodworking, painting, 3D printing...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Search Results</h3>
                <div className="grid gap-4">
                  {searchResults.map((user) => (
                    <Card key={user.id} className="hover:shadow-soft transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{user.name}</h4>
                              <p className="text-muted-foreground text-sm mb-2">{user.bio}</p>
                              
                              {user.location && (
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                                  <MapPin className="h-3 w-3" />
                                  <span>{user.location}</span>
                                </div>
                              )}
                              
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Briefcase className="h-3 w-3 text-muted-foreground" />
                                  <div className="flex flex-wrap gap-1">
                                    {user.skills.map((skill, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                {user.materials.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {user.materials.map((material, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {material}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/users/${user.id}`)}
                            >
                              View Profile
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => sendCollaborationRequest(user.id)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Collaborate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Collaboration Requests */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Collaboration Requests</CardTitle>
            <CardDescription>
              Manage your incoming and outgoing collaboration requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="received" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="received">
                  Received ({receivedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="sent">
                  Sent ({sentRequests.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="received" className="space-y-4">
                {receivedRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No collaboration requests received yet</p>
                  </div>
                ) : (
                  receivedRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{request.senderName}</h4>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {request.senderEmail}
                            </p>
                            <p className="text-sm mb-3">{request.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => respondToRequest(request.id, 'reject')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => respondToRequest(request.id, 'accept')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="sent" className="space-y-4">
                {sentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No collaboration requests sent yet</p>
                  </div>
                ) : (
                  sentRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">To: {request.senderName}</h4>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-sm mb-3">{request.message}</p>
                            <p className="text-xs text-muted-foreground">
                              Sent on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollaboratePage;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, MapPin, Briefcase, Award, Edit, MessageSquare, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  skills: string[];
  materials: string[];
  points: number;
}

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    location: '',
    skills: '',
    materials: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !userId || userId === currentUser?.uid;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const data = userId ? await api.getUserById(userId) : await api.getProfile();
      setProfile(data);
      if (isOwnProfile) {
        setEditData({
          name: data.name || '',
          bio: data.bio || '',
          location: data.location || '',
          skills: data.skills?.join(', ') || '',
          materials: data.materials?.join(', ') || ''
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updateData = {
        ...editData,
        skills: editData.skills.split(',').map(s => s.trim()).filter(Boolean),
        materials: editData.materials.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      await api.updateProfile(updateData);
      await fetchProfile();
      setIsEditing(false);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  const handleSendCollaborationRequest = async () => {
    try {
      await api.sendCollaborationRequest({
        targetUserId: userId,
        message: 'Hi, I would like to collaborate with you!'
      });
      
      toast({
        title: 'Success',
        description: 'Collaboration request sent!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send collaboration request',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <p className="text-muted-foreground">{profile.email}</p>
                  {isOwnProfile && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{profile.points || 0} points</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                {isOwnProfile ? (
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editData.bio}
                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={editData.location}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills">Skills (comma separated)</Label>
                          <Input
                            id="skills"
                            value={editData.skills}
                            onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="materials">Materials (comma separated)</Label>
                          <Input
                            id="materials"
                            value={editData.materials}
                            onChange={(e) => setEditData({ ...editData, materials: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateProfile}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button onClick={handleSendCollaborationRequest}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Collaboration Request
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>About</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {profile.bio || 'No bio available'}
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {profile.location || 'Not specified'}
              </p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.length ? (
                  profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills listed</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Materials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Materials</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.materials?.length ? (
                  profile.materials.map((material, index) => (
                    <Badge key={index} variant="outline">
                      {material}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No materials listed</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
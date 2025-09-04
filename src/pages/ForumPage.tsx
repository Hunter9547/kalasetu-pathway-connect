import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Plus, 
  Heart, 
  MessageCircle, 
  Share, 
  User,
  Clock
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const ForumPage = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.getForumPosts();
      setPosts(data);
    } catch (error) {
      // Mock posts for demo
      const mockPosts: ForumPost[] = [
        {
          id: '1',
          authorId: '123',
          authorName: 'Sarah Chen',
          authorEmail: 'sarah@example.com',
          content: 'Just finished my first wooden phone stand using the AI-generated design from KalaSetu! The measurements were perfect and the process was so smooth. Has anyone else tried the idea generator yet?',
          createdAt: '2024-01-15T14:30:00Z',
          likes: 12,
          comments: 3,
          isLiked: false
        },
        {
          id: '2',
          authorId: '456',
          authorName: 'Mike Johnson',
          authorEmail: 'mike@example.com',
          content: 'Looking for collaborators on a sustainable packaging project. I have experience with recycled materials and need someone with graphic design skills. The idea came from the AI tool and I think it has great potential!',
          createdAt: '2024-01-15T10:15:00Z',
          likes: 8,
          comments: 5,
          isLiked: true
        },
        {
          id: '3',
          authorId: '789',
          authorName: 'Emma Davis',
          authorEmail: 'emma@example.com',
          content: 'Excited to share that my collaboration through KalaSetu led to our first sale! We created eco-friendly planters and they\'re selling like hotcakes at the local market. This platform really works!',
          createdAt: '2024-01-14T18:45:00Z',
          likes: 25,
          comments: 8,
          isLiked: false
        },
        {
          id: '4',
          authorId: '101',
          authorName: 'Alex Rivera',
          authorEmail: 'alex@example.com',
          content: 'The text-to-speech tool is amazing for creating product presentations! I used it to narrate my product pitch and it sounds so professional. Highly recommend trying all the AI tools.',
          createdAt: '2024-01-14T16:20:00Z',
          likes: 6,
          comments: 2,
          isLiked: false
        },
        {
          id: '5',
          authorId: '202',
          authorName: 'Lisa Wong',
          authorEmail: 'lisa@example.com',
          content: 'New to the platform and already loving the community! The idea generator suggested 5 different products I could make with my sewing skills. Can\'t wait to start my first project.',
          createdAt: '2024-01-14T12:10:00Z',
          likes: 15,
          comments: 6,
          isLiked: true
        }
      ];
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) {
      toast({
        title: 'Empty Post',
        description: 'Please write something before posting',
        variant: 'destructive'
      });
      return;
    }

    setPosting(true);
    
    try {
      await api.createForumPost({ content: newPost });
      setNewPost('');
      await fetchPosts();
      
      toast({
        title: 'Post Created!',
        description: 'Your post has been shared with the community'
      });
    } catch (error) {
      // Mock success for demo
      const mockNewPost: ForumPost = {
        id: Date.now().toString(),
        authorId: currentUser?.uid || '',
        authorName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'You',
        authorEmail: currentUser?.email || '',
        content: newPost,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        isLiked: false
      };
      
      setPosts(prev => [mockNewPost, ...prev]);
      setNewPost('');
      
      toast({
        title: 'Post Created!',
        description: 'Your post has been shared with the community'
      });
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Share your projects, ask questions, and connect with fellow artisans in the KalaSetu community.
          </p>
        </div>

        {/* Create Post */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Share with the Community</span>
            </CardTitle>
            <CardDescription>
              What's on your mind? Share your latest project, ask for advice, or start a discussion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What would you like to share with the community? (e.g., your latest project, a question, or seeking collaboration...)"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex justify-end">
              <Button 
                onClick={createPost}
                disabled={posting || !newPost.trim()}
              >
                {posting ? 'Posting...' : 'Share Post'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Posts</h2>
          
          {posts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  Be the first to share something with the community!
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-soft transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Post Header */}
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(post.authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{post.authorName}</h4>
                          <span className="text-sm text-muted-foreground">•</span>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="pl-13">
                      <p className="text-sm leading-relaxed">{post.content}</p>
                    </div>

                    {/* Post Actions */}
                    <div className="pl-13 flex items-center space-x-6 text-sm">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          post.isLiked 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
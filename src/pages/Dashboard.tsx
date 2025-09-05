import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  GraduationCap, 
  DollarSign, 
  TrendingUp, 
  User, 
  Bell,
  Search,
  Plus,
  ArrowRight,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const journeySteps = [
    { 
      icon: Lightbulb, 
      title: 'Idea Development', 
      progress: 75, 
      status: 'In Progress',
      description: 'Refine your business concept'
    },
    { 
      icon: GraduationCap, 
      title: 'Skill Training', 
      progress: 45, 
      status: 'Active',
      description: 'Learn essential skills'
    },
    { 
      icon: DollarSign, 
      title: 'Funding Ready', 
      progress: 0, 
      status: 'Locked',
      description: 'Prepare for investment'
    },
    { 
      icon: TrendingUp, 
      title: 'Market Launch', 
      progress: 0, 
      status: 'Locked',
      description: 'Go to market strategy'
    }
  ];

  const quickActions = [
    { title: 'Find Mentors', description: 'Connect with industry experts', icon: User, link: '/find-mentors' },
    { title: 'Generate Ideas', description: 'AI-powered product suggestions', icon: Lightbulb, link: '/generate-idea' },
    { title: 'Find Collaborators', description: 'Network with other artisans', icon: Users, link: '/collaborate' },
    { title: 'AI Tools', description: 'Access powerful AI utilities', icon: GraduationCap, link: '/tools' }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              KalaSetu
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className={`mb-8 transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground text-lg">
            Continue your entrepreneurial journey with KalaSetu
          </p>
        </div>

        {/* Journey Progress */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-xl">Your Journey Progress</CardTitle>
              <CardDescription>
                Track your progress from idea to market success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {journeySteps.map((step, index) => (
                  <div 
                    key={step.title}
                    className="space-y-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <step.icon className={`h-8 w-8 ${
                        step.status === 'Locked' ? 'text-muted-foreground' : 'text-primary'
                      }`} />
                      <Badge 
                        variant={
                          step.status === 'In Progress' ? 'default' : 
                          step.status === 'Active' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {step.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{step.progress}%</span>
                      </div>
                      <Progress value={step.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className={`mb-8 transform transition-all duration-1000 delay-400 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription>
                    Popular actions to accelerate your progress
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Action
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={action.title} to={action.link}>
                    <Card 
                      key={action.title} 
                      className="p-4 hover:shadow-soft transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <action.icon className="h-6 w-6 text-primary" />
                          <div>
                            <h4 className="font-semibold">{action.title}</h4>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className={`transform transition-all duration-1000 delay-600 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <CardDescription>
                Keep track of your latest achievements and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-accent/20">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Profile setup completed</p>
                    <p className="text-sm text-muted-foreground">Welcome to KalaSetu! Your journey begins now.</p>
                    <p className="text-xs text-muted-foreground mt-1">Just now</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-muted mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Account created</p>
                    <p className="text-sm text-muted-foreground">Your KalaSetu account has been successfully created.</p>
                    <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import Dashboard from '@/pages/Dashboard';
import ProfilePage from '@/pages/ProfilePage';
import ProfileSetup from '@/pages/ProfileSetup';
import IdeaGeneratorPage from '@/pages/IdeaGeneratorPage';
import CollaboratePage from '@/pages/CollaboratePage';
import FindMentorsPage from '@/pages/FindMentorsPage';
import MentorshipRequestsPage from '@/pages/MentorshipRequestsPage';
import ChatPage from '@/pages/ChatPage';
import AIToolsPage from '@/pages/AIToolsPage';
import ForumPage from '@/pages/ForumPage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:userId" element={<ProfilePage />} />
            <Route path="/generate-idea" element={<IdeaGeneratorPage />} />
            <Route path="/collaborate" element={<CollaboratePage />} />
            <Route path="/find-mentors" element={<FindMentorsPage />} />
            <Route path="/mentorship-requests" element={<MentorshipRequestsPage />} />
            <Route path="/chat/:userId" element={<ChatPage />} />
            <Route path="/tools" element={<AIToolsPage />} />
            <Route path="/forum" element={<ForumPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;

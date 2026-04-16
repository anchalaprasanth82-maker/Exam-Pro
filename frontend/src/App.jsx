import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import ExamList from './pages/student/ExamList';
import ExamAttempt from './pages/student/ExamAttempt';
import ResultPage from './pages/student/ResultPage';
import Leaderboard from './pages/student/Leaderboard';
import AttemptHistory from './pages/student/AttemptHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateExam from './pages/admin/CreateExam';
import ManageQuestions from './pages/admin/ManageQuestions';
import StudentManagement from './pages/admin/StudentManagement';
import Analytics from './pages/admin/Analytics';
import SubmissionDetail from './pages/admin/SubmissionDetail';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';

const AppRoutes = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
      
      {/* Student Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/exams" element={
        <ProtectedRoute>
          <ExamList />
        </ProtectedRoute>
      } />
      <Route path="/attempts" element={
        <ProtectedRoute>
          <AttemptHistory />
        </ProtectedRoute>
      } />
      <Route path="/exam/attempt/:examId" element={
        <ProtectedRoute>
          <ExamAttempt />
        </ProtectedRoute>
      } />
      <Route path="/result/:attemptId" element={
        <ProtectedRoute>
          <ResultPage />
        </ProtectedRoute>
      } />
      <Route path="/leaderboard/:examId" element={
        <ProtectedRoute>
          <Leaderboard />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/exams/create" element={
        <ProtectedRoute requireAdmin={true}>
          <CreateExam />
        </ProtectedRoute>
      } />
      <Route path="/admin/exams/edit/:id" element={
        <ProtectedRoute requireAdmin={true}>
          <CreateExam /> 
        </ProtectedRoute>
      } />
      <Route path="/admin/questions/:examId" element={
        <ProtectedRoute requireAdmin={true}>
          <ManageQuestions />
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute requireAdmin={true}>
          <StudentManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute requireAdmin={true}>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports/:attemptId" element={
        <ProtectedRoute requireAdmin={true}>
          <SubmissionDetail />
        </ProtectedRoute>
      } />

      {/* Shared Routes */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/help" element={
        <ProtectedRoute>
          <HelpSupport />
        </ProtectedRoute>
      } />

      {/* Redirects */}
      <Route path="/" element={<Navigate to={user ? (isAdmin ? "/admin" : "/dashboard") : "/login"} />} />
      <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen">Unauthorized Access</div>} />
      <Route path="*" element={<div className="flex items-center justify-center h-screen">404 Not Found</div>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

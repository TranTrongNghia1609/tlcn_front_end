import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/DashBoard';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import WorkSpace from "@/pages/WorkSpace";
import Problems from "@/pages/Problem";
import ContestDetail from "@/pages/ContestDetail";
import Contest from "@/pages/Contest";
import LandingPage from "@/pages/LandingPage";
import JoinClassroomPage from '@/components/classroom/JoinClassroomPage';
import StudentClassroomsPage from "@/pages/StudentClassroomsPage";
import StudentClassroomDetailPage from "@/pages/StudentClassroomDetailPage";
import { useAuth } from '@/context/AuthContext';
import Contests from "@/pages/Contests";
import EditProfilePage from "@/pages/EditProfilePage";
import LeaderBoard from "@/pages/LeaderBoard";

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/onboarding" element={<Home isShowOnboarding={true} />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Join Classroom Route */}
      <Route path="/join-classroom/:classCode/:token" element={<JoinClassroomPage />} />

      <Route
        path="/classrooms"
        element={
          <StudentRoute>
            <StudentClassroomsPage />
          </StudentRoute>
        }
      />

      <Route
        path="/classrooms/:classCode"
        element={
          <StudentRoute>
            <StudentClassroomDetailPage />
          </StudentRoute>
        }
      />

      <Route
        path="/classrooms/:classCode/problems/:id"
        element={
          <StudentRoute>
            <WorkSpace />
          </StudentRoute>
        }
      />

      {/* Problem Routes */}
      <Route path="/problemset" element={<Problems />} />
      <Route path="/problemset/problem/:id" element={<WorkSpace />} />
      <Route path="/problemset/problem/:id/solutions" element={<WorkSpace />} />
      <Route path="/problemset/problem/:id/solutions/:solutionId" element={<WorkSpace />} />
      <Route path="/problems/:id" element={<WorkSpace />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />

      {/* Profile Routes */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:username" element={<Profile />} />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
      <Route path="/problemset/problem/:id" element={<WorkSpace/>}/>
      <Route path="/problemset" element={<Problems/>}/>
      <Route path="/contests" element={<Contests/>}/>
      <Route path="/contest/:code" element={<ContestDetail/>}/>
      <Route path="/leaderboard" element={<LeaderBoard/>}/>
      <Route path="/contest/:code/problem/:id" element={<Contest/>}/>
    </Routes>
  );
}

export default AppRoutes;
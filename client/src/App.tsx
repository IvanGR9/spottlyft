import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext.js';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Leaderboard from './pages/Leaderboard.js';
import Workout from './pages/Workout.js';
import Profile from './pages/Profile.js';
import NotFound from './pages/NotFound.js';
import Login from './pages/Login.js';
import WorkoutDetail from './pages/WorkoutDetail.js';

function ProtectedLayout() {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-16 md:pl-56 md:pb-0">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/workout/:id" element={<WorkoutDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
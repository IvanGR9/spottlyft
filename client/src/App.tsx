import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext.js';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Leaderboard from './pages/Leaderboard.js';
import Workout from './pages/Workout.js';
import Profile from './pages/Profile.js';
import NotFound from './pages/NotFound.js';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0f0f0f] text-white pb-16 md:pt-14 md:pb-0">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
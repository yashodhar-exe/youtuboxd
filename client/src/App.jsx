import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';

// Pages
import VideoPage from './pages/Video/VideoPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Search from './pages/Search/Search';
import Videos from './pages/Videos/Videos';

// Placeholder Components for missing pages
const Placeholder = ({ title }) => (
  <div className="container mx-auto max-w-5xl px-4 pt-24 pb-12 min-h-[500px]">
    <h1 className="text-3xl font-bold text-white mb-6 font-serif">{title}</h1>
    <div className="bg-[#2c3440] p-8 rounded-lg text-center text-[#99aabb]">
      This page is currently a static scaffold and will be implemented later.
    </div>
  </div>
);

const Home = () => <Placeholder title="Welcome back to Youtuboxd." />;
const Profile = () => <Placeholder title="User Profile" />;
const Lists = () => <Placeholder title="Lists" />;
const Members = () => <Placeholder title="Members" />;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#14181c] text-[#99aabb]">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/video/:youtubeId" element={<VideoPage />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/lists" element={<Lists />} />
              <Route path="/members" element={<Members />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

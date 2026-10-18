import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, User, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/Youtuboxd.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isHomePage = location.pathname === '/';
  const isVideoPage = location.pathname.startsWith('/video/');

  return (
    <header className={`${isHomePage ? 'bg-[#14181c]' : 'absolute top-0 w-full z-50 bg-transparent'} py-4 text-sm font-semibold tracking-wide`}>
      <div className="container mx-auto max-w-5xl px-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center">
          <img src={logo} alt="Youtuboxd" className="h-14 w-auto object-contain" />
        </Link>

        {/* Right side navigation area */}
        <div className={`flex items-center ${isVideoPage ? 'text-[#eef0f2]' : 'text-[#99aabb]'} gap-5`}>

          {user && (
            <div className="flex items-center">
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors uppercase font-graphik-semibold text-[13px] tracking-wider">
                <div className="w-6 h-6 rounded-full bg-[#445566] overflow-hidden flex items-center justify-center text-white border border-[#445566]">
                  {user.avatar_url ? <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" /> : <User size={14} />}
                </div>
                <ChevronDown size={14} className="opacity-70" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-5 uppercase text-[13px] font-graphik-semibold tracking-widest">
            {!user && (
              <>
                <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
                <Link to="/register" className="hover:text-white transition-colors">Create Account</Link>
              </>
            )}

            <Link to="/videos" className="hover:text-white transition-colors">Videos</Link>
            <Link to="/lists" className="hover:text-white transition-colors">Lists</Link>
            <Link to="/members" className="hover:text-white transition-colors">Members</Link>

            <div className="flex items-center h-7">
              {isSearchOpen && (
                <button type="button" onClick={() => setIsSearchOpen(false)} className="text-[#667788] hover:text-white mr-3 flex-shrink-0">
                  <X size={16} strokeWidth={2.5} />
                </button>
              )}

              <div
                className={`flex justify-end transition-[width] duration-300 ease-[cubic-bezier(0.1,1,0.2,1)] overflow-hidden ${isSearchOpen ? 'w-[140px]' : 'w-0'}`}
              >
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-full px-2 h-7 text-[#2c3440] w-[140px] flex-shrink-0">
                  <input
                    type="text"
                    ref={searchInputRef}
                    className="bg-transparent border-none focus:outline-none w-full text-[13px] leading-tight px-1 font-normal font-graphik tracking-normal"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="text-[#667788] hover:text-black mr-1 flex-shrink-0">
                    <Search size={14} strokeWidth={2.5} />
                  </button>
                </form>
              </div>

              {!isSearchOpen && (
                <button onClick={() => setIsSearchOpen(true)} className="hover:text-white transition-colors flex items-center h-full transform -translate-y-[1px]">
                  <Search size={16} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;

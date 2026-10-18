import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 pt-24 pb-16 min-h-[600px] flex items-center justify-center">
      <div className="bg-[#2c3440] p-8 rounded-lg shadow-2xl border border-[#445566] w-full">
        <h1 className="text-3xl font-bold text-white mb-6 font-serif text-center">Sign In</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#99aabb] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#14181c] border border-[#445566] rounded px-3 py-2 text-white focus:outline-none focus:border-[#00e054] transition-colors"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#99aabb] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#14181c] border border-[#445566] rounded px-3 py-2 text-white focus:outline-none focus:border-[#00e054] transition-colors"
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#00e054] hover:bg-[#00c040] text-black font-bold uppercase tracking-wider py-2.5 rounded mt-4 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#99aabb]">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:text-[#00e054] transition-colors">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

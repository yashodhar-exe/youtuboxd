import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/videos/search?q=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-24 pb-8">
      <h1 className="text-2xl font-bold mb-6 text-white border-b border-[#2c3440] pb-2">
        Search Results for "{query}"
      </h1>

      {loading ? (
        <div className="text-[#99aabb]">Searching...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((video) => (
            <Link to={`/video/${video.youtube_id}`} key={video.id} className="group cursor-pointer">
              <div className="relative aspect-video rounded overflow-hidden border border-[#2c3440] transition-colors">
                <div 
                  className="w-full h-full bg-cover bg-center opacity-80"
                  style={{ backgroundImage: `url(${video.thumbnail_url})` }}
                />
              </div>
              <h3 className="text-sm font-semibold mt-2 text-white line-clamp-2 leading-tight group-hover:text-[#00e054] transition-colors">
                {video.title}
              </h3>
              <p className="text-xs text-[#99aabb] mt-1 line-clamp-1">{video.channel_title}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-[#99aabb]">No results found. Try a different search term.</div>
      )}
    </div>
  );
};

export default Search;

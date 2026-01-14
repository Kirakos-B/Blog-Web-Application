import { useEffect, useState } from "react";
import API from "../api";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/posts")
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, []);

  // Filter posts based on the search query
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="loader">Loading posts...</div>;

  return (
    <div className="home-page">
      {/* Search Bar Section */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="posts-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post._id} {...post} />)
        ) : (
          <div className="no-results">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : "No blog posts found."}
          </div>
        )}
      </div>
    </div>
  );
}

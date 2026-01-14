import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api";
import { UserContext } from "../context/UserContext";
import { format } from "date-fns"; // Optional but recommended for better dates

export default function PostDetails() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then((res) => {
        setPostInfo(res.data);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
      });
  }, [id]);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        await API.delete(`/posts/${id}`);
        navigate("/"); // Redirect to home after deletion
      } catch (err) {
        console.error(err); // <--- Add this line to use the variable
        alert("Failed to delete post. Please try again.");
      }
    }
  }

  if (!postInfo) return <div className="loader">Loading...</div>;

  // Clean the image path for display
  const imageUrl = `http://localhost:5000/${postInfo.coverImage.replace(
    /\\/g,
    "/"
  )}`;

  return (
    <main className="post-page">
      <div className="post-header">
        <h1>{postInfo.title}</h1>
        <div className="post-meta">
          <time>{format(new Date(postInfo.createdAt), "MMMM d, yyyy")}</time>
          <span className="author">by Admin</span>
        </div>

        {/* Admin Controls: Only visible if logged in */}
        {userInfo && (
          <div className="admin-actions">
            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit Post
            </Link>
            <button className="delete-btn" onClick={handleDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="post-image">
        <img src={imageUrl} alt={postInfo.title} />
      </div>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </main>
  );
}

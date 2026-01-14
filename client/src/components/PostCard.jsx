import { Link } from "react-router-dom";

export default function PostCard({
  _id,
  title,
  summary,
  coverImage,
  createdAt,
}) {
  // Ensure the image path is correct (connecting to backend)
  const imageUrl = `http://localhost:5000/${coverImage.replace(/\\/g, "/")}`;

  return (
    <div className="post-card">
      <div className="image-container">
        <Link to={`/post/${_id}`}>
          <img src={imageUrl} alt={title} />
        </Link>
      </div>
      <div className="content-preview">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <span className="author">Admin</span>
          <time>{new Date(createdAt).toLocaleDateString()}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}

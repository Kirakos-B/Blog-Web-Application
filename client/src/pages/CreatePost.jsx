import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // The editor's theme
import API from "../api";

// Editor modules configuration (Toolbar options)
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  async function createNewPost(e) {
    e.preventDefault();

    // We use FormData for file uploads
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", file); // 'file' matches the name in your backend multer config

    try {
      await API.post("/posts", data);
      navigate("/"); // Redirect to home after success
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Are you logged in?");
    }
  }

  return (
    <div className="create-post-form">
      <form onSubmit={createNewPost}>
        <h1>Create New Blog Post</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <div className="editor-container">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
          />
        </div>

        <button style={{ marginTop: "20px" }}>Publish Post</button>
      </form>
    </div>
  );
}

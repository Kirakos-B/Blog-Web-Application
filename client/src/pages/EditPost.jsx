import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import API from "../api";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // 1. Fetch existing post data on load
  useEffect(() => {
    API.get(`/posts/${id}`).then((response) => {
      setTitle(response.data.title);
      setSummary(response.data.summary);
      setContent(response.data.content);
    });
  }, [id]);

  async function updatePost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (file) data.set("file", file); // Only send file if a new one is selected

    try {
      // We use the PUT method we created in the backend
      await API.put(`/posts/${id}`, data);
      navigate(`/post/${id}`); // Go back to the post view
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  return (
    <div className="create-post-form">
      <form onSubmit={updatePost}>
        <h1>Edit Post</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <div className="editor-container">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
          />
        </div>

        <button style={{ marginTop: "20px" }}>Update Post</button>
      </form>
    </div>
  );
}

const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/authMiddleware");
const fs = require("fs"); // Used to delete old images when updating/deleting

// --- PUBLIC ROUTES (Readers) ---

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// GET a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");
    res.json(post);
  } catch (error) {
    res.status(500).json("Error fetching post");
  }
});

// --- PROTECTED ROUTES (Admin Only) ---

// CREATE a new post
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const newPost = await Post.create({
      title,
      summary,
      content,
      coverImage: req.file ? req.file.path : "",
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
});

// UPDATE a post
router.put("/:id", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json("Post not found");

    // Inside your PUT route
    const updateData = { title, summary, content };
    if (req.file) {
      updateData.coverImage = req.file.path; // Update only if new file exists
    }
    await Post.findByIdAndUpdate(id, updateData);

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json("Error updating post");
  }
});

// DELETE a post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    // Remove the image file from server if it exists
    if (post.coverImage && fs.existsSync(post.coverImage)) {
      fs.unlinkSync(post.coverImage);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json("Error deleting post");
  }
});

module.exports = router;

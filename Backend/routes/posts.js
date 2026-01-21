const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const upload = require("../middleware/upload");
const fs = require("fs");

// FIX 1: Destructure the middleware imports
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

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
// FIX 2: Added isAdmin middleware
// CREATE a new post
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, summary, content } = req.body;

      // We add 'author' here using the ID from the decoded JWT token
      const newPost = await Post.create({
        title,
        summary,
        content,
        coverImage: req.file ? req.file.path : "",
        author: req.user.id, // <--- ADD THIS LINE
      });

      res.status(201).json(newPost);
    } catch (error) {
      console.error("POST CREATION ERROR:", error); // Always log to see details in terminal
      res
        .status(500)
        .json({ message: "Error creating post", error: error.message });
    }
  }
);

// UPDATE a post
// FIX 3: Added isAdmin and fixed the 'id' variable reference
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, summary, content } = req.body;
      const post = await Post.findById(req.params.id);

      if (!post) return res.status(404).json("Post not found");

      const updateData = { title, summary, content };
      if (req.file) {
        // If there was an old image, delete it to save space
        if (post.coverImage && fs.existsSync(post.coverImage)) {
          fs.unlinkSync(post.coverImage);
        }
        updateData.coverImage = req.file.path;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id, // Changed from 'id' to 'req.params.id'
        updateData,
        { new: true }
      );
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json("Error updating post");
    }
  }
);

// DELETE a post
// FIX 4: Added isAdmin
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

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

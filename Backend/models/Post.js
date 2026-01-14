const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    summary: {
      type: String,
      required: [true, "Please add a summary"],
      maxlength: [300, "Summary is too long"],
    },
    content: {
      type: String,
      required: [true, "Blog content cannot be empty"],
    },
    coverImage: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links the post to the Admin user
    },
  },
  { timestamps: true }
);

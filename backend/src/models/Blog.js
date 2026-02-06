const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: { type: String },
    excerpt: { type: String },
    author: { type: String },
    category: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
    isPopular: { type: Boolean, default: false },
    publishedAt: { type: Date },
}, {
    timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;

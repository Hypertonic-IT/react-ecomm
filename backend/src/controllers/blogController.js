const Blog = require('../models/Blog');

const createBlog = async (req, res) => {
    try {
        const { title, slug, content, image, excerpt, category, tags, status, author } = req.body;

        const blog = new Blog({
            title,
            slug,
            content,
            image,
            excerpt,
            category,
            tags,
            status,
            author,
            isPopular: req.body.isPopular || false,
            publishedAt: status === 'published' ? new Date() : null
        });

        const createdBlog = await blog.save();
        res.status(201).json(createdBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getBlogs = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        // Add filter for status if provided (e.g. ?status=published)
        if (req.query.status) {
            keyword.status = req.query.status;
        }

        if (req.query.isPopular) {
            keyword.isPopular = req.query.isPopular === 'true';
        }

        const count = await Blog.countDocuments({ ...keyword });
        const blogs = await Blog.find({ ...keyword })
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ blogs, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { title, slug, content, image, excerpt, category, tags, status, author } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (blog) {
            blog.title = title || blog.title;
            blog.slug = slug || blog.slug;
            blog.content = content || blog.content;
            blog.image = image || blog.image;
            blog.excerpt = excerpt || blog.excerpt;
            blog.category = category || blog.category;
            blog.tags = tags || blog.tags;
            blog.status = status || blog.status;
            blog.author = author || blog.author;
            if (req.body.isPopular !== undefined) {
                blog.isPopular = req.body.isPopular;
            }

            if (status === 'published' && !blog.publishedAt) {
                blog.publishedAt = new Date();
            }

            const updatedBlog = await blog.save();
            res.json(updatedBlog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Blog not found' });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            await blog.deleteOne();
            res.json({ message: 'Blog removed' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBlog,
    getBlogs,
    getBlogBySlug,
    getBlogById,
    updateBlog,
    deleteBlog
};

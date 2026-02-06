const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const Blog = require('./src/models/Blog');

dotenv.config();

const blogs = [
    {
        title: 'The Future of Fashion: Tech Integration',
        content: '<p>Technology is revolutionizing the fashion industry with smart fabrics, AI-driven trends, and virtual fitting rooms. As we move significantly towards a digital age, the boundaries between physical and digital fashion are blurring.</p><p>From 3D printed shoes to garments that change color based on emotion, the possibilities are endless. This integration not only enhances aesthetics but also functionality, paving the way for a more sustainable and personalized fashion ecosystem.</p>',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
        category: 'Technology',
        status: 'published',
        author: 'Admin',
        isPopular: true
    },
    {
        title: 'Minimalist Wardrobe Essentials',
        content: '<p>Building a capsule wardrobe is key to sustainable fashion. It involves clearing the clutter and focusing on high-quality, versatile pieces that can be mixed and matched effortlessly.</p><p>Key items include a classic white tee, well-fitted jeans, a tailored blazer, and comfortable sneakers. By investing in these staples, you not only save time getting dressed but also reduce your environmental footprint.</p>',
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
        category: 'Fashion',
        status: 'published',
        author: 'Sarah J.',
        isPopular: true
    },
    {
        title: 'Ultimate Skincare Routine for Glowing Skin',
        content: '<p>Achieving glowing skin requires consistency and the right products. Start with a gentle cleanser to remove impurities without stripping natural oils.</p><p>Follow up with a hydrating toner, a vitamin C serum for brightness, and a moisturizer suited to your skin type. Don\'t forget sunscreen during the day to prevent premature aging!</p>',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        category: 'Beauty',
        status: 'published',
        author: 'Dr. Glow',
        isPopular: true
    },
    {
        title: 'Top 10 Accessories to Elevate Your Look',
        content: '<p>Accessories can make or break an outfit. A simple dress can be transformed into a chic ensemble with the right statement necklace or a pair of bold earrings.</p><p>This season, we are seeing a resurgence of chunky gold jewelry, oversized sunglasses, and structured handbags. Learn how to pair these items to create a cohesive look.</p>',
        image: 'https://images.unsplash.com/photo-1512163143273-bde0e3cc5409?w=800&q=80',
        category: 'Accessories',
        status: 'published',
        author: 'Style Icon',
        isPopular: true
    },
    {
        title: 'Sustainable Living: A Guide to Eco-Friendly Choices',
        content: '<p>Sustainability is more than just a buzzword; it\'s a lifestyle. From reducing plastic usage to supporting ethical brands, every small step counts.</p><p>Consider switching to reusable bags, water bottles, and bamboo toothbrushes. Support local artisans and brands that prioritize eco-friendly practices.</p>',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
        category: 'Lifestyle',
        status: 'published',
        author: 'Eco Warrior',
        isPopular: false
    },
    {
        title: 'Healthy Eating Habits for a Busy Life',
        content: '<p>Maintaining a healthy diet amidst a busy schedule can be challenging. Meal prepping is a game-changer. Dedicate a few hours on Sunday to chop vegetables and cook grains.</p><p>Focus on whole foods, incorporate plenty of fruits and vegetables, and stay hydrated. Remember, balance is key!</p>',
        image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
        category: 'Lifestyle',
        status: 'published',
        author: 'Nutritionist Anne',
        isPopular: false
    },
    {
        title: 'The Digital Nomad Lifestyle: Pros and Cons',
        content: '<p>Working remotely while traveling the world is a dream for many. The freedom to explore new cultures while earning a living is unparalleled.</p><p>However, it comes with challenges like unstable internet, loneliness, and maintaining productivity. Here are tips to navigate the digital nomad life successfully.</p>',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
        category: 'Technology',
        status: 'published',
        author: 'Nomad Dan',
        isPopular: false
    },
    {
        title: 'Makeup Trends 2026: Bold and Beautiful',
        content: '<p>2026 is all about bold expression. Graphic eyeliners, vibrant eyeshadows, and glossy lips are taking center stage.</p><p>Don\'t be afraid to experiment with color. Whether it\'s a neon liner or a classic red lip, let your makeup reflect your personality.</p>',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
        category: 'Beauty',
        status: 'published',
        author: 'MUA Lisa',
        isPopular: false
    },
    {
        title: 'Streetwear Evolution: From Niche to Mainstream',
        content: '<p>Streetwear has evolved from skate culture to high fashion runways. Brands like Supreme and Off-White have redefined luxury by blending comfort with exclusivity.</p><p>Explore the history of streetwear and how it continues to influence modern fashion trends.</p>',
        image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80',
        category: 'Fashion',
        status: 'published',
        author: 'Hype Beast',
        isPopular: false
    },
    {
        title: 'Luxury Watches: A Buyer\'s Guide',
        content: '<p>A luxury watch is a timeless investment. Understanding the craftsmanship, movement, and heritage of brands like Rolex and Patek Philippe is essential.</p><p>Whether you prefer a classic dress watch or a rugged diver, find a timepiece that suits your style and holds its value.</p>',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
        category: 'Accessories',
        status: 'published',
        author: 'Watch Expert',
        isPopular: false
    }
];

const seedBlogs = async () => {
    try {
        await connectDB();

        console.log('Clearing existing blogs...');
        await Blog.deleteMany({});

        console.log('Seeding blogs...');

        for (const blog of blogs) {
            const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await Blog.create({
                ...blog,
                slug,
                publishedAt: new Date(),
                tags: [blog.category.toLowerCase(), 'trends', '2026']
            });
        }

        console.log('Blogs seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding blogs:', error);
        process.exit(1);
    }
};

seedBlogs();

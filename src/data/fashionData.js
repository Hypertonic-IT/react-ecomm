
export const categories = [
    {
        id: 'men',
        title: 'Men',
        image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=500&q=80',
        columns: [
            {
                title: 'Top Wear',
                items: ['T-Shirts', 'Shirts', 'Hoodies', 'Jackets']
            },
            {
                title: 'Bottom Wear',
                items: ['Jeans', 'Trousers', 'Shorts', 'Joggers']
            },
            {
                title: 'Footwear',
                items: ['Sneakers', 'Formal Shoes', 'Boots', 'Sandals']
            }
        ]
    },
    {
        id: 'women',
        title: 'Women',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80',
        columns: [
            {
                title: 'Western Wear',
                items: ['Dresses', 'Tops', 'Jeans', 'Skirts']
            },
            {
                title: 'Ethnic Wear',
                items: ['Kurtas', 'Sarees', 'Lehengas']
            },
            {
                title: 'Footwear',
                items: ['Heels', 'Flats', 'Boots']
            }
        ]
    },
    {
        id: 'kids',
        title: 'Kids',
        image: 'https://images.unsplash.com/photo-1519238263496-61437a8ac686?w=500&q=80',
        columns: [
            {
                title: 'Boys',
                items: ['T-Shirts', 'Shirts', 'Jeans']
            },
            {
                title: 'Girls',
                items: ['Dresses', 'Tops', 'Skirts']
            }
        ]
    },
    // Added specific category entries so admin "Sync Defaults" can upload them with images
    { id: 'shirts', title: 'Shirts', image: 'https://images.unsplash.com/photo-1596755095514-ce00c3b75620?w=500&q=80' },
    { id: 'sweaters', title: 'Sweaters', image: 'https://images.unsplash.com/photo-1614831623868-6c845b4fc231?w=500&q=80' },
    { id: 'skirts', title: 'Skirts', image: 'https://images.unsplash.com/photo-1583496661160-c2561910d68f?w=500&q=80' },
    { id: 'accessories', title: 'Accessories', image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80', isLink: true },
    { id: 'footwear', title: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', isLink: true },
    { id: 'new', title: 'New Arrivals', isLink: true },
    { id: 'sale', title: 'Sale', isLink: true, isHighlight: true }
];

export const heroSlides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        title: "New Season Arrivals",
        subtitle: "Fashion for the Future",
        cta: "Explore Now",
        link: "/products?filter=new"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2670&auto=format&fit=crop",
        title: "Men's Premium Collection",
        subtitle: "Sophisticated Style",
        cta: "Shop Men",
        link: "/products?category=Men"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1549570652-9732dc79495c?q=80&w=2574&auto=format&fit=crop",
        title: "Women's Exclusive",
        subtitle: "Elegance Redefined",
        cta: "Shop Women",
        link: "/products?category=Women"
    }
];

export const products = [
    // 10 Men
    { id: 201, name: "Classic Denim Jacket", price: 2499, category: "Men", image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&q=80", isTrending: true, rating: 4.5 },
    { id: 202, name: "Urban Street Hoodie", price: 2999, category: "Men", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80", isNew: true, rating: 4.2 },
    { id: 203, name: "Slim Fit Chinos", price: 1299, category: "Men", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80", isTrending: true, rating: 4.4 },
    { id: 204, name: "Striped Cotton Shirt", price: 999, category: "Men", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80", rating: 4.3 },
    { id: 205, name: "Men's Polo Shirt", price: 799, category: "Men", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80", rating: 4.3 },
    { id: 206, name: "Men's Classic Watch", price: 8999, category: "Men", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", isTrending: true, rating: 4.9 },
    { id: 207, name: "Casual Linen Shirt", price: 1199, category: "Men", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80", rating: 4.1 },
    { id: 208, name: "Men's Runner Sneakers", price: 3499, category: "Men", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", isTrending: true, rating: 4.7 },
    { id: 209, name: "Denim Work Jacket", price: 2599, category: "Men", image: "https://images.unsplash.com/photo-1472437774355-71ab6752b434?w=500&q=80", rating: 4.2 },
    { id: 210, name: "Tailored Blazer", price: 4999, category: "Men", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80", rating: 4.6 },

    // Additional 10 Men products (211-220)
    { id: 211, name: "Performance Polo Tee", price: 899, category: "Men", image: "https://images.unsplash.com/photo-1520975914050-63b4c4f4b5ef?w=500&q=80", rating: 4.1 },
    { id: 212, name: "Fleece Zip-Up Hoodie", price: 1799, category: "Men", image: "https://images.unsplash.com/photo-1600180758890-9f4d4b7f4f2b?w=500&q=80", rating: 4.3 },
    { id: 213, name: "Chino Shorts", price: 699, category: "Men", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&q=80", rating: 4.0 },
    { id: 214, name: "Military Field Jacket", price: 3499, category: "Men", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80", rating: 4.4 },
    { id: 215, name: "Slim Fit Dress Shirt", price: 1299, category: "Men", image: "https://images.unsplash.com/photo-1520975914050-63b4c4f4b5ef?w=500&q=80", rating: 4.2 },
    { id: 216, name: "Lightweight Windbreaker", price: 2199, category: "Men", image: "https://images.unsplash.com/photo-1503342217505-b0a15a3f3e6a?w=500&q=80", rating: 4.0 },
    { id: 217, name: "Corduroy Overshirt", price: 1599, category: "Men", image: "https://images.unsplash.com/photo-1516054714214-46b6d2f7f5b4?w=500&q=80", rating: 4.1 },
    { id: 218, name: "Merino Crew Sweater", price: 2499, category: "Men", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80", rating: 4.5 },
    { id: 219, name: "Trail Running Shoes", price: 3999, category: "Men", image: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=500&q=80", rating: 4.6 },
    { id: 220, name: "Everyday Leather Belt", price: 599, category: "Men", image: "https://images.unsplash.com/photo-1516822003754-cca485356ecb?w=500&q=80", rating: 4.2 },

    // 10 Women
    { id: 301, name: "Floral Summer Dress", price: 1499, category: "Women", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80", isSale: true, isTrending: true, rating: 4.8 },
    { id: 302, name: "Elegant Evening Gown", price: 5999, category: "Women", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80", isNew: true, rating: 4.8 },
    { id: 303, name: "Denim Shorts", price: 899, category: "Women", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80", isSale: true, rating: 4.5 },
    { id: 304, name: "Yoga Leggings", price: 699, category: "Women", image: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=500&q=80", rating: 4.5 },
    { id: 305, name: "Chiffon Blouse", price: 1299, category: "Women", image: "https://images.unsplash.com/photo-1520975914050-63b4c4f4b5ef?w=500&q=80", rating: 4.3 },
    { id: 306, name: "Pleated Skirt", price: 1199, category: "Women", image: "https://images.unsplash.com/photo-1583496661160-c2561910d68f?w=500&q=80", rating: 4.4 },
    { id: 307, name: "Women's Ankle Boots", price: 2999, category: "Women", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80", isNew: true, rating: 4.7 },
    { id: 308, name: "Boho Maxi Dress", price: 1999, category: "Women", image: "https://images.unsplash.com/photo-1495121605193-b116b5b09f54?w=500&q=80", rating: 4.6 },
    { id: 309, name: "Silk Scarf", price: 599, category: "Women", image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4faae?w=500&q=80", rating: 4.2 },
    { id: 310, name: "Casual Wrap Top", price: 899, category: "Women", image: "https://images.unsplash.com/photo-1530845641896-7b8bfb8a2e94?w=500&q=80", rating: 4.1 }
];

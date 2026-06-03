
export const categories = [
    {
        id: 'men',
        title: 'Men',
        image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=800',
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
        image: 'https://images.unsplash.com/photo-1524041255072-7da0525d6b34?auto=format&fit=crop&q=80&w=800',
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
    }
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
    { id: 201, name: "Casual Denim Jacket", price: 1499, category: "Men", image: "/uploads/products/casual-denim-jacket-1778505001762.png", isTrending: true, rating: 4.5 },
    { id: 202, name: "Casual Leather Jacket", price: 1499, category: "Men", image: "/uploads/products/casual-leather-jacket-1778504998224.png", isTrending: true, rating: 4.4 },
    { id: 203, name: "Casual Wool Hoodie", price: 1299, category: "Men", image: "/uploads/products/casual-wool-hoodie-1778505039962.png", rating: 4.3 },
    { id: 204, name: "Classic Denim Hoodie", price: 1399, category: "Men", image: "/uploads/products/classic-denim-hoodie-1778505018510.png", isNew: true, rating: 4.2 },
    { id: 205, name: "Casual Polyester Shirt", price: 999, category: "Men", image: "/uploads/products/casual-polyester-shirt-1778504984888.png", rating: 4.3 },
    { id: 206, name: "Classic Linen Shirt", price: 1299, category: "Men", image: "/uploads/products/classic-linen-shirt-1778505023912.png", rating: 4.1 },
    { id: 207, name: "Casual Cotton T-Shirt", price: 799, category: "Men", image: "/uploads/products/casual-cotton-t-shirt-1778505058330.png", rating: 4.3 },
    { id: 208, name: "Sporty Cotton T-Shirt", price: 899, category: "Men", image: "/uploads/products/sporty-cotton-t-shirt-1778505113352.png", rating: 4.1 },
    { id: 209, name: "Casual Denim Jeans", price: 1299, category: "Men", image: "/uploads/products/casual-denim-jeans-1778505085778.png", isTrending: true, rating: 4.4 },
    { id: 210, name: "Classic Denim Jeans", price: 1399, category: "Men", image: "/uploads/products/classic-denim-jeans-1778505113230.png", rating: 4.2 },

    // 10 Women
    { id: 301, name: "Casual Cotton Dress", price: 1499, salePrice: 1299, category: "Women", image: "/uploads/products/casual-cotton-dress-1778505151664.png", isTrending: true, rating: 4.8 },
    { id: 302, name: "Casual Linen Dress", price: 1399, category: "Women", image: "/uploads/products/casual-linen-dress-1778505145682.png", rating: 4.6 },
    { id: 303, name: "Casual Leather Top", price: 899, category: "Women", image: "/uploads/products/casual-leather-top-1778505164948.png", rating: 4.1 },
    { id: 304, name: "Cozy Leather Top", price: 999, category: "Women", image: "/uploads/products/cozy-leather-top-1778505090497.png", rating: 4.2 },
    { id: 305, name: "Casual Denim Sweater", price: 1299, category: "Women", image: "/uploads/products/casual-denim-sweater-1778505158414.png", rating: 4.3 },
    { id: 306, name: "Casual Linen Sweater", price: 1199, category: "Women", image: "/uploads/products/casual-linen-sweater-1778505148693.png", rating: 4.4 },
    { id: 307, name: "Casual Wool Skirt", price: 1199, category: "Women", image: "/uploads/products/casual-wool-skirt-1778505178057.png", rating: 4.4 },
    { id: 308, name: "Classic Denim Skirt", price: 1299, category: "Women", image: "/uploads/products/classic-denim-skirt-1778505198272.png", rating: 4.5 },
    { id: 309, name: "Casual Cotton Jeans", price: 1099, category: "Women", image: "/uploads/products/casual-cotton-jeans-1778505009618.png", rating: 4.3 },
    { id: 310, name: "Cozy Cotton Jeans", price: 1199, category: "Women", image: "/uploads/products/cozy-cotton-jeans-1778505111247.png", rating: 4.4 }
];


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
    { id: 'accessories', title: 'Accessories', image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80', isLink: true },
    { id: 'footwear', title: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', isLink: true },
    { id: 'new', title: 'New Arrivals', isLink: true },
    { id: 'sale', title: 'Sale', isLink: true, isHighlight: true }
];

export const heroSlides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        title: "New Summer Collection",
        subtitle: "Up to 40% Off",
        cta: "Shop Now",
        link: "/products?filter=summer"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1490481651871-646860529625?q=80&w=2070&auto=format&fit=crop",
        title: "Men's Premium Suits",
        subtitle: "Elevate Your Style",
        cta: "Shop Men",
        link: "/products?category=Men"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
        title: "Women's Ethnic Wear",
        subtitle: "Elegant & Traditional",
        cta: "Shop Women",
        link: "/products?category=Women"
    }
];

export const products = [
    {
        id: 101,
        name: "Classic Denim Jacket",
        price: 49.99,
        category: "Men",
        image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&q=80",
        isNew: true,
        isTrending: true,
        rating: 4.5
    },
    {
        id: 102,
        name: "Floral Summer Dress",
        price: 35.50,
        oldPrice: 50.00,
        category: "Women",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80",
        isSale: true,
        isTrending: true,
        rating: 4.8
    },
    {
        id: 103,
        name: "Urban Street Hoodie",
        price: 55.00,
        category: "Men",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
        isNew: true,
        rating: 4.2
    },
    {
        id: 104,
        name: "Leather Crossbody Bag",
        price: 89.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
        isTrending: true,
        rating: 4.7
    },
    {
        id: 105,
        name: "Kids' Cotton T-Shirt",
        price: 15.00,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1519238263496-61437a8ac686?w=500&q=80",
        rating: 4.6
    },
    {
        id: 106,
        name: "Slim Fit Chinos",
        price: 39.99,
        category: "Men",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
        isTrending: true,
        rating: 4.4
    },
    {
        id: 107,
        name: "Summer Straw Hat",
        price: 24.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=500&q=80",
        isNew: true,
        rating: 4.3
    },
    {
        id: 108,
        name: "Running Sneakers",
        price: 79.99,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        isTrending: true,
        rating: 4.9
    },
    {
        id: 109,
        name: "Elegant Evening Gown",
        price: 120.00,
        category: "Women",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80",
        isNew: true,
        rating: 4.8
    },
    {
        id: 110,
        name: "Leather Boots",
        price: 110.00,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?w=500&q=80",
        rating: 4.6
    },
    {
        id: 111,
        name: "Men's Classic Watch",
        price: 199.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        isTrending: true,
        rating: 4.9
    },
    {
        id: 112,
        name: "Striped Cotton Shirt",
        price: 34.50,
        category: "Men",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
        rating: 4.3
    },
    {
        id: 113,
        name: "Denim Shorts",
        price: 29.99,
        category: "Women",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
        isSale: true,
        rating: 4.5
    },
    {
        id: 114,
        name: "Aviator Sunglasses",
        price: 99.00,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
        isTrending: true,
        rating: 4.7
    },
    {
        id: 115,
        name: "Patterned Scarf",
        price: 19.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4faae?w=500&q=80",
        rating: 4.2
    },
    {
        id: 116,
        name: "Kids' Denim Jacket",
        price: 45.00,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1622290291314-e67306341f22?w=500&q=80",
        isNew: true,
        rating: 4.6
    },
    {
        id: 117,
        name: "Wireless Headphones",
        price: 149.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        isTrending: true,
        rating: 4.8
    },
    {
        id: 118,
        name: "Yoga Leggings",
        price: 28.00,
        category: "Women",
        image: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=500&q=80",
        rating: 4.5
    },
    {
        id: 119,
        name: "Men's Polo Shirt",
        price: 32.00,
        category: "Men",
        image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80",
        rating: 4.3
    },
    {
        id: 120,
        name: "Ankle Boots",
        price: 85.00,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80",
        isNew: true,
        rating: 4.7
    }
];

const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class ImageService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }
    this.uploadDir = path.join(__dirname, '../../uploads/products');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async generateProductImage(productName, category, type) {
    const fileName = `${productName.toLowerCase().replace(/ /g, '-')}-${Date.now()}.png`;
    const filePath = path.join(this.uploadDir, fileName);
    const publicPath = `/uploads/products/${fileName}`;

    if (this.apiKey) {
      try {
        console.log(`Attempting Gemini image generation for: ${productName}`);
        const response = await this.ai.models.generateImages({
          model: 'imagen-4.0-generate-001', 
          prompt: `Professional eCommerce studio photography of ${productName}, a ${category} ${type}. High resolution, clean white background, commercial lighting, authentic fabric texture.`,
          config: {
            numberOfImages: 1,
          },
        });

        if (response && response.images && response.images[0]) {
          const base64Data = response.images[0].base64;
          fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
          console.log(`Successfully generated image with Gemini: ${publicPath}`);
          return publicPath;
        }
      } catch (error) {
        console.warn(`Gemini image generation failed: ${error.message}. Falling back to curated source.`);
      }
    }

    // Fallback: Curated Unsplash IDs or high-quality Unsplash search
    // Since we want high quality, we'll use a curated map of IDs
    // For simplicity in this service, we'll use a high-quality keyword search
    // but in seed.js we'll stick to the IDs I already found.
    const keywords = `${category},${type},fashion,studio`.toLowerCase();
    const fallbackUrl = `https://loremflickr.com/800/800/${keywords}?lock=${Math.floor(Math.random() * 1000000)}`;
    
    // Download and save locally to ensure consistency
    try {
      const response = await axios({
        url: fallbackUrl,
        method: 'GET',
        responseType: 'arraybuffer'
      });
      fs.writeFileSync(filePath, response.data);
      return publicPath;
    } catch (err) {
      console.error('Fallback image download failed:', err.message);
      return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'; // Final safety fallback
    }
  }
}

module.exports = new ImageService();

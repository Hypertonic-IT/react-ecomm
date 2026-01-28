const app = require('./src/app');
const cron = require('node-cron');
const { cleanupExpiredReservations } = require('./src/controllers/InventoryController');
require('dotenv').config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Cron job: Cleanup expired cart reservations every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    console.log('⏰ Running inventory reservation cleanup...');
    try {
        const cleaned = await cleanupExpiredReservations();
        if (cleaned > 0) {
            console.log(`✅ Cleaned up ${cleaned} expired reservations`);
        }
    } catch (error) {
        console.error('❌ Cleanup error:', error);
    }
});

console.log('📅 Inventory cleanup cron job scheduled (every 5 minutes)');

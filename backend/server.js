const app = require('./src/app');
const cron = require('node-cron');
const mongoose = require('mongoose');
const { cleanupExpiredReservations } = require('./src/controllers/InventoryController');
require('dotenv').config();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Cron job: Cleanup expired cart reservations every 5 minutes
const cleanupJob = cron.schedule('*/5 * * * *', async () => {
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

// --- Graceful Shutdown Logic ---
const gracefulShutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}, starting graceful shutdown...`);

    // 1. Stop cron jobs
    if (cleanupJob) {
        cleanupJob.stop();
        console.log('🛑 Cron jobs stopped.');
    }

    // 2. Close HTTP Server
    server.close(async () => {
        console.log('🛑 HTTP server closed.');

        // 3. Close MongoDB Connection
        try {
            await mongoose.connection.close(false);
            console.log('🛑 MongoDB connection closed.');
            process.exit(0);
        } catch (err) {
            console.error('❌ Error during Mongoose connection closure:', err);
            process.exit(1);
        }
    });

    // Forcefully shut down after 10 seconds if not already closed
    setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

// Listen for Nodemon restart signal
process.once('SIGUSR2', async () => {
    console.log('\n🛑 Nodemon restart (SIGUSR2) detected...');
    if (cleanupJob) cleanupJob.stop();
    server.close(async () => {
        await mongoose.connection.close(false);
        process.kill(process.pid, 'SIGUSR2');
    });
});

// Listen for termination signals from OS 
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// Trigger nodemon restart
// Trigger again

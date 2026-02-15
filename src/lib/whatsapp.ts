import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { getStockQuote } from './stock';
import { getCompanyNews } from './news';
import { analyzeStock } from './ai';

// Global client instance handling for Next.js HMR
const globalForWhatsApp = globalThis as unknown as {
    whatsappClient: Client | undefined;
    whatsappInitializing: boolean | undefined;
    whatsappReady: boolean | undefined;
};

let client = globalForWhatsApp.whatsappClient || null;
let isInitializing = globalForWhatsApp.whatsappInitializing || false;
let isReady = globalForWhatsApp.whatsappReady || false;

export async function initializeWhatsApp() {
    if (client || isInitializing) return;

    isInitializing = true;
    globalForWhatsApp.whatsappInitializing = true;
    console.log('Initializing WhatsApp Client...');

    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
    });

    globalForWhatsApp.whatsappClient = client;

    client.on('qr', (qr) => {
        console.log('QR RECEIVED', qr);
        qrcode.generate(qr, { small: true });
        console.log('Please scan the QR code above to log in to WhatsApp');
    });

    client.on('ready', () => {
        console.log('WhatsApp Client is ready!');
        isReady = true;
        globalForWhatsApp.whatsappReady = true;
        isInitializing = false;
        globalForWhatsApp.whatsappInitializing = false;
    });

    client.on('authenticated', () => {
        console.log('WhatsApp Client Authenticated');
    });

    client.on('auth_failure', (msg) => {
        console.error('WhatsApp Authentication Failed', msg);
        isInitializing = false;
        globalForWhatsApp.whatsappInitializing = false;
    });

    client.on('disconnected', (reason) => {
        console.log('WhatsApp Client Disconnected', reason);
        isReady = false;
        globalForWhatsApp.whatsappReady = false;
        // Do not nullify client immediately to avoid re-init loops in some cases, or do:
        client = null;
        globalForWhatsApp.whatsappClient = undefined;
        isInitializing = false;
        globalForWhatsApp.whatsappInitializing = false;
    });

    // Message Handler
    client.on('message', async (msg) => {
        const text = msg.body.trim();
        // Simple heuristic: If it's a short alphanumeric string (likely a symbol) or starts with "Analyze"
        if (text.length > 0 && text.length <= 5 && /^[a-zA-Z]+$/.test(text) || text.toLowerCase().startsWith('analyze ')) {
            const symbol = text.toLowerCase().startsWith('analyze ')
                ? text.split(' ')[1].toUpperCase()
                : text.toUpperCase();

            await handleStockAnalysisRequest(msg, symbol);
        }
    });

    try {
        await client.initialize();
    } catch (error) {
        console.error('Failed to initialize WhatsApp client:', error);
        isInitializing = false;
        client = null;
    }
}

async function handleStockAnalysisRequest(msg: Message, symbol: string) {
    try {
        msg.reply(`Analyzing ${symbol}... (This may take a few seconds)`);

        const [stockData, news] = await Promise.all([
            getStockQuote(symbol),
            getCompanyNews(symbol)
        ]);

        if (!stockData) {
            msg.reply(`Sorry, I couldn't find data for stock symbol: ${symbol}`);
            return;
        }

        const analysis = await analyzeStock(symbol, stockData, news);

        const response = `*AI Analysis for ${symbol}*\n\n` +
            `*Signal:* ${analysis.signal} (Confidence: ${analysis.confidence}%)\n` +
            `*Risk Level:* ${analysis.riskLevel}\n\n` +
            `*Reasoning:*\n${analysis.reasoning.map(r => `• ${r}`).join('\n')}\n\n` +
            `*Outlook:* ${analysis.shortTermOutlook}\n\n` +
            `_Current Price: $${stockData.price}_`;

        msg.reply(response);
    } catch (error: any) {
        console.error("Bot Analysis Error:", error);
        msg.reply("Sorry, I encountered an error analyzing that stock.");
    }
}

export async function sendWhatsAppMessage(number: string, message: string) {
    if (!client) {
        await initializeWhatsApp();
        // Wait a bit for initialization, but ideally we should have a better mechanism
        // For MVP, we might just fail if not ready immediately after init start
        // or check status.
        if (!client) throw new Error('WhatsApp client not initialized');
    }

    if (!isReady) {
        // In a real app, we might queue messages. Here, we'll try to wait or throw.
        throw new Error('WhatsApp client is initializing or not ready. Check server console for QR Code.');
    }

    // Ensure number format. whatsapp-web.js expects '1234567890@c.us'
    const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;

    try {
        await client.sendMessage(formattedNumber, message);
        console.log(`Message sent to ${formattedNumber}`);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
}

// Start initialization conditionally
if (!client && !isInitializing) {
    // initializeWhatsApp(); 
}

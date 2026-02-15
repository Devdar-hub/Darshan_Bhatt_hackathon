import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { getStockQuote, searchSymbols } from './stock';
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

// Helper to attach listeners (safe to call multiple times if we clear first)
const attachListeners = (c: Client) => {
    c.removeAllListeners('qr');
    c.removeAllListeners('ready');
    c.removeAllListeners('authenticated');
    c.removeAllListeners('auth_failure');
    c.removeAllListeners('disconnected');
    c.removeAllListeners('message_create');

    c.on('qr', (qr) => {
        console.log('QR RECEIVED', qr);
        qrcode.generate(qr, { small: true });
        console.log('Please scan the QR code above to log in to WhatsApp');
    });

    c.on('ready', () => {
        console.log('WhatsApp Client is ready!');
        isReady = true;
        globalForWhatsApp.whatsappReady = true;
        isInitializing = false;
        globalForWhatsApp.whatsappInitializing = false;
    });

    c.on('authenticated', () => {
        console.log('WhatsApp Client Authenticated');
    });

    c.on('auth_failure', (msg) => {
        console.error('WhatsApp Authentication Failed', msg);
        isInitializing = false;
        globalForWhatsApp.whatsappInitializing = false;
    });

    c.on('disconnected', (reason) => {
        console.log('WhatsApp Client Disconnected', reason);
        isReady = false;
        globalForWhatsApp.whatsappReady = false;
        client = null;
        globalForWhatsApp.whatsappClient = undefined;
        isInitializing = false;
        globalForWhatsApp.whatsappInitializing = false;
    });

    // Message Handler
    // 'message_create' triggers for ALL messages, including those sent by the bot (self).
    c.on('message_create', async (msg) => {
        // Prevent bot from replying to its own AI responses (infinite loops)
        if (msg.fromMe && msg.body.startsWith('*AI Analysis')) return;
        if (msg.fromMe && msg.body.startsWith('Analyzing')) return;
        if (msg.fromMe && msg.body.startsWith('Sorry,')) return;
        if (msg.fromMe && msg.body.startsWith('Share not listed')) return;
        if (msg.fromMe && msg.body.startsWith('Please send')) return;
        if (msg.fromMe && msg.body.startsWith('Found')) return;

        const text = msg.body.trim();
        console.log(`DEBUG: Message Received! Body: "${text}", From: ${msg.from}, FromMe: ${msg.fromMe}`);

        // Handle "Analyze [Symbol]" or just "[Symbol]"
        let symbolCandidate = "";
        if (text.toLowerCase().startsWith('analyze ')) {
            symbolCandidate = text.split(' ')[1];
        } else if (/^[a-zA-Z0-9.]+$/.test(text) && text.length <= 8) {
            symbolCandidate = text;
        } else {
            // Random message that doesn't look like a symbol
            // Only reply if it's not a system message or media
            if (msg.type === 'chat' && text.length > 0) {
                msg.reply("Please send a valid stock symbol (e.g., AAPL, TSLA) or 'Analyze [Symbol]'.");
            }
            return;
        }

        if (symbolCandidate) {
            await handleStockAnalysisRequest(msg, symbolCandidate.toUpperCase());
        }
    });
};

export async function initializeWhatsApp() {
    if (client) {
        // Client already exists (HMR), re-attach listeners to apply latest code changes
        console.log("Refining WhatsApp listeners on existing client...");
        attachListeners(client);
        return;
    }
    if (isInitializing) return;

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
    attachListeners(client);

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
        // Validate symbol
        const searchResults = await searchSymbols(symbol);
        const exactMatch = searchResults.find((s: any) => s.symbol === symbol);

        let targetSymbol = symbol;

        if (!exactMatch) {
            if (searchResults.length > 0) {
                // Found similarities, check if close or top result is good
                targetSymbol = searchResults[0].symbol;
                msg.reply(`Found ${targetSymbol} (${searchResults[0].description}). Analyzing...`);
            } else {
                msg.reply(`Share not listed or invalid symbol: ${symbol}. Try sending a symbol like 'AAPL' or 'GOOGL'.`);
                return;
            }
        } else {
            msg.reply(`Analyzing ${targetSymbol}... (This may take a few seconds)`);
        }

        const [stockData, news] = await Promise.all([
            getStockQuote(targetSymbol),
            getCompanyNews(targetSymbol)
        ]);

        if (!stockData || stockData.price === 0) {
            msg.reply(`Share not listed or data unavailable for: ${targetSymbol}`);
            return;
        }

        const analysis = await analyzeStock(targetSymbol, stockData, news);

        const response = `*AI Analysis for ${targetSymbol}*\n\n` +
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
    console.log("Auto-initializing WhatsApp Client...");
    initializeWhatsApp();
}

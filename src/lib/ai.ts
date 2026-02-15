import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Use gemini-flash-latest as verified working model for this key
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export interface AIAnalysis {
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string[];
    shortTermOutlook: string;
    riskLevel: 'Low' | 'Medium' | 'High';
}

export async function analyzeStock(symbol: string, stockData: any, news: any[]): Promise<AIAnalysis> {
    const prompt = `
    You are an expert stock trading analyst AI.
    Analyze the following data for stock: ${symbol}

    Stock Data:
    ${JSON.stringify(stockData, null, 2)}

    Recent News Headlines:
    ${news.slice(0, 5).map((n: any) => `- ${n.headline} (${n.source})`).join('\n')}

    Provide a trading signal based on this data.
    Return ONLY valid JSON in the following format, no markdown formatting:
    {
      "signal": "BUY" | "SELL" | "HOLD",
      "confidence": number (0-100),
      "reasoning": ["point 1", "point 2", "point 3"],
      "shortTermOutlook": "string",
      "riskLevel": "Low" | "Medium" | "High"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up markdown code blocks if present
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : responseText;

        const analysis = JSON.parse(jsonString) as AIAnalysis;
        return analysis;
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        throw new Error(error.message || "Gemini API failed");
    }
}

# AI Market Analyst Agent 🚀

A modern, AI-powered stock market dashboard that analyzes real-time news, technical indicators, and financial data to provide actionable trading signals (BUY/SELL/HOLD).

![AI Analyst Dashboard](/dashboard-preview.png)

## Features

- **Real-time Stock Data**: Live prices and charts via TradingView and Finnhub.
- **AI Decision Engine**: OpenAI GPT-4 Turbo analyzes news sentiment, RSI, MACD, and price action to generate trading signals with confidence scores and reasoning.
- **News Feed**: Aggregated news headlines relevant to the selected stock.
- **Technical Indicators**: Visual display of key indicators (RSI, MACD, SMA).
- **Telegram Aletrts**: Send AI insights directly to your Telegram chat.
- **Modern UI**: Glassmorphism design, dark mode, and smooth animations using Tailwind CSS and Framer Motion.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion.
- **Backend**: Next.js API Routes, Supabase (Auth & DB).
- **AI**: OpenAI API (GPT-4 Turbo).
- **Data**: Finnhub API (Stock data & News).
- **Bot**: Telegram Bot API.

## Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/your-repo/ai-market-analyst.git
cd ai-market-analyst
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and add your API keys:

```env
OPENAI_API_KEY=your_openai_key
FINNHUB_API_KEY=your_finnhub_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
NEWS_API_KEY=your_newsapi_key (optional, defaults to Finnhub)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 3. Database Setup (Supabase)
Run the following SQL in your Supabase SQL Editor to create the analysis history table:

```sql
create table analyses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  stock_symbol text not null,
  signal text not null,
  confidence integer not null,
  reasoning jsonb
);
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Usage

1. **Search**: Enter a stock symbol (e.g., AAPL, NVDA, BTC).
2. **Analyze**: Click "Generate AI Report" to let the agent analyze current market conditions.
3. **Alert**: Click "Send Alert to Telegram" to forward the signal to your bot.

## Hackathon Notes
- This is an MVP prototype.
- Uses free tier APIs (Finnhub) which may have rate limits.
- Logic for technical indicators (RSI/MACD) in the API is simplified for the hackathon context.

## License
MIT

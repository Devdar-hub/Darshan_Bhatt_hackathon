# Sophiie AI Agents Hackathon 2026

**Build the future of AI-human interaction.**

| | |
|---|---|
| **What** | A solo hackathon focused on AI agent interaction — voice, text, UX, and UI |
| **When** | February 14–15, 2026 (Saturday–Sunday) |
| **Where** | Virtual — participate from anywhere in Australia |
| **Prize** | **$5,000 AUD cash** (1st place) + job offers for top performers |
| **Format** | Solo only — show us what *you* can build |
| **Hacking Time** | 33 hours |

---

## The Challenge

**Design and build an AI agent with an exceptional interaction experience.**

We want to see how you think about the space between humans and AI. This is deliberately open-ended — you choose the problem, the modality, and the approach. What matters is the *interaction*.

Some directions to inspire you (not requirements):

- A voice agent that feels natural to talk to
- A text-based assistant with a thoughtful, intuitive UX
- A multi-modal agent that blends voice, text, and visual elements
- An agent that handles a complex workflow through conversation
- Something we haven't thought of yet

**You will be judged on innovation, technical execution, and how good the interaction feels** — not just whether the AI works, but whether a human would *want* to use it.

Use any tech stack. Use any AI provider. Use AI coding assistants. The only constraint is time.

---

## Schedule

All times are **AEST (Australian Eastern Standard Time, UTC+10 — Brisbane time)**.

### Saturday, February 14

| Time | Event |
|------|-------|
| **9:00 AM** | Kickoff — challenge explained, rules confirmed |
| **9:30 AM** | **Hacking begins** |
| 12:00 PM | Office hours / Q&A (optional, Discord) |
| 4:00 PM | Community check-in / progress sharing (optional, Discord) |

### Sunday, February 15

| Time | Event |
|------|-------|
| **6:00 PM** | **Submission deadline — hard cut-off, no exceptions** |

### After the Hackathon

| When | Event |
|------|-------|
| Feb 16 – Feb 28 | Judging period — judges review all submissions |
| ~Early March | Winners announced via livestream (details shared on Discord and Email) |

---

## Rules

### The Essentials

1. **Solo only** — one person per submission, no teams
2. **No pre-work** — all project code must be written during the hackathon window (after 9:30 AM AEST, Feb 14)
3. **Public GitHub repo** — your repository must be publicly visible at time of submission
4. **AI assistance is allowed** — Copilot, Claude, ChatGPT, Cursor, whatever you want. You still need to build it within the timeframe
5. **Must be functional** — your project must run and be demonstrable, not just a concept or slide deck
6. **One submission per person** — you may iterate, but submit one final project

### What You CAN Prepare Before Kickoff

- Research, planning, and brainstorming (on paper, in your head — just not in code)
- Setting up your development environment
- Reading documentation for tools/APIs you plan to use
- Creating accounts (GitHub, API providers, etc.)
- Watching tutorials

### What You CANNOT Do Before Kickoff

- Write any project code
- Create your project repository
- Fork/clone an existing project and modify it
- Build components, libraries, or templates specifically for your submission
- Start a project in a private repo then make it public later

### How We Verify

We will check:
- **Repository creation date** — must be after 9:30 AM AEST, Feb 14
- **Commit history** — should show natural progression, not a single massive commit
- **First commit timestamp** — must be after kickoff

**Red flags that will result in disqualification:**
- Repo created before the hackathon
- Single commit containing the entire project
- Commits timestamped before kickoff
- Evidence of code copied from a pre-existing private repo

---

## Submission Requirements

**Deadline: 6:00 PM AEST, Sunday February 15, 2026 — hard cut-off.**

To submit, you must complete **all** of the following:

1. **Public GitHub repo** — created after kickoff, with a clear commit history
2. **This README** — fill out the [Your Submission](#your-submission) section below
3. **Demo video** (2–5 minutes) — show your agent in action, explain your approach
4. **Working project** — judges must be able to understand and evaluate your agent from the repo + video

### How to Submit

1. Fork this repository
2. Build your project in the fork
3. Fill out the [Your Submission](#your-submission) section below
4. Record your demo video and add the link to your submission
5. Ensure your repo is **public** before 6:00 PM AEST Sunday
6. Submit your repo link via the submission form (link will be shared at kickoff)

---

## Judging Criteria

| Criteria | Weight | What We're Looking For |
|----------|--------|----------------------|
| **Interaction Design** | 30% | How intuitive, natural, and delightful is the human-AI interaction? Does it feel good to use? |
| **Innovation** | 25% | Novel approach, creative problem-solving, or a fresh take on agent interaction |
| **Technical Execution** | 25% | Code quality, architecture, reliability, completeness |
| **Presentation** | 20% | Demo quality, clarity of communication, ability to convey your vision |

### Judges

Sophiie senior engineers and CTO. Judging will take place over a 2-week period following the submission deadline.

---

## Prizes

| Place | Prize |
|-------|-------|
| **1st Place** | **$5,000 AUD cash** |
| **Top Performers** | Job offers or interview fast-tracks at Sophiie* |
| **All Finalists** | Consideration for current and future roles |

*\*Job offers and interview fast-tracks are entirely at the discretion of Sophiie and are not guaranteed.*

> Participants retain full ownership and IP of their submissions. Sophiie receives a non-exclusive license to review and evaluate submissions for judging purposes only.

---

## Your Submission

> **Instructions:** Fill out this section in your forked repo. This is what judges will see first.

### Participant

| Field | Your Answer |
|-------|-------------|
| **Name** | DARSHAN BHATT |
| **University / Employer** | DEAKIN UNIVERSITY |

### Project

| Field | Your Answer |
|-------|-------------|
| **Project Name** | AI MARKET ANALYST |
| **One-Line Description** | This project is an AI-powered market analysis assistant that runs as a website and WhatsApp bot. Users can simply send a stock symbol (like TSLA or AAPL) on WhatsApp, and the system fetches real-time market data, recent company news, and financial context. An AI agent then analyzes this information and generates a clear buy/sell/hold signal, confidence score, risk level, and short-term outlook. The result is sent back instantly as a structured message on WhatsApp. |
| **Demo Video Link** | https://youtu.be/-HuhlZteKcQ |
| **Tech Stack** | python typescript nextJS |
| **AI Provider(s) Used** | GEMINI (Because i dont have any premium subscription)|

### About Your Project

#### What does it do?
The AI Market Analyst Agent is a smart financial assistant accessible via WhatsApp and a web dashboard. It allows users to query stock symbols (e.g., "Analyze AAPL") and receive real-time investment insights. It fetches live market data, calculates volume-weighted technical indicators (RSI, MACD), and uses Google's Gemini AI to generate a comprehensive buy/sell/hold recommendation with a confidence score and risk assessment.

#### How does the interaction work?
The interaction is seamless and conversational. Users simply send a stock ticker to the WhatsApp bot. The bot validates the symbol, retrieves live candle data and news from Finnhub, computes technical indicators, and feeds this data into the Gemini AI. Within seconds, the user receives a structured analysis reply. Additionally, users can view detailed charts and search for stocks on the web dashboard, which stays in sync with the bot's activities.

#### What makes it special?
Unlike basic stock bots that just show price, this agent acts as a financial analyst. It doesn't just display data; it *interprets* it. By combining hard technical data (RSI, MACD) with soft data (news sentiment) and processing it through a Large Language Model (Gemini), it provides actionable "Reasoning" and "Outlook" summaries. It also features a premium web UI with a real-time search dropdown and direct WhatsApp integration.

#### How to run it

<!-- Step-by-step instructions to set up and run your project locally -->

```bash
# 1. Clone the repository
# git clone <your-repo-url>
# cd ai-market-analyst

# 2. Install Dependencies
npm install

# 3. Environment Setup
# Create a .env.local file and add your API keys:
# GEMINI_API_KEY=your_gemini_key
# FINNHUB_API_KEY=your_finnhub_key
# TELEGRAM_BOT_TOKEN=your_token (Optional)

# 4. Run the Development Server
npm run dev

# 5. Connect WhatsApp
# Check the terminal for a QR code.
# Scan it with your WhatsApp mobile app (Linked Devices).

# 6. Usage
# - Open http://localhost:3000 for the Dashboard.
# - Send a stock symbol (e.g., "AAPL") to your own WhatsApp number to test the bot.
```

#### Architecture / Technical Notes

<!-- Optional: describe your architecture, key technical decisions, or interesting implementation details -->

---

## Code of Conduct

All participants must adhere to a standard of respectful, professional behavior. Harassment, discrimination, or disruptive behavior of any kind will result in immediate disqualification.

By participating, you agree to:
- Treat all participants, judges, and organizers with respect
- Submit only your own original work created during the hackathon
- Not interfere with other participants' work
- Follow the rules outlined in this document

---

## Communication & Support

- **Discord** — join the hackathon Discord server for announcements, Q&A, and community chat (link provided upon registration)
- **Office hours** — available during the event for technical questions

---

## FAQ

**Q: Can I use boilerplate / starter templates?**
A: You can use publicly available boilerplate (e.g., `create-react-app`, `Next.js` starter) as a starting point. You cannot use custom templates you built specifically for this hackathon before kickoff.

**Q: Can I use existing open-source libraries and APIs?**
A: Yes. You can use any publicly available libraries, frameworks, APIs, and services. The code *you* write must be created during the hackathon.

**Q: Do I need to be in Australia?**
A: Preferred but not strictly required. The hackathon is primarily targeted at Australian residents and students, but we won't turn away great talent.

**Q: Can I use AI coding tools like Copilot or Claude?**
A: Absolutely. Use whatever tools you want. The 33-hour time constraint is the great equalizer.

**Q: What if I can't finish?**
A: Submit what you have. A well-thought-out partial project with a great demo video can still score well. We're evaluating your thinking and skill, not just completion.

**Q: How will I know if I won?**
A: Winners will be announced via livestream approximately 2 weeks after the hackathon. All participants will be notified.

**Q: Can I keep working on my project after the deadline?**
A: You can continue developing after the hackathon, but **only the state of your repo at 6:00 PM AEST Sunday Feb 15 will be judged**. We will check commit timestamps.

---

## About Sophiie

Sophiie is an AI office manager for trades businesses — helping plumbers, electricians, builders, and other trade professionals run their operations with intelligent automation. We're a team that cares deeply about how humans interact with AI, and we're looking for people who think the same way.

[sophiie.com](https://sophiie.com)

---

**Good luck. Build something that makes us say "wow."**

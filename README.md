# AssetNode

**AI-Assisted Portfolio Management Platform**

A full-stack web application that enables investors to track stock holdings and receive AI-generated portfolio analysis. Built with Next.js, Supabase, and Google Gemini.

**Live Demo**: [https://asset-node-portfolio-management.vercel.app/](https://asset-node-portfolio-management.vercel.app/)

---

## Overview

AssetNode combines structured portfolio management with generative AI to help users:
- Track stock holdings with cost basis and purchase history
- Visualize portfolio composition and total value
- Receive AI-generated insights on concentration risk, sector allocation, and diversification
- Store and review analysis snapshots over time

The platform demonstrates full-stack architecture: frontend UI → API routes → database persistence → external AI service integration → structured response validation.

---

## Features

### Portfolio Management
- **Dashboard**: Real-time portfolio overview, total value calculation, latest AI assessment
- **Stock Registry**: Add, edit, and delete stock positions with metadata (quantity, buy price, purchase date)
- **Search & Filter**: Find holdings by company name, quantity, or cost basis
- **Data Persistence**: All holdings stored in Supabase with real-time synchronization

### AI-Assisted Analysis
- **Portfolio Health Scoring**: Overall assessment (Excellent / Good / Moderate / Poor / Critical)
- **Concentration Risk Detection**: Identifies over-weighted positions
- **Sector Insights**: AI-inferred sector allocation from holdings
- **Diversification Review**: Recommendations for portfolio balance
- **Strategic Suggestions**: Actionable investment ideas based on current holdings

### Analysis History
- **Snapshot Storage**: Each analysis stored with timestamp and portfolio state
- **Trend Review**: Compare portfolio health assessments over time
- **Historical Context**: View recommendations and risk flags from past analyses

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes |
| **Database** | Supabase (PostgreSQL) |
| **AI Integration** | Google Gemini API, Genkit Framework |
| **Deployment** | Vercel |

---

## Architecture

```
User Interface (Next.js/React)
         ↓
   API Routes (/api/*)
         ↓
   Supabase Database
         ↓
   Gemini AI (via Genkit)
         ↓
   Structured Analysis Output
         ↓
   Store in Database & Display
```

### Key Components

**Portfolio API** (`/api/investments`)
- GET: Fetch all holdings
- POST: Add new stock position
- DELETE: Remove position

**Analysis API** (`/api/analyze-portfolio`)
- POST: Request AI portfolio analysis
- Input: Array of stock holdings
- Output: Structured JSON with health score, insights, recommendations
- Error Handling: Rate limiting (429), invalid input (400), AI failures (500)

**AI Flow** (`@/ai/flows/generate-portfolio-insights`)
- Genkit-based prompt orchestration
- Zod schema validation for structured output
- Error recovery and LLM response validation
- Automatic snapshot storage in Supabase

**Dashboard Component**
- Fetches portfolio holdings and analysis history
- Calculates portfolio value (sum of quantity × buy price)
- Displays latest AI assessment
- Renders historical analysis timeline

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- Supabase account (for database)
- Google Gemini API key
- Vercel account (for deployment)

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Google Gemini
GOOGLE_GENKIT_API_KEY=your_gemini_api_key

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd asset-node

# Install dependencies
npm install

# Set up database (run migrations)
npm run db:migrate

# Start development server
npm run dev
```

Server runs at `http://localhost:3000`

---

## API Endpoints

### Get Portfolio Holdings

```http
GET /api/investments
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "ticker": "TSLA",
      "company_name": "Tesla Inc.",
      "quantity": 20,
      "buy_price": 150,
      "purchase_date": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### Add Stock Holding

```http
POST /api/investments
Content-Type: application/json

{
  "assetType": "Stock",
  "companyName": "Apple Inc.",
  "quantity": 10,
  "buyPrice": 180,
  "purchaseDate": "2024-06-27T00:00:00Z"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "ticker": "AAPL",
    "company_name": "Apple Inc.",
    "quantity": 10,
    "buy_price": 180
  }
}
```

### Request Portfolio Analysis

```http
POST /api/analyze-portfolio
Content-Type: application/json

{
  "investments": [
    {
      "assetType": "Stock",
      "companyName": "Tesla Inc.",
      "quantity": 20,
      "buyPrice": 150,
      "purchaseDate": "2024-01-15T00:00:00Z"
    },
    {
      "assetType": "Stock",
      "companyName": "Apple Inc.",
      "quantity": 10,
      "buyPrice": 180,
      "purchaseDate": "2024-06-27T00:00:00Z"
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "portfolioHealth": {
      "overallStatus": "Moderate",
      "summary": "Portfolio shows concentration risk in technology sector."
    },
    "allocationInsights": [
      {
        "category": "Sector Distribution",
        "details": "Heavy weighting in Technology (66%)"
      }
    ],
    "concentrationInsights": [
      {
        "area": "Technology Sector",
        "riskLevel": "High",
        "details": "Over 60% of portfolio in tech stocks"
      }
    ],
    "suggestions": [
      {
        "type": "Sector Diversification",
        "description": "Consider adding Healthcare or Financial Services holdings",
        "priority": "High"
      }
    ]
  }
}
```

### Error Responses

**Invalid Input** (400):
```json
{
  "success": false,
  "error": "INVALID_INPUT",
  "message": "Investments missing or empty"
}
```

**Rate Limited** (429):
```json
{
  "success": false,
  "error": "AI_QUOTA_EXCEEDED",
  "message": "AI limit reached for now. Please wait a few minutes and try again."
}
```

**AI Failure** (500):
```json
{
  "success": false,
  "error": "ANALYSIS_FAILED",
  "message": "We couldn't complete the analysis right now. Please try again shortly."
}
```

---

## Database Schema

### `investments` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | User identifier (currently test-user) |
| ticker | TEXT | Stock symbol (TSLA, AAPL, etc.) |
| company_name | TEXT | Full company name |
| sector | TEXT | Industry sector (optional) |
| quantity | NUMERIC | Number of shares |
| buy_price | NUMERIC | Average cost per share |
| purchase_date | TIMESTAMP | Date of purchase |
| created_at | TIMESTAMP | Record creation time |

### `analysis_history` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | User identifier |
| status | TEXT | Health status (Excellent/Good/Moderate/Poor/Critical) |
| summary | TEXT | Brief analysis summary |
| created_at | TIMESTAMP | Analysis timestamp |

---

## How AI Analysis Works

1. **User submits portfolio** (stock holdings with quantity and cost basis)
2. **API validates input** (non-empty array, numeric values)
3. **Genkit flow** structures a prompt with the user's holdings
4. **Gemini receives**:
   - User's stock data (company names, quantities, prices)
   - System prompt asking for portfolio assessment
   - Instructions to follow structured JSON schema
5. **LLM generates response**:
   - Infers sector from company names
   - Evaluates concentration risk
   - Suggests diversification opportunities
   - Scores overall portfolio health
6. **Zod validation** ensures response matches expected schema
7. **Analysis stored** in database for historical tracking
8. **Response returned** to frontend for display

**Current Limitations**:
- Sector information inferred from company names (not fetched from APIs)
- Geographic data not integrated (could use stock API enrichment)
- Live prices not included (portfolio value based on cost basis)
- Single hardcoded user (ready to integrate with auth)

---

## Project Highlights

✓ **Full-stack architecture**: Frontend UI → API routes → database → external service  
✓ **Structured AI integration**: Zod schemas enforce LLM output validation  
✓ **Production deployment**: Live on Vercel with environment-based configuration  
✓ **Error handling**: Distinguishes rate limiting, validation, and service failures  
✓ **Data persistence**: Real-time sync between frontend and Supabase  
✓ **Audit trail**: Analysis history enables trend review and decision tracking  

---

## Future Improvements

### Planned
- **User Authentication**: Multi-user support with individual portfolios
- **Live Stock Prices**: Real-time data integration (Yahoo Finance / Alpha Vantage)
- **Performance Tracking**: Compare portfolio returns vs. market benchmarks
- **Watchlists**: Track stocks before adding to portfolio
- **Exportable Reports**: PDF/CSV export of analysis snapshots

### Potential Enhancements
- Risk metrics (Sharpe ratio, volatility, beta correlation)
- Backtesting engine for strategy validation
- Tax-loss harvesting recommendations
- Options analysis for advanced investors
- Portfolio rebalancing alerts

---

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

### Deployment to Vercel

```bash
vercel deploy
```

Ensure all environment variables are set in Vercel dashboard.

---

## Key Files

```
asset-node/
├── app/
│   ├── api/
│   │   ├── investments/           # Portfolio CRUD endpoints
│   │   ├── analyze-portfolio/     # AI analysis endpoint
│   │   └── analysis-history/      # Historical snapshots
│   ├── (dashboard)/               # Main portfolio page
│   └── layout.tsx
├── components/
│   ├── dashboard/
│   │   ├── PortfolioOverview.tsx
│   │   ├── StockRegistry.tsx
│   │   └── AnalysisHistory.tsx
│   └── ui/                         # shadcn/ui components
├── ai/
│   ├── genkit.ts                  # Genkit configuration
│   └── flows/
│       └── generate-portfolio-insights.ts  # AI flow definition
├── lib/
│   ├── supabase.ts                # Database client
│   └── utils.ts
└── .env.local                     # Environment variables
```

---

## Learning Outcomes

This project demonstrates:

1. **Full-stack web development**: Next.js API routes, React components, form handling
2. **Database design**: Relational schema, foreign keys, timestamp tracking
3. **API integration**: Error handling, quota management, response validation
4. **AI/LLM workflows**: Prompt engineering, structured output generation, Genkit orchestration
5. **Production deployment**: Environment configuration, CI/CD via Vercel
6. **TypeScript**: Type-safe API contracts, schema validation with Zod

---

## Author

**Akanksha Mahangade**


# Emporium Solution Backend API

Backend for handling funding form submissions with file uploads.

## API Endpoint

### POST /api/funding
Receives funding applications with file attachments.

**Form Fields:**
- fullName (required)
- email (required)
- phone (required)
- position (required)
- companyName (required)
- industry (required)
- businessStage (required)
- fundingAmount (required)
- fundingPurpose (required)
- employeeCount (required)
- estimatedRevenue (required)
- annualRevenue (required)
- businessDescription (required)
- hasDocuments

**Files:**
- companyProfile (required)
- financialReport (required)
- businessPlan (optional)
- pitchDeck (optional)
- otherDocuments (optional)

## Deployment

### Option 1: Render (Recommended)
1. Go to https://render.com/
2. Sign up with GitHub
3. Create new Web Service
4. Connect your GitHub repo
5. Add environment variables
6. Deploy

### Option 2: Railway
1. Go to https://railway.app/
2. Sign up
3. Create new project
4. Deploy from GitHub
5. Add environment variables

## Environment Variables

```
SENDGRID_API_KEY=your_sendgrid_api_key
PORT=3000
```

## Local Development

```bash
npm install
npm run dev
```

Server runs on http://localhost:3000

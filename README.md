# PRD Generator

AI-Powered Product Requirements Document Generator using the ISTVON Framework.

## Features

### Real AI Integration
- Supports OpenAI and Claude (Anthropic) APIs
- AI-powered enhancements for:
  - Problem Statement
  - Goals
  - Out of Scope suggestions
  - Chart Guidelines
  - Image Guidelines
  - API & MCP recommendations
  - Competitor Discovery & Analysis
  - Full PRD Generation
  - Proposal Cover Letters

### Excel Template Download & Upload
- **Download Template**: One-click styled Excel template with all PRD fields organized by step
  - Color-coded sections (Blue for Step 1, Green for Step 2, Purple for Step 3, Orange-Red for Step 4)
  - Bold column headers with help text and valid options for each field
- **Upload & Auto-Populate**: Upload a filled `.xlsx` file to auto-populate all form fields
  - Supports partial fills — only filled fields are applied, the rest stay untouched
  - Preview dialog shows extracted fields before applying
  - Deep merge for nested fields (app structure, tech stack, competitors, milestones)
  - App Idea supports up to 1000 chars via Excel (250 chars when typing in-app)

### File Handling
- Base64 file storage with preview
- Image thumbnails for uploaded photos
- Support for ZIP, documents, and multiple file uploads
- Google Drive and OneDrive link sync with AI content extraction
- Claude Cowork: local file system scanning with multi-source AI analysis

### Export Functionality
- **PDF Export**: Formatted PDF with headers, colors, and branding
- **DOCX Export**: Microsoft Word format with proper styling
- **JSON Export**: Structured data for programmatic access
- **Markdown Export**: Clean markdown output

### Email Integration
- Send PRD to team via mailto: links
- Opens default email client with PRD content
- Supports multiple recipients

### Auto-Save
- In-memory state management (resets on refresh)
- Previous tech stack preservation

## Installation

### Local Development (two terminals)

```bash
# Backend (Express, port 5000)
cd backend && npm install && npm run dev

# Frontend (React CRA, port 3000)
cd frontend && npm install && npm start
```

### Production (Docker)

```bash
docker compose up -d          # Start all services
docker compose logs -f        # Tail logs
docker compose down           # Stop
```

## Configuration

### AI Provider Setup
1. Create `backend/.env` with your API keys:
   ```
   AI_PROVIDER=openai          # or 'claude'
   OPENAI_API_KEY=sk-...
   CLAUDE_API_KEY=sk-ant-...
   PORT=5000
   ```
2. Create `frontend/.env.local`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api/ai
   ```

## Project Structure

```
PRD-Generator/
├── backend/
│   ├── routes/
│   │   └── ai.js              # All API endpoints
│   ├── server.js              # Express setup, CORS, health check
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── PRDGenerator.jsx    # Main 4-step wizard UI
│   │   ├── constants/
│   │   │   └── index.js            # Steps, options, checklists, templates
│   │   ├── hooks/
│   │   │   ├── useFormData.js      # Form state management
│   │   │   ├── useAI.js            # AI state + 14 methods
│   │   │   └── index.js
│   │   ├── services/
│   │   │   └── aiService.js        # HTTP client for backend AI calls
│   │   ├── utils/
│   │   │   ├── colorUtils.js       # Color/contrast calculations
│   │   │   ├── emailUtils.js       # Email/mailto functionality
│   │   │   ├── excelUtils.js       # Excel template generation & parsing
│   │   │   ├── exportUtils.js      # PDF/DOCX/JSON/Markdown exports
│   │   │   ├── fileUtils.js        # File handling utilities
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── docker-compose.yml
├── CLAUDE.md
└── README.md
```

## Dependencies

### Frontend
- **React 18**: UI framework
- **Lucide React**: Icon library
- **jsPDF**: PDF generation
- **docx**: Microsoft Word document generation
- **xlsx-js-style**: Excel template generation with cell styling
- **Tailwind CSS**: Styling

### Backend
- **Express 4**: HTTP server
- **cors**: Cross-origin support
- **OpenAI / Anthropic SDKs**: AI provider integration

## API Requirements

For AI features, you need one of:
- OpenAI API key (uses gpt-4o-mini model)
- Anthropic API key (uses claude-3-haiku model)

## Functionality

1. **AI Features**: Real API integration with OpenAI/Claude for field enhancement, PRD generation, and competitor analysis
2. **Excel Template**: Download a styled template, fill offline, upload to auto-populate all fields
3. **File Uploads**: Base64 storage with image previews, executable blocking, and AI auto-fill
4. **Drive Sync**: Google Drive and OneDrive link analysis with AI content extraction
5. **Claude Cowork**: Local filesystem scanning + multi-source combined AI analysis
6. **PDF/DOCX/JSON/MD Export**: Multiple export formats with proper styling
7. **Email Integration**: mailto: links for team sharing with multiple recipients
8. **BuLLMake Document Checklist**: 15-item checklist with keyword-based upload status mapping
9. **PRD Review Checklist**: Section-by-section review tracking
10. **Notifications**: Toast notifications with 3-second auto-dismiss
11. **Settings Dialog**: AI provider and API key configuration

## License

Powered by ISTVON PRD Prompt Framework | BuLLMake PRD Generator

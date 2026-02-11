import * as XLSX from 'xlsx-js-style';

// Step color schemes (fill + font for section header, lighter fill for column headers)
const STEP_COLORS = {
  1: { headerFill: '1E3A5F', headerFont: 'FFFFFF', colFill: 'D6E6F5', colFont: '1E3A5F' },  // Blue
  2: { headerFill: '1B5E20', headerFont: 'FFFFFF', colFill: 'D9EED9', colFont: '1B5E20' },  // Green
  3: { headerFill: '6A1B9A', headerFont: 'FFFFFF', colFill: 'E8D5F5', colFont: '6A1B9A' },  // Purple
  4: { headerFill: 'BF360C', headerFont: 'FFFFFF', colFill: 'FDDCCC', colFont: 'BF360C' },  // Orange-Red
};

/**
 * Generates a styled Excel template with all PRD fields organized by step.
 * Three columns: Field Label | Your Input | Help / Options
 * Each step gets a distinct color theme. Section & column headers are bolded.
 */
export function generateExcelTemplate() {
  const rows = [];       // cell values
  const styles = [];     // parallel array of style objects per row

  let currentStep = 1;

  const addSection = (title, step) => {
    currentStep = step;
    const c = STEP_COLORS[step];
    // Section header row — merged across 3 cols visually, bold white on dark bg
    rows.push([title, '', '']);
    styles.push([
      { font: { bold: true, color: { rgb: c.headerFont }, sz: 13 }, fill: { fgColor: { rgb: c.headerFill } }, alignment: { horizontal: 'left' } },
      { fill: { fgColor: { rgb: c.headerFill } } },
      { fill: { fgColor: { rgb: c.headerFill } } },
    ]);
    // Column headers row — bold on lighter bg
    rows.push(['Field', 'Your Input', 'Help / Options']);
    styles.push([
      { font: { bold: true, color: { rgb: c.colFont }, sz: 11 }, fill: { fgColor: { rgb: c.colFill } }, alignment: { horizontal: 'left' } },
      { font: { bold: true, color: { rgb: c.colFont }, sz: 11 }, fill: { fgColor: { rgb: c.colFill } }, alignment: { horizontal: 'left' } },
      { font: { bold: true, color: { rgb: c.colFont }, sz: 11 }, fill: { fgColor: { rgb: c.colFill } }, alignment: { horizontal: 'left' } },
    ]);
  };

  const addField = (label, help = '') => {
    rows.push([label, '', help]);
    styles.push([
      { font: { sz: 11 }, alignment: { horizontal: 'left' } },
      { font: { sz: 11 }, alignment: { horizontal: 'left' } },
      { font: { sz: 10, color: { rgb: '666666' } }, alignment: { horizontal: 'left', wrapText: true } },
    ]);
  };

  const addBlank = () => {
    rows.push(['', '', '']);
    styles.push([null, null, null]);
  };

  // ── STEP 1: APP CONCEPT & SCOPE ──
  addSection('STEP 1: APP CONCEPT & SCOPE', 1);
  addField('App Name', 'Short, memorable name (max 50 chars)');
  addField('App Idea', 'Core value proposition (max 1000 chars)');
  addField('Problem Statement', 'Specific pain points your app addresses');
  addField('Goal', 'Primary objective with measurable success criteria');
  addField('Target Audience - Demography', 'Comma-separated, max 3: Enterprise, SMBs, Startups, Students, Professionals, Women, Men, Seniors, Teenagers, Freelancers, Developers, Designers, Managers');
  addField('Target Audience - Geography', 'Comma-separated, max 3: North America, Europe, Asia-Pacific, Latin America, Middle East, Africa, Australia, India, Southeast Asia, Global');
  addField('Out of Scope', 'Features explicitly excluded from v1.0');
  addField('Project Type', 'e.g., New Build, Redesign, Enhancement');
  addField('Due Date', 'YYYY-MM-DD format');
  addBlank();

  // Milestones
  for (let i = 1; i <= 3; i++) {
    addField(`Milestone ${i} - Name`, 'Milestone title');
    addField(`Milestone ${i} - Date`, 'YYYY-MM-DD format');
    addField(`Milestone ${i} - Description`, 'What this milestone delivers');
  }
  addBlank();

  // ── STEP 2: PLATFORM & TECH STACK ──
  addSection('STEP 2: PLATFORM & TECH STACK', 2);
  addField('Platform', 'Comma-separated: PWA, Web App, Mobile App, Chatbot, Website, WP Plugin, Report Builder, Chrome Extension, ML, Microservices, AI Agents, MCP / APIs');
  addField('Number of Users', 'Expected number of end users');
  addField('Number of Admins', 'Expected number of admin users');
  addField('App Structure - Default Screen', 'First screen users see');
  addField('App Structure - Working Screen', 'Where primary tasks occur');
  addField('App Structure - Other Screens', 'Settings, profiles, etc.');
  addBlank();

  const techStackCategories = [
    ['Tech Stack - Frontend', 'React, Next.js, Vue.js, Angular, Svelte, Remix, Astro, Nuxt.js, Solid.js, Qwik'],
    ['Tech Stack - CSS', 'Tailwind CSS, Bootstrap, Material UI, Chakra UI, Styled Components, Ant Design, Sass/SCSS, CSS Modules, Shadcn UI'],
    ['Tech Stack - Backend', 'Node.js/Express, Python/FastAPI, Python/Django, Ruby on Rails, Go, Java/Spring, .NET, Supabase, Firebase, NestJS, Rust/Actix'],
    ['Tech Stack - LLM', 'Claude Opus, Claude Sonnet, GPT-4o, GPT-4o-mini, Gemini Pro, Llama 3, Mistral, Grok, DeepSeek, Cohere'],
    ['Tech Stack - MCP', 'Claude MCP, Filesystem MCP, GitHub MCP, Slack MCP, Database MCP, Web Search MCP, Brave MCP, Memory MCP'],
    ['Tech Stack - Testing', 'Jest, Playwright, Cypress, Vitest, Mocha, Selenium, Puppeteer, Testing Library, Storybook, Postman'],
    ['Tech Stack - Deployment', 'Docker, AWS, Vercel, Netlify, Google Cloud, Azure, Railway, Fly.io, DigitalOcean, Heroku, Cloudflare'],
    ['Tech Stack - Reporting', 'Zoho Analytics, Metabase, Grafana, Power BI, Tableau, Apache Superset, Looker, Redash'],
    ['Tech Stack - APIs', 'Stripe, Twilio, SendGrid, Auth0, Firebase Auth, Cloudinary, Mapbox, OpenAI API, Anthropic API, AWS S3'],
    ['Tech Stack - Local LLM', 'Ollama, LM Studio, llama.cpp, vLLM, GPT4All, Jan, LocalAI, Kobold.cpp'],
    ['Tech Stack - Eval Tools', 'LangSmith, Weights & Biases, MLflow, Arize, Braintrust, Promptfoo, Humanloop, Langfuse'],
    ['Tech Stack - Additional', 'n8n, Zapier, Redis, PostgreSQL, MongoDB, Elasticsearch, RabbitMQ, Kafka, GraphQL, Prisma'],
  ];
  techStackCategories.forEach(([label, help]) => addField(label, `Comma-separated: ${help}`));
  addBlank();

  // Competitors
  for (let i = 1; i <= 3; i++) {
    addField(`Competitor ${i} - Name`, 'Competitor/alternative name');
    addField(`Competitor ${i} - URL`, 'Website URL');
    addField(`Competitor ${i} - Analysis`, 'Strengths, weaknesses, notes');
  }
  addBlank();

  // ── STEP 3: VISUAL STYLE GUIDE ──
  addSection('STEP 3: VISUAL STYLE GUIDE', 3);
  addField('Primary Color', 'Hex color code, e.g., #0093B6');
  addField('Secondary Color', 'Hex color code, e.g., #0093B6');
  addField('Accent Color', 'Hex color code, e.g., #009688');
  addField('Primary Font', 'Options: Inter, Roboto, Open Sans, Poppins, Montserrat, Calibri, Arial, Helvetica');
  addField('Headings Font', 'Options: Inter, Roboto, Open Sans, Poppins, Montserrat, Calibri, Arial, Helvetica');
  addField('H1 Size', 'e.g., 48px');
  addField('H2 Size', 'e.g., 36px');
  addField('H3 Size', 'e.g., 24px');
  addField('H4 Size', 'e.g., 20px');
  addField('H5 Size', 'e.g., 18px');
  addField('Body Size', 'e.g., 16px');
  addField('Chart Color 1', 'Hex color code');
  addField('Chart Color 2', 'Hex color code');
  addField('Chart Color 3', 'Hex color code');
  addField('Chart Color 4', 'Hex color code');
  addField('Chart Color 5', 'Hex color code');
  addField('Chart Guidelines', 'Data visualization styling notes');
  addField('Image Guidelines', 'Image treatment standards');
  addField('Image Border Radius', 'e.g., 8px');
  addField('Image Aspect Ratio', 'e.g., 16:9');
  addField('Image Quality', 'e.g., 1920x1080');
  addBlank();

  // ── STEP 4: GENERATE PRD ──
  addSection('STEP 4: GENERATE PRD', 4);
  addField('Assigned Team', 'Comma-separated email addresses');

  // Build worksheet from values
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Apply styles to each cell
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < 3; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      if (ws[cellRef] && styles[r] && styles[r][c]) {
        ws[cellRef].s = styles[r][c];
      }
    }
  }

  // Column widths
  ws['!cols'] = [
    { wch: 35 },  // Field Label
    { wch: 50 },  // Your Input
    { wch: 60 },  // Help
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PRD Template');
  return wb;
}

/**
 * Parses an uploaded Excel workbook and maps rows to formData fields.
 * Returns { parsedData, displayFields } where displayFields is a flat label→value map for preview.
 */
export function parseExcelToFormData(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const parsedData = {};
  const appStructure = {};
  const selectedTechStack = {};
  const competitors = [{}, {}, {}];
  const milestones = [];
  const displayFields = {};

  // Tech stack label → key mapping
  const techStackMap = {
    'Tech Stack - Frontend': 'frontend',
    'Tech Stack - CSS': 'css',
    'Tech Stack - Backend': 'backend',
    'Tech Stack - LLM': 'llm',
    'Tech Stack - MCP': 'mcp',
    'Tech Stack - Testing': 'testing',
    'Tech Stack - Deployment': 'deployment',
    'Tech Stack - Reporting': 'reporting',
    'Tech Stack - APIs': 'apis',
    'Tech Stack - Local LLM': 'localLlm',
    'Tech Stack - Eval Tools': 'evalTools',
    'Tech Stack - Additional': 'additional',
  };

  const splitComma = (val) => String(val).split(',').map(s => s.trim()).filter(Boolean);
  const isHex = (val) => /^#[0-9a-fA-F]{6}$/.test(String(val).trim());

  for (const row of rows) {
    const label = String(row[0] || '').trim();
    const value = row[1] != null ? String(row[1]).trim() : '';
    if (!label || !value) continue;

    // Skip section headers and column headers
    if (label.startsWith('STEP ') || label === 'Field') continue;

    // ── Simple text fields ──
    const simpleMap = {
      'App Name': 'appName',
      'App Idea': 'appIdea',
      'Problem Statement': 'problemStatement',
      'Goal': 'goal',
      'Out of Scope': 'outOfScope',
      'Project Type': 'projectType',
      'Due Date': 'dueDate',
      'Number of Users': 'numberOfUsers',
      'Number of Admins': 'numberOfAdmins',
      'Chart Guidelines': 'chartGuidelines',
      'Image Guidelines': 'imageGuidelines',
      'Image Border Radius': 'imageBorderRadius',
      'Image Aspect Ratio': 'imageAspectRatio',
      'Image Quality': 'imageQuality',
      'Primary Font': 'primaryFont',
      'Headings Font': 'headingsFont',
      'H1 Size': 'h1Size',
      'H2 Size': 'h2Size',
      'H3 Size': 'h3Size',
      'H4 Size': 'h4Size',
      'H5 Size': 'h5Size',
      'Body Size': 'bodySize',
    };

    if (simpleMap[label]) {
      parsedData[simpleMap[label]] = value;
      displayFields[label] = value;
      continue;
    }

    // ── Multi-select fields ──
    if (label === 'Target Audience - Demography') {
      parsedData.targetAudienceDemography = splitComma(value);
      displayFields[label] = value;
      continue;
    }
    if (label === 'Target Audience - Geography') {
      parsedData.targetAudienceGeography = splitComma(value);
      displayFields[label] = value;
      continue;
    }
    if (label === 'Platform') {
      parsedData.platform = splitComma(value);
      displayFields[label] = value;
      continue;
    }
    if (label === 'Assigned Team') {
      parsedData.assignedTeam = splitComma(value);
      displayFields[label] = value;
      continue;
    }

    // ── Color fields ──
    const colorMap = {
      'Primary Color': 'primaryColor',
      'Secondary Color': 'secondaryColor',
      'Accent Color': 'accentColor',
      'Chart Color 1': 'chartColor1',
      'Chart Color 2': 'chartColor2',
      'Chart Color 3': 'chartColor3',
      'Chart Color 4': 'chartColor4',
      'Chart Color 5': 'chartColor5',
    };
    if (colorMap[label]) {
      const hex = value.startsWith('#') ? value : `#${value}`;
      if (isHex(hex)) {
        parsedData[colorMap[label]] = hex;
        displayFields[label] = hex;
      }
      continue;
    }

    // ── App Structure fields ──
    const appStructureMap = {
      'App Structure - Default Screen': 'defaultScreen',
      'App Structure - Working Screen': 'workingScreen',
      'App Structure - Other Screens': 'otherScreens',
    };
    if (appStructureMap[label]) {
      appStructure[appStructureMap[label]] = value;
      displayFields[label] = value;
      continue;
    }

    // ── Tech Stack fields ──
    if (techStackMap[label]) {
      selectedTechStack[techStackMap[label]] = splitComma(value);
      displayFields[label] = value;
      continue;
    }

    // ── Competitors ──
    const compMatch = label.match(/^Competitor (\d+) - (Name|URL|Analysis)$/);
    if (compMatch) {
      const idx = parseInt(compMatch[1], 10) - 1;
      if (idx >= 0 && idx < 3) {
        const field = compMatch[2] === 'Name' ? 'name' : compMatch[2] === 'URL' ? 'url' : 'analysis';
        competitors[idx][field] = value;
        displayFields[label] = value;
      }
      continue;
    }

    // ── Milestones ──
    const msMatch = label.match(/^Milestone (\d+) - (Name|Date|Description)$/);
    if (msMatch) {
      const idx = parseInt(msMatch[1], 10) - 1;
      if (idx >= 0) {
        while (milestones.length <= idx) {
          milestones.push({ id: Date.now() + milestones.length, name: '', date: '', description: '' });
        }
        const field = msMatch[2] === 'Name' ? 'name' : msMatch[2] === 'Date' ? 'date' : 'description';
        milestones[idx][field] = value;
        displayFields[label] = value;
      }
      continue;
    }
  }

  // Only include non-empty nested objects
  if (Object.keys(appStructure).length > 0) parsedData.appStructure = appStructure;
  if (Object.keys(selectedTechStack).length > 0) parsedData.selectedTechStack = selectedTechStack;

  // Only include competitors if at least one has a name
  const hasCompetitors = competitors.some(c => c.name);
  if (hasCompetitors) {
    parsedData.competitors = competitors.map(c => ({
      name: c.name || '',
      url: c.url || '',
      analysis: c.analysis || '',
    }));
  }

  // Only include milestones if at least one has a name
  const hasMilestones = milestones.some(m => m.name);
  if (hasMilestones) {
    parsedData.milestones = milestones.filter(m => m.name);
  }

  return { parsedData, displayFields };
}

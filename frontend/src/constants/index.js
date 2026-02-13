// PRD Generator Constants

export const STEPS = [
  { id: 0, title: 'App Concept & Scope', subtitle: 'Define your vision', icon: 'Sparkles', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', color: '#0093B6' },
  { id: 1, title: 'Platform & Tech Stack', subtitle: 'Choose your foundation', icon: 'Rocket', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', color: '#0093B6' },
  { id: 2, title: 'Visual Style Guide', subtitle: "Define your application's complete visual identity", icon: 'Palette', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', color: '#0093B6' },
  { id: 3, title: 'Generate PRD', subtitle: 'Create & Deploy', icon: 'FileText', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', color: '#0093B6' }
];

export const DEMOGRAPHY_OPTIONS = ['Enterprise', 'SMBs', 'Startups', 'Students', 'Professionals', 'Women', 'Men', 'Seniors', 'Teenagers', 'Freelancers', 'Developers', 'Designers', 'Managers'];

export const GEOGRAPHY_OPTIONS = ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East', 'Africa', 'Australia', 'India', 'Southeast Asia', 'Global'];

export const FONT_OPTIONS = ['Inter', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat', 'Calibri', 'Arial', 'Helvetica'];

export const PLATFORM_OPTIONS = [
  // Row 1
  { name: 'PWA', emoji: '🚀', sub: 'Progressive' },
  { name: 'Web App', emoji: '💻', sub: 'Browser' },
  { name: 'Mobile App', emoji: '📱', sub: 'iOS & Android' },
  { name: 'Chatbot', emoji: '🤖', sub: 'Conversational' },
  // Row 2
  { name: 'Website', emoji: '🌐', sub: 'Static/CMS' },
  { name: 'WP Plugin', emoji: '⚡', sub: 'WordPress' },
  { name: 'Report Builder', emoji: '📊', sub: 'Data & Reports' },
  { name: 'Chrome Extension', emoji: '🔌', sub: 'Browser Ext' },
  // Row 3
  { name: 'ML', emoji: '📈', sub: 'Machine Learning' },
  { name: 'Microservices', emoji: '🧩', sub: 'Backend' },
  { name: 'AI Agents', emoji: '🧠', sub: 'Autonomous' },
  { name: 'MCP / APIs', emoji: '🔗', sub: 'Integrations' }
];

export const APP_IDEA_TEMPLATE = `[App Name] is a [platform type] designed for [target audience] to [primary function].

Key Features:
• [Feature 1]: [Brief description]
• [Feature 2]: [Brief description]
• [Feature 3]: [Brief description]

Problem Solved: [Main pain point addressed]
Success Metric: [How success will be measured]`;

export const ISTVON_SECTIONS = [
  {
    id: 'instructions',
    letter: 'I',
    title: 'Instructions',
    borderClass: 'border-orange-200',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-600',
    headerClass: 'text-orange-800',
    fields: [
      { key: 'level', label: 'Level', placeholder: 'e.g., Lead Architect / Product Visionary' },
      { key: 'persona', label: 'Persona', placeholder: 'e.g., DigiBull System Builder using Opus 4.5' },
      { key: 'goal', label: 'Goal', placeholder: 'e.g., Build a functional, aesthetic app' },
      { key: 'background', label: 'Background', placeholder: 'e.g., Enterprise-grade with clean layout' }
    ]
  },
  {
    id: 'source',
    letter: 'S',
    title: 'Source',
    borderClass: 'border-blue-200',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-600',
    headerClass: 'text-blue-800',
    fields: [
      { key: 'sourceFiles', label: 'Source Files', placeholder: 'e.g., Interview notes, core purpose docs' },
      { key: 'externalLinks', label: 'External Links', placeholder: 'e.g., Blueprint standards, references' },
      { key: 'trained', label: 'ML/Trained Data', placeholder: 'e.g., Opus 4.5 reasoning models' }
    ]
  },
  {
    id: 'tools',
    letter: 'T',
    title: 'Tools',
    borderClass: 'border-green-200',
    bgClass: 'bg-green-100',
    textClass: 'text-green-600',
    headerClass: 'text-green-800',
    fields: [
      { key: 'language', label: 'Language', placeholder: 'e.g., React/Vite or Next.js' },
      { key: 'libraries', label: 'Libraries', placeholder: 'e.g., Tailwind CSS, Framer Motion, Lucide' },
      { key: 'api', label: 'API', placeholder: 'e.g., Multi-tenant API logic' }
    ]
  },
  {
    id: 'variables',
    letter: 'V',
    title: 'Variables',
    borderClass: 'border-purple-200',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-600',
    headerClass: 'text-purple-800',
    fields: [
      { key: 'tables', label: 'Tables', placeholder: 'e.g., Users, Tenants, Roles' },
      { key: 'weights', label: 'Weights', placeholder: 'e.g., Emphasize interaction rhythm' },
      { key: 'biases', label: 'Biases', placeholder: 'e.g., Prefer simple & clean' },
      { key: 'outputLength', label: 'Output Length', placeholder: 'e.g., Minimal documentation' }
    ]
  },
  {
    id: 'outcome',
    letter: 'O',
    title: 'Outcome',
    borderClass: 'border-teal-200',
    bgClass: 'bg-teal-100',
    textClass: 'text-teal-600',
    headerClass: 'text-teal-800',
    fields: [
      { key: 'pipeType', label: 'Deliverables', placeholder: 'e.g., Functional App Build + Admin sections' },
      { key: 'keyMetrics', label: 'Key Metrics', placeholder: 'e.g., Vibe-alignment, smoothness' },
      { key: 'codeBlock', label: 'Code Format', placeholder: 'e.g., Vibe-coded components' },
      { key: 'quality', label: 'Quality', placeholder: 'e.g., Functional, aesthetic, aligned' }
    ]
  },
  {
    id: 'notification',
    letter: 'N',
    title: 'Notification',
    borderClass: 'border-red-200',
    bgClass: 'bg-red-100',
    textClass: 'text-red-600',
    headerClass: 'text-red-800',
    fields: [
      { key: 'clarification', label: 'Clarification', placeholder: 'e.g., Mandatory interview phase' },
      { key: 'exploration', label: 'Exploration', placeholder: 'e.g., Add optional enhancements' },
      { key: 'app', label: 'Channel', placeholder: 'e.g., Walk-through and dashboard preview' }
    ]
  }
];

export const PRD_PROMPT_TEMPLATE = `Build the [App Name] app using the DigiBull AI Coding System...

I - Instructions: [Level, Persona, Goal, Background]
S - Source: [Source Files, External Links, Trained Data]
T - Tools: [Language, Libraries, API]
V - Variables: [Tables, Weights, Biases, Output Length]
O - Outcome: [Deliverables, Key Metrics, Code Format, Quality]
N - Notification: [Clarification, Exploration, Channel]`;

export const DEFAULT_PRD_PROMPT = `Build the app using the BuLLM Coding System guiding the creative logic & generating the Product Requirements Document. Start by interviewing me about the core purpose of the app, the audience, and the enterprise taste. Use reasoning to translate that learning into features, flows, & interface decisions. Create the full app structure including pages, components, user flows, multi-tenant with admin data handling, & interaction rhythm. Keep the design simple, clean, and practical. Include sections for Home, Primary Feature, Admin panels, and any custom screens based on the app idea. Use clear naming, smooth transitions, and a layout that reflects the chosen vibe. Add enhancements such as AI input, automated recommendations, or a personalized dashboard. Make the final product functional, aesthetic, and aligned with the emotional tone I choose besides creating a simple walk-through of the app. Finally add requisite documentation for product support & troubleshooting the app.`;

export const PROPOSAL_TEMPLATES = {
  coverLetter: { name: 'Email Cover Letter', description: 'Summary with tentative commercials suitable for email' },
  salesProposal: { name: 'Standard Sales Proposal', description: 'Professional sales proposal with executive summary, challenges, solution, pricing & next steps' }
};

export const PRD_REVIEW_CHECKLIST = [
  { id: 'executive_summary', label: 'Executive Summary reviewed', category: 'Overview', checkField: 'appIdea', prdSearch: 'Executive Summary' },
  { id: 'product_vision', label: 'Product Vision aligned', category: 'Strategy', checkField: 'goal', prdSearch: 'Product Vision' },
  { id: 'problem_statement', label: 'Problem Statement validated', category: 'Overview', checkField: 'problemStatement', prdSearch: 'Problem Statement' },
  { id: 'target_users', label: 'Target Users & Personas defined', category: 'Users', checkField: 'targetAudienceDemography', prdSearch: 'Target Users' },
  { id: 'solution_overview', label: 'Solution Overview reviewed', category: 'Approach', checkField: 'appStructure', prdSearch: 'Solution Overview' },
  { id: 'user_stories', label: 'User Stories validated', category: 'Requirements', checkField: 'appStructure', prdSearch: 'User Stories' },
  { id: 'feature_requirements', label: 'Feature Requirements detailed', category: 'Features', checkField: 'appStructure', prdSearch: 'Feature Requirements' },
  { id: 'acceptance_criteria', label: 'Acceptance Criteria defined', category: 'Quality', checkField: 'goal', prdSearch: 'Acceptance Criteria' },
  { id: 'ui_wireframes', label: 'UI/Wireframes reviewed', category: 'Design', checkField: 'primaryColor', prdSearch: 'UI' },
  { id: 'nonfunctional_requirements', label: 'Non-Functional Requirements captured', category: 'Quality', checkField: 'platform', prdSearch: 'Non-Functional' },
  { id: 'tech_stack', label: 'Technology Stack confirmed', category: 'Technical', checkField: 'selectedTechStack', prdSearch: 'Technology Stack' },
  { id: 'tech_architecture', label: 'Technical Architecture reviewed', category: 'Technical', checkField: 'selectedTechStack', prdSearch: 'Technical Architecture' },
  { id: 'success_metrics', label: 'Success Metrics & KPIs set', category: 'Metrics', checkField: 'goal', prdSearch: 'Success Metrics' },
  { id: 'timeline', label: 'Timeline & Milestones approved', category: 'Planning', checkField: 'milestones', prdSearch: 'Timeline' },
  { id: 'risks_constraints', label: 'Risks, Constraints & Dependencies reviewed', category: 'Planning', checkField: 'outOfScope', prdSearch: 'Risks' },
  { id: 'open_questions', label: 'Open Questions documented', category: 'Planning', checkField: null, prdSearch: 'Open Questions' },
  { id: 'out_of_scope', label: 'Out of Scope items documented', category: 'Planning', checkField: 'outOfScope', prdSearch: 'Out of Scope' },
  { id: 'appendices', label: 'Appendices & references verified', category: 'Documentation', checkField: 'uploadedFiles', prdSearch: 'Appendix' }
];

export const DOCUMENT_CHECKLIST = [
  { id: 'app_idea', label: 'App Idea Doc', group: 1, keywords: ['idea', 'concept', 'vision', 'pitch', 'overview', 'brief', 'proposal', 'summary', 'about'] },
  { id: 'client_expectations', label: 'Client Expectations', group: 1, keywords: ['client', 'expectation', 'stakeholder', 'scope'] },
  { id: 'notebooklm', label: 'NotebookLM', group: 1, keywords: ['notebooklm', 'notebook', 'nlm'] },
  { id: 'storm_pdf', label: 'STORM PDF', group: 1, keywords: ['storm', 'storm pdf'] },
  { id: 'competitive_tools', label: 'Competitive Apps', group: 1, keywords: ['competitor', 'competition', 'competitive', 'market', 'benchmark', 'comparison', 'landscape'] },
  { id: 'process_flow', label: 'Proposed Process Flow', group: 1, keywords: ['flow', 'process', 'journey', 'workflow', 'diagram', 'wireframe', 'sitemap', 'navigation', 'ux', 'ui'] },
  { id: 'design_doc', label: 'Software Design Doc', group: 2, keywords: ['design', 'sdd', 'srs', 'brd', 'frd', 'functional', 'software design', 'spec', 'requirement'] },
  { id: 'integrations_3p', label: '3rd Party Integrations', group: 2, keywords: ['3rd party', 'third party', 'external', 'plugin', 'addon'] },
  { id: 'apis', label: 'APIs', group: 2, keywords: ['api', 'endpoint', 'rest', 'graphql', 'swagger', 'openapi'] },
  { id: 'mcps', label: 'MCPs', group: 2, keywords: ['mcp', 'model context'] },
  { id: 'data_schema', label: 'Data Schema', group: 2, keywords: ['schema', 'data', 'database', 'erd', 'model', 'entity', 'table', 'sql', 'migration'] },
  { id: 'legacy_code', label: 'Legacy Code', group: 2, keywords: ['legacy', 'code', 'source', 'codebase', 'repo'] },
  { id: 'hw_requirements', label: 'HW Requirements', group: 2, keywords: ['hardware', 'hw', 'device', 'iot', 'sensor', 'embedded', 'peripheral'] },
  { id: 'video_walkthrough', label: 'Video Walkthrough', group: 3, keywords: ['video', 'walkthrough', 'demo', 'recording', 'screencast', 'mp4', 'mov', 'webm'] },
  { id: 'screenshots', label: 'Screenshots', group: 3, keywords: ['screenshot', 'screen', 'capture', 'snapshot', 'existing tool', 'png', 'jpg', 'jpeg'] }
];

export const TECH_STACK_OPTIONS = {
  frontend: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Remix', 'Astro', 'Nuxt.js', 'Solid.js', 'Qwik'],
  css: ['Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'Styled Components', 'Ant Design', 'Sass/SCSS', 'CSS Modules', 'Shadcn UI'],
  backend: ['Node.js/Express', 'Python/FastAPI', 'Python/Django', 'Ruby on Rails', 'Go', 'Java/Spring', '.NET', 'Supabase', 'Firebase', 'NestJS', 'Rust/Actix'],
  llm: ['Claude Opus', 'Claude Sonnet', 'GPT-4o', 'GPT-4o-mini', 'Gemini Pro', 'Llama 3', 'Mistral', 'Grok', 'DeepSeek', 'Cohere'],
  mcp: ['Claude MCP', 'Filesystem MCP', 'GitHub MCP', 'Slack MCP', 'Database MCP', 'Web Search MCP', 'Brave MCP', 'Memory MCP'],
  testing: ['Jest', 'Playwright', 'Cypress', 'Vitest', 'Mocha', 'Selenium', 'Puppeteer', 'Testing Library', 'Storybook', 'Postman'],
  deployment: ['Docker', 'AWS', 'Vercel', 'Netlify', 'Google Cloud', 'Azure', 'Railway', 'Fly.io', 'DigitalOcean', 'Heroku', 'Cloudflare'],
  reporting: ['Zoho Analytics', 'Metabase', 'Grafana', 'Power BI', 'Tableau', 'Apache Superset', 'Looker', 'Redash'],
  apis: ['Stripe', 'Twilio', 'SendGrid', 'Auth0', 'Firebase Auth', 'Cloudinary', 'Mapbox', 'OpenAI API', 'Anthropic API', 'AWS S3'],
  localLlm: ['Ollama', 'LM Studio', 'llama.cpp', 'vLLM', 'GPT4All', 'Jan', 'LocalAI', 'Kobold.cpp'],
  evalTools: ['LangSmith', 'Weights & Biases', 'MLflow', 'Arize', 'Braintrust', 'Promptfoo', 'Humanloop', 'Langfuse'],
  additional: ['n8n', 'Zapier', 'Redis', 'PostgreSQL', 'MongoDB', 'Elasticsearch', 'RabbitMQ', 'Kafka', 'GraphQL', 'Prisma']
};

export const HELP_TEXTS = {
  appName: 'Enter a concise, memorable name for your application. This will be used throughout all documentation and branding materials. Keep it under 50 characters for optimal readability.',
  appIdea: 'Provide a brief description of your application concept. Focus on the core value proposition and primary use case. Maximum 100 characters to ensure clarity.',
  problemStatement: 'Clearly articulate the specific problems or pain points your application will address. Be specific about user challenges, inefficiencies, or gaps in existing solutions. Good problem statements are measurable and focused.',
  goal: 'Define the primary objective of your application. Include specific, measurable success criteria such as "reduce processing time by 50%" or "improve user satisfaction to 4.5/5 rating".',
  demography: 'Select up to 3 demographic segments that best represent your target users. Consider factors like job role, industry, experience level, and organizational size.',
  geography: 'Choose up to 3 geographical regions where your application will be primarily used. This helps with localization, compliance, and market strategy planning.',
  outOfScope: 'List features, functionality, or requirements that are explicitly excluded from version 1.0. This helps manage stakeholder expectations and maintain project focus.',
  documents: 'Upload supporting documents to provide context for PRD generation. Documents are optional but recommended for comprehensive PRD creation. Accepted formats include PDFs, Word docs, Excel spreadsheets, images, and videos.',
  platform: 'Select the primary platform for your application. This choice influences technical architecture, development approach, and deployment strategy.',
  appStructure: 'Define the main navigation and screen structure of your application. Default Screen is the first screen users see, Working Screen is where primary tasks occur, and Other Screens include settings, profiles, etc.',
  techStack: 'Specify your preferred technologies across all layers of the application stack. Consider factors like team expertise, scalability requirements, and ecosystem maturity.',
  competitors: 'Identify 3 main competitors or alternative solutions. AI will analyze their strengths and weaknesses to help position your product effectively in the market.',
  logo: 'Upload your primary logo in vector format (SVG) for best quality, or high-resolution PNG/JPG. Secondary logo/icon is used for favicons, app icons, and small spaces.',
  photos: 'Upload brand photography or stock images that represent your brand aesthetic. These will guide the visual direction of your application.',
  colors: 'Select brand colors that will be used consistently throughout your application. The system checks WCAG contrast ratios to ensure accessibility compliance.',
  typography: 'Choose fonts for body text and headings. Body font should be highly readable, while heading font can be more distinctive. Ensure both fonts support all required character sets.',
  headingSizes: 'Define font sizes for each heading level and body text. Maintain a clear typographic hierarchy with sufficient size difference between levels.',
  charts: 'Define your data visualization color palette and styling guidelines. Consistent chart styling improves user comprehension and brand recognition.',
  images: 'Set standards for image treatment including border radius, aspect ratios, and quality requirements. Consistent image styling creates a cohesive visual experience.',
  timeline: 'Set project deadlines and define key milestones. Include deliverables, review points, and critical path items. Clear timelines help coordinate team efforts.',
  prdReview: 'Systematically review each section of your PRD to ensure completeness and accuracy. Check all checkboxes to confirm each area has been thoroughly reviewed.',
  proposal: 'Choose a proposal template that matches your client type and project scope. Each template emphasizes different aspects of the project.',
  export: 'Export your PRD in the format that best suits your workflow. PDF for sharing, DOC for collaborative editing, JSON for programmatic access.'
};

export const INITIAL_FORM_DATA = {
  appName: '',
  appIdea: '',
  useTemplate: false,
  prdPromptTemplate: '',
  istvonData: {
    level: '', persona: '', goal: '', background: '',
    sourceFiles: '', externalLinks: '', trained: '',
    language: '', libraries: '', api: '',
    tables: '', weights: '', biases: '', outputLength: '',
    pipeType: '', keyMetrics: '', codeBlock: '', quality: '',
    clarification: '', exploration: '', app: ''
  },
  problemStatement: '',
  goal: '',
  targetAudienceDemography: [],
  targetAudienceGeography: [],
  outOfScope: '',
  uploadedFiles: [],
  uploadedPhotos: [],
  documentChecklist: {},
  googleDriveLink: '',
  oneDriveLink: '',
  zipFiles: [],
  platform: [],
  numberOfUsers: '',
  numberOfAdmins: '',
  appStructure: { defaultScreen: '', workingScreen: '', otherScreens: '' },
  usePreviousTechStack: false,
  selectedTechStack: {
    frontend: [], css: [], backend: [], llm: [], mcp: [], testing: [],
    deployment: [], reporting: [], additional: [], apis: [], localLlm: [], evalTools: []
  },
  competitors: [
    { name: '', url: '', analysis: '' },
    { name: '', url: '', analysis: '' },
    { name: '', url: '', analysis: '' }
  ],
  primaryColor: '#0093B6',
  secondaryColor: '#0093B6',
  accentColor: '#009688',
  primaryLogo: null,
  secondaryLogo: null,
  primaryFont: 'Inter',
  headingsFont: 'Poppins',
  h1Size: '48px',
  h2Size: '36px',
  h3Size: '24px',
  h4Size: '20px',
  h5Size: '18px',
  bodySize: '16px',
  chartColor1: '#0093B6',
  chartColor2: '#0093B6',
  chartColor3: '#009688',
  chartColor4: '#F59E0B',
  chartColor5: '#EF4444',
  chartGuidelines: '',
  imageStyles: [],
  imageGuidelines: '',
  imageBorderRadius: '8px',
  imageAspectRatio: '16:9',
  imageQuality: '1920x1080',
  generatedPRD: '',
  assignedTeam: [],
  dueDate: '',
  milestones: [],
  projectType: '',
  prdVersion: '1.0',
  proposalTemplate: 'standard',
  coverLetter: '',

  // === Step 1 Additions ===

  // 1.3 User Personas
  primaryUserPersonas: [],
  secondaryUsers: [],

  // 1.4 User Journey
  userJourney: {
    onboardingSteps: [],
    coreUsageFlow: '',
    successMilestones: []
  },
  userStories: [],

  // 1.5 MVP Feature Prioritization (MoSCoW)
  featurePriority: {
    mustHave: [], shouldHave: [], couldHave: [], wontHave: []
  },

  // 1.6 Success Metrics
  successMetrics: {
    activationMetrics: [], engagementMetrics: [], businessMetrics: []
  },
  successTimeline: {
    thirtyDayGoals: '', ninetyDayGoals: '', oneYearVision: ''
  },

  // === Step 2 Additions ===

  // 2.2 Navigation Architecture
  navigationArchitecture: {
    primaryNav: [], secondaryNav: [], screenFlowConnections: ''
  },

  // 2.3 Tech Justifications
  techStackJustifications: {
    frontend: '', backend: '', css: '', llm: '', mcp: '', testing: '',
    deployment: '', reporting: '', apis: '', localLlm: '', evalTools: '', additional: ''
  },

  // 2.4 Database Architecture
  dataModels: [],
  apiSpecification: {
    authMethods: [], coreEndpoints: [], integrationRequirements: []
  },

  // 2.5 Security & Compliance
  security: { dataEncryption: [], authMethods: [], accessControl: [] },
  compliance: { gdpr: false, soc2: false, hipaa: false, dataResidency: '' },

  // 2.6 Performance & Scalability
  performanceTargets: { loadTime: '', concurrentUsers: '', dataVolume: '' },
  scalabilityPlan: { growthProjections: '', infrastructureScaling: '' },

  // 2.7 Competitive Positioning
  competitivePositioning: { keyDifferentiators: [], pricingStrategy: '', marketPositioning: '' },

  // === Step 3 Additions ===

  // 3.2 Type Scale
  typeScale: {
    fontSizes: { xs: '12px', sm: '14px', base: '16px', lg: '18px', xl: '20px', '2xl': '24px', '3xl': '30px', '4xl': '36px', '5xl': '48px' },
    lineHeights: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
    fontWeights: { light: '300', normal: '400', medium: '500', semibold: '600', bold: '700' },
    usageGuidelines: ''
  },

  // 3.2 Component Specs
  componentSpecs: {
    buttonStyles: {
      primary: { bgColor: '', textColor: '', borderRadius: '', padding: '' },
      secondary: { bgColor: '', textColor: '', borderRadius: '', padding: '' },
      ghost: { bgColor: '', textColor: '', borderRadius: '', padding: '' }
    },
    formInputSpecs: { borderStyle: '', focusState: '', errorState: '', disabledState: '' },
    navComponents: { headerStyle: '', sidebarStyle: '', mobileMenuStyle: '' },
    dataDisplayComponents: { tableStyle: '', cardStyle: '', listStyle: '' }
  },

  // 3.3 Dashboard Layout
  dashboardLayout: {
    gridSystem: '',
    responsiveBreakpoints: { mobile: '640px', tablet: '768px', desktop: '1024px', wide: '1280px' },
    infoHierarchy: '',
    interactiveElements: []
  },

  // 3.4 UX Guidelines
  uxGuidelines: {
    interactionPatterns: { clickTargets: '', animationGuidelines: '', loadingStates: '', errorStates: '' },
    accessibility: { wcagLevel: 'AA', screenReaderCompat: false, keyboardNav: false }
  },

  // 3.5 Responsive Design
  responsiveDesign: {
    breakpoints: {
      mobile: { width: '640px', layout: '' },
      tablet: { width: '768px', layout: '' },
      desktop: { width: '1024px', layout: '' }
    },
    crossPlatform: { browserCompat: [], mobileVsWeb: '' }
  },

  // 3.6 Wireframes
  wireframes: { keyScreenFlows: [], prototypeSpecs: '' },

  // === Step 4 Additions ===

  // 4.1 Development Phases
  developmentPhases: [],

  // 4.2 Implementation Roadmap
  implementationRoadmap: { weeklySchedule: [], featureOrder: [], testMilestones: [] },
  riskAssessment: { technicalRisks: [], businessRisks: [], dependencyManagement: '' },

  // 4.3 Testing Strategy
  testingStrategy: {
    unitTesting: { target: '', tools: '' },
    integrationTesting: { specs: '' },
    e2eTesting: { criticalPaths: [] }
  },
  qaProcess: { codeReviewProcess: '', performanceTesting: '', securityTesting: '' },

  // 4.4 Deployment Strategy
  deploymentStrategy: {
    environments: {
      development: { specs: '' },
      staging: { specs: '' },
      production: { specs: '' }
    },
    cicdPipeline: '',
    monitoring: ''
  },
  launchPlan: { softLaunchStrategy: '', betaTesting: '', publicLaunchTimeline: '' },

  // 4.5 Documentation Requirements
  documentationReqs: {
    technical: { apiDocs: '', dbSchemaDocs: '', deploymentGuides: '' },
    user: { onboardingMaterials: '', helpSystem: '', trainingResources: '' }
  },

  // 4.6 Budget & Resource Planning
  budgetPlanning: {
    costs: { developmentCosts: '', operationalCosts: '', marketingCosts: '' },
    team: { requiredRoles: [], scalingTimeline: '', contractorNeeds: '' }
  },

  // 4.7 Output Customization
  outputCustomization: { technicalDepthLevel: 'detailed', stakeholderVersions: [], exportFormats: [] },

  // 4.8 Implementation Guide
  implementationGuide: { devTeamHandoff: '', pmTemplates: '', successMetricsTracking: '' }
};

// === New Constant Arrays (Phase B) ===

export const PRIORITY_CATEGORIES = [
  { key: 'mustHave', label: 'Must Have', color: 'red', description: 'Critical for launch' },
  { key: 'shouldHave', label: 'Should Have', color: 'orange', description: 'Important but not critical' },
  { key: 'couldHave', label: 'Could Have', color: 'blue', description: 'Nice to have' },
  { key: 'wontHave', label: "Won't Have", color: 'gray', description: 'Out of scope for v1' }
];

export const WCAG_LEVELS = ['A', 'AA', 'AAA'];

export const TECH_DEPTH_LEVELS = [
  { value: 'high-level', label: 'High-Level', description: 'Executive summary, strategic overview' },
  { value: 'detailed', label: 'Detailed', description: 'Full specifications with implementation details' },
  { value: 'technical', label: 'Technical', description: 'Deep technical specs for engineering teams' }
];

export const ENCRYPTION_OPTIONS = ['AES-256', 'TLS 1.3', 'RSA-2048', 'SHA-256', 'End-to-End Encryption', 'At-Rest Encryption', 'In-Transit Encryption'];

export const AUTH_METHOD_OPTIONS = ['OAuth 2.0', 'JWT', 'SAML', 'API Keys', 'Session Tokens', 'Biometric', 'SSO', 'Magic Links', 'Passkeys'];

export const ACCESS_CONTROL_OPTIONS = ['RBAC', 'ABAC', 'MFA', 'IP Whitelisting', 'Rate Limiting', 'Audit Logging', 'Least Privilege'];

export const BROWSER_OPTIONS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Samsung Internet', 'Brave'];

export const DATA_RESIDENCY_OPTIONS = ['US', 'EU', 'Asia-Pacific', 'Canada', 'Australia', 'India', 'UK', 'Global'];

export const DEFAULT_ONBOARDING_STEPS = [
  { step: 'Sign Up', description: 'User creates account', estimatedTime: '2 min' },
  { step: 'Profile Setup', description: 'Complete user profile', estimatedTime: '3 min' },
  { step: 'Feature Tour', description: 'Guided walkthrough of key features', estimatedTime: '5 min' },
  { step: 'First Action', description: 'Complete primary task', estimatedTime: '5 min' },
  { step: 'Value Moment', description: 'Experience core value proposition', estimatedTime: '10 min' }
];

export const USER_STORY_TEMPLATE = { asA: '', iWantTo: '', soThat: '' };

export const DATA_MODEL_TEMPLATE = {
  entityName: '',
  fields: [{ name: '', type: 'string', required: false }],
  relationships: [{ type: 'hasMany', relatedEntity: '' }]
};

export const API_ENDPOINT_TEMPLATE = { method: 'GET', endpoint: '', description: '' };

export const DEV_PHASE_TEMPLATE = {
  phaseName: '',
  deliverables: [],
  dependencies: [],
  resourceAllocation: ''
};

export const RISK_TEMPLATE = { risk: '', likelihood: 'medium', impact: 'medium', mitigation: '' };

export const TEAM_ROLE_TEMPLATE = { role: '', count: 1, timing: 'full-time' };

export const RELATIONSHIP_TYPES = ['hasMany', 'hasOne', 'belongsTo', 'manyToMany'];

export const FIELD_TYPES = ['string', 'number', 'boolean', 'date', 'text', 'json', 'uuid', 'email', 'enum', 'array'];

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export const NEW_HELP_TEXTS = {
  userPersonas: 'Define detailed user personas including demographics, roles, pain points, goals, and success metrics. This helps align the product with real user needs.',
  userJourney: 'Map the user journey from onboarding through core usage. Define key milestones that indicate successful adoption.',
  userStories: 'Write user stories in the format "As a [role], I want to [action], so that [benefit]". These drive feature development.',
  featurePriority: 'Prioritize features using the MoSCoW method: Must Have (critical for launch), Should Have (important), Could Have (nice to have), Won\'t Have (out of scope).',
  successMetrics: 'Define KPIs across activation (initial engagement), engagement (ongoing usage), and business (revenue/growth) categories.',
  navigationArch: 'Define the primary and secondary navigation structure. Map screen flow connections to ensure intuitive user paths.',
  techJustifications: 'Provide rationale for each technology choice. Consider team expertise, scalability, ecosystem maturity, and cost.',
  databaseArch: 'Design your data model with entities, fields, and relationships. Define API specifications including auth methods and core endpoints.',
  securityCompliance: 'Specify security measures (encryption, authentication, access control) and compliance requirements (GDPR, SOC2, HIPAA).',
  performanceTargets: 'Set specific performance targets for load time, concurrent users, and data volume. Plan for scalability.',
  competitivePosition: 'Identify key differentiators, pricing strategy, and market positioning relative to competitors.',
  typeScale: 'Define a complete type scale with font sizes, line heights, and font weights for consistent typography across the application.',
  componentSpecs: 'Specify styles for buttons, form inputs, navigation, and data display components to ensure design consistency.',
  dashboardLayout: 'Configure the grid system, responsive breakpoints, information hierarchy, and interactive elements for dashboards.',
  uxGuidelines: 'Set interaction patterns, animation guidelines, loading/error states, and accessibility requirements (WCAG compliance).',
  responsiveDesign: 'Configure breakpoints for mobile, tablet, and desktop. Specify browser compatibility and mobile-vs-web differences.',
  devPhases: 'Break the project into development phases with deliverables, dependencies, and resource allocation per phase.',
  testingStrategy: 'Define unit testing targets, integration testing specs, E2E critical paths, and QA review processes.',
  deploymentStrategy: 'Configure environments (dev/staging/prod), CI/CD pipeline, monitoring, and launch plan (soft launch/beta/public).',
  budgetPlanning: 'Estimate costs (development, operational, marketing), define team roles, and plan scaling timeline.',
  documentationReqs: 'Plan technical documentation (API docs, DB schema, deployment guides) and user documentation (onboarding, help, training).',
  wireframes: 'Define key screen flows and prototype specifications to guide the design and development process.',
  implementationRoadmap: 'Create a weekly schedule, feature delivery order, and test milestones. Assess technical and business risks.',
  outputCustomization: 'Choose technical depth level and select which stakeholder versions to generate for the final PRD output.'
};

// Additional PRD Review Checklist items for new sections
export const EXTENDED_PRD_REVIEW_CHECKLIST = [
  { id: 'user_personas', label: 'User Personas defined', category: 'Users', checkField: 'primaryUserPersonas', prdSearch: 'User Personas' },
  { id: 'user_journey', label: 'User Journey mapped', category: 'Users', checkField: 'userJourney', prdSearch: 'User Journey' },
  { id: 'feature_priority', label: 'Feature Priority (MoSCoW) set', category: 'Features', checkField: 'featurePriority', prdSearch: 'Feature Priority' },
  { id: 'success_kpis', label: 'Success KPIs & Timeline defined', category: 'Metrics', checkField: 'successMetrics', prdSearch: 'KPI' },
  { id: 'security_compliance', label: 'Security & Compliance reviewed', category: 'Technical', checkField: 'security', prdSearch: 'Security' },
  { id: 'performance_targets', label: 'Performance Targets set', category: 'Technical', checkField: 'performanceTargets', prdSearch: 'Performance' },
  { id: 'testing_strategy', label: 'Testing Strategy defined', category: 'Quality', checkField: 'testingStrategy', prdSearch: 'Testing' },
  { id: 'deployment_plan', label: 'Deployment Strategy planned', category: 'Technical', checkField: 'deploymentStrategy', prdSearch: 'Deployment' },
  { id: 'budget_resources', label: 'Budget & Resources estimated', category: 'Planning', checkField: 'budgetPlanning', prdSearch: 'Budget' },
  { id: 'documentation_plan', label: 'Documentation plan created', category: 'Documentation', checkField: 'documentationReqs', prdSearch: 'Documentation' }
];

export const STORAGE_KEYS = {
  FORM_DATA: 'prd_form_data',
  API_KEY: 'prd_ai_api_key',
  API_PROVIDER: 'prd_ai_provider',
  PREVIOUS_TECH_STACK: 'prd_previous_tech_stack'
};

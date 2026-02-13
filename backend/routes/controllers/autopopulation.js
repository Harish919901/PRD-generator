const express = require('express');
const router = express.Router();
const { callAI } = require('../services/aiCaller');
const { parseAIResponse } = require('../services/responseParser');

// 1. POST /generate-user-personas
router.post('/generate-user-personas', async (req, res) => {
  try {
    const { appName, appIdea, demographics } = req.body;
    const prompt = `Generate detailed user personas for "${appName}" (${appIdea}). Demographics: ${(demographics || []).join(', ')}.
Return JSON: {"personas":[{"demographic":"...","role":"...","painPoints":["..."],"goals":["..."],"successMetrics":["..."]}]}
Generate 3-5 personas. Be specific and actionable.`;
    const result = await callAI(prompt, 'You are a UX researcher specializing in user persona development.', 3000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. POST /generate-user-stories
router.post('/generate-user-stories', async (req, res) => {
  try {
    const { appName, appIdea, platform, audience } = req.body;
    const prompt = `Generate user stories for "${appName}" (${appIdea}). Platform: ${(platform||[]).join(', ')}. Audience: ${(audience||[]).join(', ')}.
Return JSON: {"userStories":[{"asA":"...","iWantTo":"...","soThat":"..."}]}
Generate 8-12 user stories covering core functionality.`;
    const result = await callAI(prompt, 'You are a product manager writing user stories.', 3000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. POST /generate-user-journey
router.post('/generate-user-journey', async (req, res) => {
  try {
    const { appName, appIdea, platform } = req.body;
    const prompt = `Generate a user journey for "${appName}" (${appIdea}). Platform: ${(platform||[]).join(', ')}.
Return JSON: {"onboardingSteps":[{"step":"...","description":"...","estimatedTime":"..."}],"coreUsageFlow":"...","successMilestones":["..."]}
Include 5 onboarding steps, a detailed core usage flow, and 4-6 success milestones.`;
    const result = await callAI(prompt, 'You are a UX designer mapping user journeys.', 3000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. POST /generate-mvp-features
router.post('/generate-mvp-features', async (req, res) => {
  try {
    const { appName, appIdea, platform, audience } = req.body;
    const prompt = `Generate MoSCoW prioritized features for "${appName}" (${appIdea}). Platform: ${(platform||[]).join(', ')}. Audience: ${(audience||[]).join(', ')}.
Return JSON: {"mustHave":["..."],"shouldHave":["..."],"couldHave":["..."],"wontHave":["..."]}
Must Have: 5-8 critical launch features. Should Have: 4-6 important features. Could Have: 3-5 nice-to-haves. Won't Have: 3-4 explicitly excluded.`;
    const result = await callAI(prompt, 'You are a product strategist prioritizing MVP features.', 2000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. POST /generate-success-metrics
router.post('/generate-success-metrics', async (req, res) => {
  try {
    const { appName, appIdea, audience, numberOfUsers } = req.body;
    const prompt = `Generate success metrics for "${appName}" (${appIdea}). Audience: ${(audience||[]).join(', ')}. Target users: ${numberOfUsers || 'not specified'}.
Return JSON: {"activationMetrics":["..."],"engagementMetrics":["..."],"businessMetrics":["..."],"timeline":{"thirtyDayGoals":"...","ninetyDayGoals":"...","oneYearVision":"..."}}
Include 3-5 metrics per category with specific measurable targets.`;
    const result = await callAI(prompt, 'You are a growth analyst defining KPIs.', 3000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. POST /generate-nav-architecture
router.post('/generate-nav-architecture', async (req, res) => {
  try {
    const { appStructure, platform, appName } = req.body;
    const prompt = `Generate navigation architecture for "${appName}". Platform: ${(platform||[]).join(', ')}. App structure: ${JSON.stringify(appStructure || {})}.
Return JSON: {"primaryNav":["..."],"secondaryNav":["..."],"screenFlowConnections":"..."}
Primary nav: 4-7 main navigation items. Secondary: 3-5 utility items. Flow connections: describe how screens connect.`;
    const result = await callAI(prompt, 'You are an information architect designing navigation systems.', 2500);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. POST /generate-tech-justifications
router.post('/generate-tech-justifications', async (req, res) => {
  try {
    const { selectedTechStack, appName, platform, numberOfUsers } = req.body;
    const prompt = `Generate technology justifications for "${appName}". Platform: ${(platform||[]).join(', ')}. Users: ${numberOfUsers || 'not specified'}.
Selected stack: ${JSON.stringify(selectedTechStack || {})}.
Return JSON with a justification string for each category that has selections: {"frontend":"...","backend":"...","css":"...","llm":"...","mcp":"...","testing":"...","deployment":"...","reporting":"...","apis":"...","localLlm":"...","evalTools":"...","additional":"..."}
Only include categories that have selections. Each justification should be 2-3 sentences explaining why that choice is appropriate.`;
    const result = await callAI(prompt, 'You are a technical architect justifying technology choices.', 3000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. POST /generate-database-architecture
router.post('/generate-database-architecture', async (req, res) => {
  try {
    const { appName, appIdea, platform, techStack } = req.body;
    const prompt = `Generate database architecture for "${appName}" (${appIdea}). Platform: ${(platform||[]).join(', ')}. Tech: ${JSON.stringify(techStack || {})}.
Return JSON: {"dataModels":[{"entityName":"...","fields":[{"name":"...","type":"string|number|boolean|date|text|json|uuid|email|enum|array","required":true/false}],"relationships":[{"type":"hasMany|hasOne|belongsTo|manyToMany","relatedEntity":"..."}]}],"apiSpec":{"authMethods":["..."],"coreEndpoints":[{"method":"GET|POST|PUT|DELETE","endpoint":"...","description":"..."}],"integrationRequirements":["..."]}}
Generate 4-8 data models with appropriate fields and relationships. Include 10-15 API endpoints.`;
    const result = await callAI(prompt, 'You are a database architect designing data models and API specs.', 4000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. POST /generate-security-compliance
router.post('/generate-security-compliance', async (req, res) => {
  try {
    const { appName, audience, platform } = req.body;
    const prompt = `Generate security and compliance recommendations for "${appName}". Audience: ${(audience||[]).join(', ')}. Platform: ${(platform||[]).join(', ')}.
Return JSON: {"security":{"dataEncryption":["..."],"authMethods":["..."],"accessControl":["..."]},"compliance":{"gdpr":true/false,"soc2":true/false,"hipaa":true/false,"dataResidency":"..."}}
Recommend appropriate security measures and compliance requirements based on the audience and platform.`;
    const result = await callAI(prompt, 'You are a security consultant advising on application security.', 3000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. POST /generate-performance-targets
router.post('/generate-performance-targets', async (req, res) => {
  try {
    const { numberOfUsers, platform, appName } = req.body;
    const prompt = `Generate performance targets for "${appName}". Platform: ${(platform||[]).join(', ')}. Expected users: ${numberOfUsers || 'not specified'}.
Return JSON: {"performanceTargets":{"loadTime":"...","concurrentUsers":"...","dataVolume":"..."},"scalabilityPlan":{"growthProjections":"...","infrastructureScaling":"..."}}
Be specific with numbers and thresholds.`;
    const result = await callAI(prompt, 'You are a performance engineer setting targets.', 2500);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 11. POST /generate-competitive-positioning
router.post('/generate-competitive-positioning', async (req, res) => {
  try {
    const { competitors, appName, appIdea } = req.body;
    const prompt = `Generate competitive positioning for "${appName}" (${appIdea}). Competitors: ${JSON.stringify(competitors || [])}.
Return JSON: {"keyDifferentiators":["..."],"pricingStrategy":"...","marketPositioning":"..."}
Identify 4-6 key differentiators, suggest a pricing strategy, and describe market positioning.`;
    const result = await callAI(prompt, 'You are a market strategist analyzing competitive positioning.', 2500);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 12. POST /generate-design-system
router.post('/generate-design-system', async (req, res) => {
  try {
    const { colors, fonts, platform } = req.body;
    const prompt = `Generate a design system for an app. Colors: ${JSON.stringify(colors || {})}. Fonts: ${JSON.stringify(fonts || {})}. Platform: ${(platform||[]).join(', ')}.
Return JSON: {"typeScale":{"fontSizes":{"xs":"12px","sm":"14px","base":"16px","lg":"18px","xl":"20px","2xl":"24px","3xl":"30px","4xl":"36px","5xl":"48px"},"lineHeights":{"tight":"1.25","normal":"1.5","relaxed":"1.75"},"fontWeights":{"light":"300","normal":"400","medium":"500","semibold":"600","bold":"700"},"usageGuidelines":"..."},"componentSpecs":{"buttonStyles":{"primary":{"bgColor":"...","textColor":"...","borderRadius":"...","padding":"..."},"secondary":{"bgColor":"...","textColor":"...","borderRadius":"...","padding":"..."},"ghost":{"bgColor":"...","textColor":"...","borderRadius":"...","padding":"..."}},"formInputSpecs":{"borderStyle":"...","focusState":"...","errorState":"...","disabledState":"..."},"navComponents":{"headerStyle":"...","sidebarStyle":"...","mobileMenuStyle":"..."},"dataDisplayComponents":{"tableStyle":"...","cardStyle":"...","listStyle":"..."}}}`;
    const result = await callAI(prompt, 'You are a design system architect.', 3000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 13. POST /generate-ux-guidelines
router.post('/generate-ux-guidelines', async (req, res) => {
  try {
    const { platform, audience, appName } = req.body;
    const prompt = `Generate UX guidelines for "${appName}". Platform: ${(platform||[]).join(', ')}. Audience: ${(audience||[]).join(', ')}.
Return JSON: {"interactionPatterns":{"clickTargets":"...","animationGuidelines":"...","loadingStates":"...","errorStates":"..."},"accessibility":{"wcagLevel":"AA","screenReaderCompat":true/false,"keyboardNav":true/false},"responsiveDesign":{"breakpoints":{"mobile":{"width":"640px","layout":"..."},"tablet":{"width":"768px","layout":"..."},"desktop":{"width":"1024px","layout":"..."}},"crossPlatform":{"browserCompat":["..."],"mobileVsWeb":"..."}}}`;
    const result = await callAI(prompt, 'You are a UX designer creating interaction guidelines.', 2500);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 14. POST /generate-dev-phases
router.post('/generate-dev-phases', async (req, res) => {
  try {
    const { appName, features, platform, techStack } = req.body;
    const prompt = `Generate development phases for "${appName}". Platform: ${(platform||[]).join(', ')}. Tech: ${JSON.stringify(techStack || {})}. Features: ${JSON.stringify(features || {})}.
Return JSON: {"phases":[{"phaseName":"...","deliverables":["..."],"dependencies":["..."],"resourceAllocation":"..."}]}
Generate 4-6 phases covering: setup, core features, integrations, testing, deployment, launch.`;
    const result = await callAI(prompt, 'You are a project manager planning development phases.', 3500);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 15. POST /generate-implementation-roadmap
router.post('/generate-implementation-roadmap', async (req, res) => {
  try {
    const { devPhases, techStack, teamSize } = req.body;
    const prompt = `Generate implementation roadmap. Phases: ${JSON.stringify(devPhases || [])}. Tech: ${JSON.stringify(techStack || {})}. Team size: ${teamSize || 'not specified'}.
Return JSON: {"weeklySchedule":[{"week":"Week 1","tasks":"..."}],"featureOrder":["..."],"testMilestones":["..."],"risks":{"technicalRisks":[{"risk":"...","likelihood":"low|medium|high","impact":"low|medium|high","mitigation":"..."}],"businessRisks":[{"risk":"...","likelihood":"...","impact":"...","mitigation":"..."}],"dependencyManagement":"..."}}
Generate 8-12 weeks, 6-10 feature priorities, 4-6 test milestones, 3-4 risks each.`;
    const result = await callAI(prompt, 'You are a technical program manager creating roadmaps.', 4000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 16. POST /generate-testing-strategy
router.post('/generate-testing-strategy', async (req, res) => {
  try {
    const { platform, techStack, appName } = req.body;
    const prompt = `Generate testing strategy for "${appName}". Platform: ${(platform||[]).join(', ')}. Tech: ${JSON.stringify(techStack || {})}.
Return JSON: {"unitTesting":{"target":"...","tools":"..."},"integrationTesting":{"specs":"..."},"e2eTesting":{"criticalPaths":["..."]},"qa":{"codeReviewProcess":"...","performanceTesting":"...","securityTesting":"..."}}`;
    const result = await callAI(prompt, 'You are a QA architect designing test strategies.', 3000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 17. POST /generate-deployment-strategy
router.post('/generate-deployment-strategy', async (req, res) => {
  try {
    const { platform, techStack, deployment } = req.body;
    const prompt = `Generate deployment strategy. Platform: ${(platform||[]).join(', ')}. Tech: ${JSON.stringify(techStack || {})}. Deployment tools: ${(deployment||[]).join(', ')}.
Return JSON: {"environments":{"development":{"specs":"..."},"staging":{"specs":"..."},"production":{"specs":"..."}},"cicdPipeline":"...","monitoring":"...","launchPlan":{"softLaunchStrategy":"...","betaTesting":"...","publicLaunchTimeline":"..."}}`;
    const result = await callAI(prompt, 'You are a DevOps engineer planning deployment strategies.', 3500);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 18. POST /generate-documentation-plan
router.post('/generate-documentation-plan', async (req, res) => {
  try {
    const { appName, techStack, platform } = req.body;
    const prompt = `Generate documentation plan for "${appName}". Tech: ${JSON.stringify(techStack || {})}. Platform: ${(platform||[]).join(', ')}.
Return JSON: {"technical":{"apiDocs":"...","dbSchemaDocs":"...","deploymentGuides":"..."},"user":{"onboardingMaterials":"...","helpSystem":"...","trainingResources":"..."}}`;
    const result = await callAI(prompt, 'You are a technical writer planning documentation.', 3000);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 19. POST /generate-budget-estimation
router.post('/generate-budget-estimation', async (req, res) => {
  try {
    const { appName, techStack, timeline, teamSize, platform } = req.body;
    const prompt = `Generate budget estimation for "${appName}". Tech: ${JSON.stringify(techStack || {})}. Timeline: ${timeline || 'not specified'}. Team: ${teamSize || 'not specified'}. Platform: ${(platform||[]).join(', ')}.
Return JSON: {"costs":{"developmentCosts":"...","operationalCosts":"...","marketingCosts":"..."},"team":{"requiredRoles":[{"role":"...","count":1,"timing":"full-time|part-time|contract"}],"scalingTimeline":"...","contractorNeeds":"..."}}
Be specific with cost estimates and team composition.`;
    const result = await callAI(prompt, 'You are a project budget analyst.', 3500);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

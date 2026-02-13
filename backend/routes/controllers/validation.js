const express = require('express');
const router = express.Router();
const { callAI } = require('../services/aiCaller');
const { parseAIResponse } = require('../services/responseParser');

// 20. POST /validate-tech-stack
router.post('/validate-tech-stack', async (req, res) => {
  try {
    const { selectedTechStack } = req.body;
    const prompt = `Validate this technology stack for compatibility: ${JSON.stringify(selectedTechStack)}.
Return JSON: {"compatible":true/false,"warnings":["..."],"recommendations":["..."],"incompatibilities":["..."]}
Check for version conflicts, architectural mismatches, and suggest improvements.`;
    const result = await callAI(prompt, 'You are a technical architect validating tech stacks.', 1500);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 21. POST /validate-timeline
router.post('/validate-timeline', async (req, res) => {
  try {
    const { milestones, features, teamSize } = req.body;
    const prompt = `Validate this project timeline. Milestones: ${JSON.stringify(milestones)}. Features: ${JSON.stringify(features)}. Team: ${teamSize}.
Return JSON: {"feasible":true/false,"warnings":["..."],"suggestions":["..."]}`;
    const result = await callAI(prompt, 'You are a project manager validating timelines.', 1500);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 22. POST /validate-budget
router.post('/validate-budget', async (req, res) => {
  try {
    const { budgetEstimates, features, timeline } = req.body;
    const prompt = `Validate this budget. Budget: ${JSON.stringify(budgetEstimates)}. Features: ${JSON.stringify(features)}. Timeline: ${JSON.stringify(timeline)}.
Return JSON: {"realistic":true/false,"warnings":["..."],"adjustments":["..."]}`;
    const result = await callAI(prompt, 'You are a financial analyst validating project budgets.', 1500);
    res.json({ success: true, data: parseAIResponse(result) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 23. POST /validate-dependencies
router.post('/validate-dependencies', async (req, res) => {
  try {
    const { formData } = req.body;
    const summary = {
      hasAppName: !!formData.appName,
      hasAppIdea: !!formData.appIdea,
      hasPlatform: (formData.platform || []).length > 0,
      hasTechStack: Object.values(formData.selectedTechStack || {}).some(arr => arr.length > 0),
      hasPersonas: (formData.primaryUserPersonas || []).length > 0,
      hasFeatures: Object.values(formData.featurePriority || {}).some(arr => arr.length > 0),
      hasMetrics: Object.values(formData.successMetrics || {}).some(arr => arr.length > 0),
      hasSecurity: Object.values(formData.security || {}).some(arr => arr.length > 0),
      hasTimeline: (formData.milestones || []).length > 0,
      hasBudget: !!(formData.budgetPlanning?.costs?.developmentCosts),
      hasTesting: !!(formData.testingStrategy?.unitTesting?.target),
      hasDeployment: !!(formData.deploymentStrategy?.cicdPipeline)
    };
    const filledCount = Object.values(summary).filter(Boolean).length;
    const totalCount = Object.keys(summary).length;
    const completeness = Math.round((filledCount / totalCount) * 100);

    const prompt = `Analyze PRD completeness: ${JSON.stringify(summary)}. Completeness: ${completeness}%.
Return JSON: {"missingDependencies":["..."],"suggestions":["..."],"completeness":${completeness}}
List what's missing and suggest what to fill next for a complete PRD.`;
    const result = await callAI(prompt, 'You are a PRD quality analyst.', 1500);
    const parsed = parseAIResponse(result);
    parsed.completeness = completeness;
    res.json({ success: true, data: parsed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

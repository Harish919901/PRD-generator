// Export Utilities for PRD Generator
// Handles PDF, DOCX, and JSON exports

import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';

/**
 * Parse markdown content into structured sections
 * @param {string} markdown - The markdown content
 * @returns {Array<{type: string, level?: number, content: string}>}
 */
const parseMarkdown = (markdown) => {
  const lines = markdown.split('\n');
  const elements = [];

  lines.forEach(line => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('# ')) {
      elements.push({ type: 'heading', level: 1, content: trimmedLine.slice(2) });
    } else if (trimmedLine.startsWith('## ')) {
      elements.push({ type: 'heading', level: 2, content: trimmedLine.slice(3) });
    } else if (trimmedLine.startsWith('### ')) {
      elements.push({ type: 'heading', level: 3, content: trimmedLine.slice(4) });
    } else if (trimmedLine.startsWith('#### ')) {
      elements.push({ type: 'heading', level: 4, content: trimmedLine.slice(5) });
    } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      elements.push({ type: 'bullet', content: trimmedLine.slice(2) });
    } else if (trimmedLine.startsWith('* ')) {
      elements.push({ type: 'bullet', content: trimmedLine.slice(2) });
    } else if (/^\d+\.\s/.test(trimmedLine)) {
      elements.push({ type: 'numbered', content: trimmedLine });
    } else if (trimmedLine === '---') {
      elements.push({ type: 'separator' });
    } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      elements.push({ type: 'bold', content: trimmedLine.slice(2, -2) });
    } else if (trimmedLine) {
      elements.push({ type: 'paragraph', content: trimmedLine });
    } else {
      elements.push({ type: 'space' });
    }
  });

  return elements;
};

/**
 * Remove markdown formatting from text
 * @param {string} text - Text with markdown
 * @returns {string}
 */
const stripMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1');
};

/**
 * Export PRD to PDF format
 * @param {string} prdContent - The PRD content in markdown
 * @param {object} formData - Form data for metadata
 * @returns {Promise<Blob>}
 */
export const exportToPDF = async (prdContent, formData) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper to add new page if needed
  const checkPageBreak = (neededHeight = 10) => {
    if (yPosition + neededHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header with gradient effect (simulated with rectangle)
  pdf.setFillColor(0, 147, 182); // Primary color
  pdf.rect(0, 0, pageWidth, 35, 'F');

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Product Requirements Document', margin, 20);

  // Subtitle
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${formData.appName || 'Application'} | Version ${formData.prdVersion || '1.0'}`, margin, 28);

  yPosition = 45;

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Parse and render content
  const elements = parseMarkdown(prdContent);

  elements.forEach(element => {
    switch (element.type) {
      case 'heading':
        checkPageBreak(15);
        if (element.level === 1) {
          pdf.setFontSize(18);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 147, 182);
        } else if (element.level === 2) {
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 147, 182);
        } else {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
        }
        const headingLines = pdf.splitTextToSize(stripMarkdown(element.content), contentWidth);
        pdf.text(headingLines, margin, yPosition);
        yPosition += (headingLines.length * 6) + 4;
        pdf.setTextColor(0, 0, 0);
        break;

      case 'paragraph':
      case 'bold':
        checkPageBreak(8);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', element.type === 'bold' ? 'bold' : 'normal');
        const paraLines = pdf.splitTextToSize(stripMarkdown(element.content), contentWidth);
        pdf.text(paraLines, margin, yPosition);
        yPosition += (paraLines.length * 5) + 2;
        break;

      case 'bullet':
        checkPageBreak(8);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const bulletText = `• ${stripMarkdown(element.content)}`;
        const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 5);
        pdf.text(bulletLines, margin + 5, yPosition);
        yPosition += (bulletLines.length * 5) + 1;
        break;

      case 'numbered':
        checkPageBreak(8);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const numberedLines = pdf.splitTextToSize(stripMarkdown(element.content), contentWidth - 5);
        pdf.text(numberedLines, margin + 5, yPosition);
        yPosition += (numberedLines.length * 5) + 1;
        break;

      case 'separator':
        checkPageBreak(10);
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
        break;

      case 'space':
        yPosition += 3;
        break;
    }
  });

  // --- PDF Helper functions for form data sections ---
  const addPdfSectionHeading = (title) => {
    checkPageBreak(20);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 147, 182);
    const hLines = pdf.splitTextToSize(title, contentWidth);
    pdf.text(hLines, margin, yPosition);
    yPosition += (hLines.length * 6) + 4;
    pdf.setTextColor(0, 0, 0);
  };

  const addPdfSubHeading = (title) => {
    checkPageBreak(12);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const shLines = pdf.splitTextToSize(title, contentWidth);
    pdf.text(shLines, margin, yPosition);
    yPosition += (shLines.length * 5) + 3;
  };

  const addPdfText = (text) => {
    if (!text || !text.trim()) return;
    checkPageBreak(8);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const tLines = pdf.splitTextToSize(text, contentWidth);
    tLines.forEach(line => {
      checkPageBreak(6);
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 2;
  };

  const addPdfBullet = (text) => {
    if (!text || !text.trim()) return;
    checkPageBreak(8);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const bLines = pdf.splitTextToSize(`• ${text}`, contentWidth - 5);
    bLines.forEach(line => {
      checkPageBreak(6);
      pdf.text(line, margin + 5, yPosition);
      yPosition += 5;
    });
    yPosition += 1;
  };

  const addPdfLabelValue = (label, value) => {
    if (!value || (typeof value === 'string' && !value.trim())) return;
    checkPageBreak(8);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const labelStr = `${label}: `;
    const labelWidth = pdf.getTextWidth(labelStr);
    pdf.text(labelStr, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    const valLines = pdf.splitTextToSize(String(value), contentWidth - labelWidth);
    pdf.text(valLines, margin + labelWidth, yPosition);
    yPosition += (valLines.length * 5) + 2;
  };

  // --- Render new form data sections in PDF ---

  // User Personas
  if ((formData.primaryUserPersonas && formData.primaryUserPersonas.length > 0) ||
      (formData.secondaryUsers && formData.secondaryUsers.length > 0)) {
    addPdfSectionHeading('User Personas');
    if (formData.primaryUserPersonas && formData.primaryUserPersonas.length > 0) {
      addPdfSubHeading('Primary User Personas');
      formData.primaryUserPersonas.forEach((persona, i) => {
        if (typeof persona === 'string') {
          addPdfBullet(persona);
        } else if (persona && typeof persona === 'object') {
          const parts = [persona.name, persona.role, persona.painPoints, persona.goals].filter(Boolean);
          addPdfBullet(parts.join(' - ') || `Persona ${i + 1}`);
        }
      });
    }
    if (formData.secondaryUsers && formData.secondaryUsers.length > 0) {
      addPdfSubHeading('Secondary Users');
      formData.secondaryUsers.forEach(user => {
        addPdfBullet(typeof user === 'string' ? user : JSON.stringify(user));
      });
    }
  }

  // User Journey
  const uj = formData.userJourney;
  if (uj && ((uj.onboardingSteps && uj.onboardingSteps.length > 0) || (uj.coreUsageFlow && uj.coreUsageFlow.trim()) || (uj.successMilestones && uj.successMilestones.length > 0))) {
    addPdfSectionHeading('User Journey');
    if (uj.onboardingSteps && uj.onboardingSteps.length > 0) {
      addPdfSubHeading('Onboarding Steps');
      uj.onboardingSteps.forEach(step => {
        if (typeof step === 'string') {
          addPdfBullet(step);
        } else if (step && typeof step === 'object') {
          addPdfBullet(`${step.step || ''}: ${step.description || ''} (${step.estimatedTime || ''})`);
        }
      });
    }
    if (uj.coreUsageFlow && uj.coreUsageFlow.trim()) {
      addPdfSubHeading('Core Usage Flow');
      addPdfText(uj.coreUsageFlow);
    }
    if (uj.successMilestones && uj.successMilestones.length > 0) {
      addPdfSubHeading('Success Milestones');
      uj.successMilestones.forEach(m => addPdfBullet(typeof m === 'string' ? m : JSON.stringify(m)));
    }
  }

  // User Stories
  if (formData.userStories && formData.userStories.length > 0) {
    addPdfSectionHeading('User Stories');
    formData.userStories.forEach((story, i) => {
      if (typeof story === 'string') {
        addPdfBullet(story);
      } else if (story && typeof story === 'object') {
        const storyText = `As a ${story.asA || '...'}, I want to ${story.iWantTo || '...'}, so that ${story.soThat || '...'}`;
        addPdfBullet(storyText);
      }
    });
  }

  // Feature Priority (MoSCoW)
  const fp = formData.featurePriority;
  if (fp && (
    (fp.mustHave && fp.mustHave.length > 0) || (fp.shouldHave && fp.shouldHave.length > 0) ||
    (fp.couldHave && fp.couldHave.length > 0) || (fp.wontHave && fp.wontHave.length > 0)
  )) {
    addPdfSectionHeading('Feature Priority (MoSCoW)');
    if (fp.mustHave && fp.mustHave.length > 0) {
      addPdfSubHeading('Must Have');
      fp.mustHave.forEach(f => addPdfBullet(typeof f === 'string' ? f : JSON.stringify(f)));
    }
    if (fp.shouldHave && fp.shouldHave.length > 0) {
      addPdfSubHeading('Should Have');
      fp.shouldHave.forEach(f => addPdfBullet(typeof f === 'string' ? f : JSON.stringify(f)));
    }
    if (fp.couldHave && fp.couldHave.length > 0) {
      addPdfSubHeading('Could Have');
      fp.couldHave.forEach(f => addPdfBullet(typeof f === 'string' ? f : JSON.stringify(f)));
    }
    if (fp.wontHave && fp.wontHave.length > 0) {
      addPdfSubHeading("Won't Have");
      fp.wontHave.forEach(f => addPdfBullet(typeof f === 'string' ? f : JSON.stringify(f)));
    }
  }

  // Success Metrics
  const sm = formData.successMetrics;
  const st = formData.successTimeline;
  if ((sm && ((sm.activationMetrics && sm.activationMetrics.length > 0) || (sm.engagementMetrics && sm.engagementMetrics.length > 0) || (sm.businessMetrics && sm.businessMetrics.length > 0))) ||
      (st && (st.thirtyDayGoals || st.ninetyDayGoals || st.oneYearVision))) {
    addPdfSectionHeading('Success Metrics');
    if (sm) {
      if (sm.activationMetrics && sm.activationMetrics.length > 0) {
        addPdfSubHeading('Activation Metrics');
        sm.activationMetrics.forEach(m => addPdfBullet(typeof m === 'string' ? m : JSON.stringify(m)));
      }
      if (sm.engagementMetrics && sm.engagementMetrics.length > 0) {
        addPdfSubHeading('Engagement Metrics');
        sm.engagementMetrics.forEach(m => addPdfBullet(typeof m === 'string' ? m : JSON.stringify(m)));
      }
      if (sm.businessMetrics && sm.businessMetrics.length > 0) {
        addPdfSubHeading('Business Metrics');
        sm.businessMetrics.forEach(m => addPdfBullet(typeof m === 'string' ? m : JSON.stringify(m)));
      }
    }
    if (st) {
      if (st.thirtyDayGoals && st.thirtyDayGoals.trim()) addPdfLabelValue('30-Day Goals', st.thirtyDayGoals);
      if (st.ninetyDayGoals && st.ninetyDayGoals.trim()) addPdfLabelValue('90-Day Goals', st.ninetyDayGoals);
      if (st.oneYearVision && st.oneYearVision.trim()) addPdfLabelValue('1-Year Vision', st.oneYearVision);
    }
  }

  // Navigation Architecture
  const na = formData.navigationArchitecture;
  if (na && ((na.primaryNav && na.primaryNav.length > 0) || (na.secondaryNav && na.secondaryNav.length > 0) || (na.screenFlowConnections && na.screenFlowConnections.trim()))) {
    addPdfSectionHeading('Navigation Architecture');
    if (na.primaryNav && na.primaryNav.length > 0) {
      addPdfSubHeading('Primary Navigation');
      na.primaryNav.forEach(n => addPdfBullet(typeof n === 'string' ? n : JSON.stringify(n)));
    }
    if (na.secondaryNav && na.secondaryNav.length > 0) {
      addPdfSubHeading('Secondary Navigation');
      na.secondaryNav.forEach(n => addPdfBullet(typeof n === 'string' ? n : JSON.stringify(n)));
    }
    if (na.screenFlowConnections && na.screenFlowConnections.trim()) {
      addPdfSubHeading('Screen Flow Connections');
      addPdfText(na.screenFlowConnections);
    }
  }

  // Tech Justifications
  const tj = formData.techStackJustifications;
  if (tj && Object.values(tj).some(v => v && v.trim())) {
    addPdfSectionHeading('Tech Stack Justifications');
    const tjLabels = {
      frontend: 'Frontend', backend: 'Backend', css: 'CSS/UI', llm: 'LLM', mcp: 'MCP',
      testing: 'Testing', deployment: 'Deployment', reporting: 'Reporting', apis: 'APIs',
      localLlm: 'Local LLM', evalTools: 'Eval Tools', additional: 'Additional'
    };
    Object.entries(tj).forEach(([key, value]) => {
      if (value && value.trim()) {
        addPdfLabelValue(tjLabels[key] || key, value);
      }
    });
  }

  // Database Architecture
  if ((formData.dataModels && formData.dataModels.length > 0) ||
      (formData.apiSpecification && ((formData.apiSpecification.authMethods && formData.apiSpecification.authMethods.length > 0) ||
        (formData.apiSpecification.coreEndpoints && formData.apiSpecification.coreEndpoints.length > 0) ||
        (formData.apiSpecification.integrationRequirements && formData.apiSpecification.integrationRequirements.length > 0)))) {
    addPdfSectionHeading('Database Architecture & API');
    if (formData.dataModels && formData.dataModels.length > 0) {
      addPdfSubHeading('Data Models');
      formData.dataModels.forEach(model => {
        if (model.entityName) {
          addPdfBullet(`Entity: ${model.entityName}`);
          if (model.fields && model.fields.length > 0) {
            model.fields.forEach(f => {
              if (f.name) addPdfText(`    - ${f.name} (${f.type || 'string'})${f.required ? ' [required]' : ''}`);
            });
          }
          if (model.relationships && model.relationships.length > 0) {
            model.relationships.forEach(r => {
              if (r.relatedEntity) addPdfText(`    -> ${r.type || 'hasMany'} ${r.relatedEntity}`);
            });
          }
        }
      });
    }
    const apiSpec = formData.apiSpecification;
    if (apiSpec) {
      if (apiSpec.authMethods && apiSpec.authMethods.length > 0) {
        addPdfSubHeading('API Auth Methods');
        apiSpec.authMethods.forEach(m => addPdfBullet(typeof m === 'string' ? m : JSON.stringify(m)));
      }
      if (apiSpec.coreEndpoints && apiSpec.coreEndpoints.length > 0) {
        addPdfSubHeading('Core Endpoints');
        apiSpec.coreEndpoints.forEach(ep => {
          if (typeof ep === 'string') {
            addPdfBullet(ep);
          } else if (ep && typeof ep === 'object') {
            addPdfBullet(`${ep.method || 'GET'} ${ep.endpoint || ''} - ${ep.description || ''}`);
          }
        });
      }
      if (apiSpec.integrationRequirements && apiSpec.integrationRequirements.length > 0) {
        addPdfSubHeading('Integration Requirements');
        apiSpec.integrationRequirements.forEach(r => addPdfBullet(typeof r === 'string' ? r : JSON.stringify(r)));
      }
    }
  }

  // Security & Compliance
  const sec = formData.security;
  const comp = formData.compliance;
  if ((sec && ((sec.dataEncryption && sec.dataEncryption.length > 0) || (sec.authMethods && sec.authMethods.length > 0) || (sec.accessControl && sec.accessControl.length > 0))) ||
      (comp && (comp.gdpr || comp.soc2 || comp.hipaa || (comp.dataResidency && comp.dataResidency.trim())))) {
    addPdfSectionHeading('Security & Compliance');
    if (sec) {
      if (sec.dataEncryption && sec.dataEncryption.length > 0) {
        addPdfSubHeading('Data Encryption');
        sec.dataEncryption.forEach(e => addPdfBullet(e));
      }
      if (sec.authMethods && sec.authMethods.length > 0) {
        addPdfSubHeading('Authentication Methods');
        sec.authMethods.forEach(m => addPdfBullet(m));
      }
      if (sec.accessControl && sec.accessControl.length > 0) {
        addPdfSubHeading('Access Control');
        sec.accessControl.forEach(a => addPdfBullet(a));
      }
    }
    if (comp) {
      const complianceItems = [];
      if (comp.gdpr) complianceItems.push('GDPR');
      if (comp.soc2) complianceItems.push('SOC 2');
      if (comp.hipaa) complianceItems.push('HIPAA');
      if (complianceItems.length > 0) addPdfLabelValue('Compliance Standards', complianceItems.join(', '));
      if (comp.dataResidency && comp.dataResidency.trim()) addPdfLabelValue('Data Residency', comp.dataResidency);
    }
  }

  // Performance Targets
  const pt = formData.performanceTargets;
  const sp = formData.scalabilityPlan;
  if ((pt && (pt.loadTime || pt.concurrentUsers || pt.dataVolume)) ||
      (sp && (sp.growthProjections || sp.infrastructureScaling))) {
    addPdfSectionHeading('Performance & Scalability');
    if (pt) {
      if (pt.loadTime && pt.loadTime.trim()) addPdfLabelValue('Target Load Time', pt.loadTime);
      if (pt.concurrentUsers && pt.concurrentUsers.trim()) addPdfLabelValue('Concurrent Users', pt.concurrentUsers);
      if (pt.dataVolume && pt.dataVolume.trim()) addPdfLabelValue('Data Volume', pt.dataVolume);
    }
    if (sp) {
      if (sp.growthProjections && sp.growthProjections.trim()) {
        addPdfSubHeading('Growth Projections');
        addPdfText(sp.growthProjections);
      }
      if (sp.infrastructureScaling && sp.infrastructureScaling.trim()) {
        addPdfSubHeading('Infrastructure Scaling');
        addPdfText(sp.infrastructureScaling);
      }
    }
  }

  // Competitive Positioning
  const cp = formData.competitivePositioning;
  if (cp && ((cp.keyDifferentiators && cp.keyDifferentiators.length > 0) || (cp.pricingStrategy && cp.pricingStrategy.trim()) || (cp.marketPositioning && cp.marketPositioning.trim()))) {
    addPdfSectionHeading('Competitive Positioning');
    if (cp.keyDifferentiators && cp.keyDifferentiators.length > 0) {
      addPdfSubHeading('Key Differentiators');
      cp.keyDifferentiators.forEach(d => addPdfBullet(typeof d === 'string' ? d : JSON.stringify(d)));
    }
    if (cp.pricingStrategy && cp.pricingStrategy.trim()) addPdfLabelValue('Pricing Strategy', cp.pricingStrategy);
    if (cp.marketPositioning && cp.marketPositioning.trim()) addPdfLabelValue('Market Positioning', cp.marketPositioning);
  }

  // UX Guidelines
  const ux = formData.uxGuidelines;
  const rd = formData.responsiveDesign;
  if (ux && ((ux.interactionPatterns && Object.values(ux.interactionPatterns).some(v => v && v.trim())) ||
      (ux.accessibility && (ux.accessibility.wcagLevel || ux.accessibility.screenReaderCompat || ux.accessibility.keyboardNav)))) {
    addPdfSectionHeading('UX Guidelines');
    if (ux.interactionPatterns) {
      const ip = ux.interactionPatterns;
      if (ip.clickTargets && ip.clickTargets.trim()) addPdfLabelValue('Click Targets', ip.clickTargets);
      if (ip.animationGuidelines && ip.animationGuidelines.trim()) addPdfLabelValue('Animation Guidelines', ip.animationGuidelines);
      if (ip.loadingStates && ip.loadingStates.trim()) addPdfLabelValue('Loading States', ip.loadingStates);
      if (ip.errorStates && ip.errorStates.trim()) addPdfLabelValue('Error States', ip.errorStates);
    }
    if (ux.accessibility) {
      addPdfSubHeading('Accessibility');
      if (ux.accessibility.wcagLevel) addPdfLabelValue('WCAG Level', ux.accessibility.wcagLevel);
      if (ux.accessibility.screenReaderCompat) addPdfBullet('Screen Reader Compatible');
      if (ux.accessibility.keyboardNav) addPdfBullet('Keyboard Navigation Enabled');
    }
  }

  // Responsive Design
  if (rd && ((rd.breakpoints && Object.values(rd.breakpoints).some(bp => bp && bp.layout && bp.layout.trim())) ||
      (rd.crossPlatform && ((rd.crossPlatform.browserCompat && rd.crossPlatform.browserCompat.length > 0) || (rd.crossPlatform.mobileVsWeb && rd.crossPlatform.mobileVsWeb.trim()))))) {
    addPdfSectionHeading('Responsive Design');
    if (rd.breakpoints) {
      addPdfSubHeading('Breakpoints');
      Object.entries(rd.breakpoints).forEach(([key, bp]) => {
        if (bp && bp.layout && bp.layout.trim()) {
          addPdfLabelValue(`${key.charAt(0).toUpperCase() + key.slice(1)} (${bp.width || ''})`, bp.layout);
        }
      });
    }
    if (rd.crossPlatform) {
      if (rd.crossPlatform.browserCompat && rd.crossPlatform.browserCompat.length > 0) {
        addPdfLabelValue('Browser Compatibility', rd.crossPlatform.browserCompat.join(', '));
      }
      if (rd.crossPlatform.mobileVsWeb && rd.crossPlatform.mobileVsWeb.trim()) {
        addPdfLabelValue('Mobile vs Web', rd.crossPlatform.mobileVsWeb);
      }
    }
  }

  // Development Phases
  if (formData.developmentPhases && formData.developmentPhases.length > 0) {
    addPdfSectionHeading('Development Phases');
    formData.developmentPhases.forEach((phase, i) => {
      if (typeof phase === 'string') {
        addPdfBullet(phase);
      } else if (phase && typeof phase === 'object') {
        addPdfSubHeading(`Phase ${i + 1}: ${phase.phaseName || 'Unnamed'}`);
        if (phase.deliverables && phase.deliverables.length > 0) {
          addPdfText('Deliverables:');
          phase.deliverables.forEach(d => addPdfBullet(typeof d === 'string' ? d : JSON.stringify(d)));
        }
        if (phase.dependencies && phase.dependencies.length > 0) {
          addPdfText('Dependencies:');
          phase.dependencies.forEach(d => addPdfBullet(typeof d === 'string' ? d : JSON.stringify(d)));
        }
        if (phase.resourceAllocation && phase.resourceAllocation.trim()) {
          addPdfLabelValue('Resource Allocation', phase.resourceAllocation);
        }
      }
    });
  }

  // Implementation Roadmap
  const ir = formData.implementationRoadmap;
  if (ir && ((ir.weeklySchedule && ir.weeklySchedule.length > 0) || (ir.featureOrder && ir.featureOrder.length > 0) || (ir.testMilestones && ir.testMilestones.length > 0))) {
    addPdfSectionHeading('Implementation Roadmap');
    if (ir.weeklySchedule && ir.weeklySchedule.length > 0) {
      addPdfSubHeading('Weekly Schedule');
      ir.weeklySchedule.forEach(w => addPdfBullet(typeof w === 'string' ? w : JSON.stringify(w)));
    }
    if (ir.featureOrder && ir.featureOrder.length > 0) {
      addPdfSubHeading('Feature Delivery Order');
      ir.featureOrder.forEach(f => addPdfBullet(typeof f === 'string' ? f : JSON.stringify(f)));
    }
    if (ir.testMilestones && ir.testMilestones.length > 0) {
      addPdfSubHeading('Test Milestones');
      ir.testMilestones.forEach(t => addPdfBullet(typeof t === 'string' ? t : JSON.stringify(t)));
    }
  }

  // Risk Assessment
  const ra = formData.riskAssessment;
  if (ra && ((ra.technicalRisks && ra.technicalRisks.length > 0) || (ra.businessRisks && ra.businessRisks.length > 0) || (ra.dependencyManagement && ra.dependencyManagement.trim()))) {
    addPdfSectionHeading('Risk Assessment');
    if (ra.technicalRisks && ra.technicalRisks.length > 0) {
      addPdfSubHeading('Technical Risks');
      ra.technicalRisks.forEach(r => {
        if (typeof r === 'string') {
          addPdfBullet(r);
        } else if (r && typeof r === 'object') {
          addPdfBullet(`${r.risk || 'Risk'} (Likelihood: ${r.likelihood || 'N/A'}, Impact: ${r.impact || 'N/A'}) - Mitigation: ${r.mitigation || 'N/A'}`);
        }
      });
    }
    if (ra.businessRisks && ra.businessRisks.length > 0) {
      addPdfSubHeading('Business Risks');
      ra.businessRisks.forEach(r => {
        if (typeof r === 'string') {
          addPdfBullet(r);
        } else if (r && typeof r === 'object') {
          addPdfBullet(`${r.risk || 'Risk'} (Likelihood: ${r.likelihood || 'N/A'}, Impact: ${r.impact || 'N/A'}) - Mitigation: ${r.mitigation || 'N/A'}`);
        }
      });
    }
    if (ra.dependencyManagement && ra.dependencyManagement.trim()) {
      addPdfSubHeading('Dependency Management');
      addPdfText(ra.dependencyManagement);
    }
  }

  // Testing Strategy
  const ts = formData.testingStrategy;
  const qa = formData.qaProcess;
  if ((ts && ((ts.unitTesting && (ts.unitTesting.target || ts.unitTesting.tools)) ||
      (ts.integrationTesting && ts.integrationTesting.specs) ||
      (ts.e2eTesting && ts.e2eTesting.criticalPaths && ts.e2eTesting.criticalPaths.length > 0))) ||
      (qa && (qa.codeReviewProcess || qa.performanceTesting || qa.securityTesting))) {
    addPdfSectionHeading('Testing Strategy');
    if (ts) {
      if (ts.unitTesting && (ts.unitTesting.target || ts.unitTesting.tools)) {
        addPdfSubHeading('Unit Testing');
        if (ts.unitTesting.target) addPdfLabelValue('Coverage Target', ts.unitTesting.target);
        if (ts.unitTesting.tools) addPdfLabelValue('Tools', ts.unitTesting.tools);
      }
      if (ts.integrationTesting && ts.integrationTesting.specs && ts.integrationTesting.specs.trim()) {
        addPdfSubHeading('Integration Testing');
        addPdfText(ts.integrationTesting.specs);
      }
      if (ts.e2eTesting && ts.e2eTesting.criticalPaths && ts.e2eTesting.criticalPaths.length > 0) {
        addPdfSubHeading('E2E Testing - Critical Paths');
        ts.e2eTesting.criticalPaths.forEach(p => addPdfBullet(typeof p === 'string' ? p : JSON.stringify(p)));
      }
    }
    if (qa) {
      addPdfSubHeading('QA Process');
      if (qa.codeReviewProcess && qa.codeReviewProcess.trim()) addPdfLabelValue('Code Review Process', qa.codeReviewProcess);
      if (qa.performanceTesting && qa.performanceTesting.trim()) addPdfLabelValue('Performance Testing', qa.performanceTesting);
      if (qa.securityTesting && qa.securityTesting.trim()) addPdfLabelValue('Security Testing', qa.securityTesting);
    }
  }

  // Deployment Strategy
  const ds = formData.deploymentStrategy;
  const lp = formData.launchPlan;
  if ((ds && ((ds.environments && Object.values(ds.environments).some(e => e && e.specs && e.specs.trim())) || (ds.cicdPipeline && ds.cicdPipeline.trim()) || (ds.monitoring && ds.monitoring.trim()))) ||
      (lp && (lp.softLaunchStrategy || lp.betaTesting || lp.publicLaunchTimeline))) {
    addPdfSectionHeading('Deployment Strategy');
    if (ds) {
      if (ds.environments) {
        Object.entries(ds.environments).forEach(([env, config]) => {
          if (config && config.specs && config.specs.trim()) {
            addPdfLabelValue(`${env.charAt(0).toUpperCase() + env.slice(1)} Environment`, config.specs);
          }
        });
      }
      if (ds.cicdPipeline && ds.cicdPipeline.trim()) addPdfLabelValue('CI/CD Pipeline', ds.cicdPipeline);
      if (ds.monitoring && ds.monitoring.trim()) addPdfLabelValue('Monitoring', ds.monitoring);
    }
    if (lp) {
      addPdfSubHeading('Launch Plan');
      if (lp.softLaunchStrategy && lp.softLaunchStrategy.trim()) addPdfLabelValue('Soft Launch Strategy', lp.softLaunchStrategy);
      if (lp.betaTesting && lp.betaTesting.trim()) addPdfLabelValue('Beta Testing', lp.betaTesting);
      if (lp.publicLaunchTimeline && lp.publicLaunchTimeline.trim()) addPdfLabelValue('Public Launch Timeline', lp.publicLaunchTimeline);
    }
  }

  // Budget & Resources
  const bp = formData.budgetPlanning;
  if (bp && ((bp.costs && Object.values(bp.costs).some(v => v && v.trim())) ||
      (bp.team && ((bp.team.requiredRoles && bp.team.requiredRoles.length > 0) || bp.team.scalingTimeline || bp.team.contractorNeeds)))) {
    addPdfSectionHeading('Budget & Resources');
    if (bp.costs) {
      if (bp.costs.developmentCosts && bp.costs.developmentCosts.trim()) addPdfLabelValue('Development Costs', bp.costs.developmentCosts);
      if (bp.costs.operationalCosts && bp.costs.operationalCosts.trim()) addPdfLabelValue('Operational Costs', bp.costs.operationalCosts);
      if (bp.costs.marketingCosts && bp.costs.marketingCosts.trim()) addPdfLabelValue('Marketing Costs', bp.costs.marketingCosts);
    }
    if (bp.team) {
      if (bp.team.requiredRoles && bp.team.requiredRoles.length > 0) {
        addPdfSubHeading('Required Roles');
        bp.team.requiredRoles.forEach(r => {
          if (typeof r === 'string') {
            addPdfBullet(r);
          } else if (r && typeof r === 'object') {
            addPdfBullet(`${r.role || 'Role'} x${r.count || 1} (${r.timing || 'full-time'})`);
          }
        });
      }
      if (bp.team.scalingTimeline && bp.team.scalingTimeline.trim()) addPdfLabelValue('Scaling Timeline', bp.team.scalingTimeline);
      if (bp.team.contractorNeeds && bp.team.contractorNeeds.trim()) addPdfLabelValue('Contractor Needs', bp.team.contractorNeeds);
    }
  }

  // Documentation Requirements
  const dr = formData.documentationReqs;
  if (dr && ((dr.technical && Object.values(dr.technical).some(v => v && v.trim())) ||
      (dr.user && Object.values(dr.user).some(v => v && v.trim())))) {
    addPdfSectionHeading('Documentation Requirements');
    if (dr.technical) {
      addPdfSubHeading('Technical Documentation');
      if (dr.technical.apiDocs && dr.technical.apiDocs.trim()) addPdfLabelValue('API Documentation', dr.technical.apiDocs);
      if (dr.technical.dbSchemaDocs && dr.technical.dbSchemaDocs.trim()) addPdfLabelValue('DB Schema Documentation', dr.technical.dbSchemaDocs);
      if (dr.technical.deploymentGuides && dr.technical.deploymentGuides.trim()) addPdfLabelValue('Deployment Guides', dr.technical.deploymentGuides);
    }
    if (dr.user) {
      addPdfSubHeading('User Documentation');
      if (dr.user.onboardingMaterials && dr.user.onboardingMaterials.trim()) addPdfLabelValue('Onboarding Materials', dr.user.onboardingMaterials);
      if (dr.user.helpSystem && dr.user.helpSystem.trim()) addPdfLabelValue('Help System', dr.user.helpSystem);
      if (dr.user.trainingResources && dr.user.trainingResources.trim()) addPdfLabelValue('Training Resources', dr.user.trainingResources);
    }
  }

  // Footer on each page
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Powered by ISTVON PRD Prompt Framework | Generated by BuLLMake PRD Generator`, margin, pageHeight - 10);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
  }

  return pdf.output('blob');
};

/**
 * Export PRD to DOCX format
 * @param {string} prdContent - The PRD content in markdown
 * @param {object} formData - Form data for metadata
 * @returns {Promise<Blob>}
 */
export const exportToDOCX = async (prdContent, formData) => {
  const elements = parseMarkdown(prdContent);
  const children = [];

  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Product Requirements Document',
          bold: true,
          size: 48,
          color: '0093B6'
        })
      ],
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 }
    })
  );

  // Subtitle
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${formData.appName || 'Application'} | Version ${formData.prdVersion || '1.0'} | ${new Date().toLocaleDateString()}`,
          size: 24,
          color: '666666'
        })
      ],
      spacing: { after: 400 }
    })
  );

  // Horizontal line
  children.push(
    new Paragraph({
      border: {
        bottom: { color: 'CCCCCC', size: 1, style: BorderStyle.SINGLE }
      },
      spacing: { after: 400 }
    })
  );

  // Process content
  elements.forEach(element => {
    switch (element.type) {
      case 'heading':
        const headingLevel = element.level === 1 ? HeadingLevel.HEADING_1 :
          element.level === 2 ? HeadingLevel.HEADING_2 :
            element.level === 3 ? HeadingLevel.HEADING_3 : HeadingLevel.HEADING_4;

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: stripMarkdown(element.content),
                bold: true,
                size: element.level === 1 ? 32 : element.level === 2 ? 28 : 24,
                color: element.level === 1 ? '0093B6' : element.level === 2 ? '0093B6' : '000000'
              })
            ],
            heading: headingLevel,
            spacing: { before: 300, after: 150 }
          })
        );
        break;

      case 'paragraph':
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripMarkdown(element.content), size: 22 })],
            spacing: { after: 120 }
          })
        );
        break;

      case 'bold':
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripMarkdown(element.content), bold: true, size: 22 })],
            spacing: { after: 120 }
          })
        );
        break;

      case 'bullet':
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripMarkdown(element.content), size: 22 })],
            bullet: { level: 0 },
            spacing: { after: 60 }
          })
        );
        break;

      case 'numbered':
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripMarkdown(element.content), size: 22 })],
            spacing: { after: 60 }
          })
        );
        break;

      case 'separator':
        children.push(
          new Paragraph({
            border: {
              bottom: { color: 'CCCCCC', size: 1, style: BorderStyle.SINGLE }
            },
            spacing: { before: 200, after: 200 }
          })
        );
        break;

      case 'space':
        children.push(new Paragraph({ spacing: { after: 100 } }));
        break;
    }
  });

  // Footer
  children.push(
    new Paragraph({
      border: {
        top: { color: 'CCCCCC', size: 1, style: BorderStyle.SINGLE }
      },
      spacing: { before: 400 }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Powered by ISTVON PRD Prompt Framework | Generated by BuLLMake PRD Generator',
          size: 18,
          color: '999999',
          italics: true
        })
      ],
      alignment: AlignmentType.CENTER
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  return Packer.toBlob(doc);
};

/**
 * Export PRD and form data to JSON format
 * @param {string} prdContent - The PRD content
 * @param {object} formData - Complete form data
 * @returns {Blob}
 */
export const exportToJSON = (prdContent, formData) => {
  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      version: formData.prdVersion || '1.0',
      generator: 'BuLLMake PRD Generator',
      framework: 'ISTVON PRD Prompt Framework'
    },
    project: {
      name: formData.appName,
      idea: formData.appIdea,
      platform: (formData.platform || []).join(', '),
      type: formData.projectType,
      dueDate: formData.dueDate
    },
    requirements: {
      problemStatement: formData.problemStatement,
      goal: formData.goal,
      outOfScope: formData.outOfScope
    },
    targetAudience: {
      demography: formData.targetAudienceDemography,
      geography: formData.targetAudienceGeography
    },
    technical: {
      appStructure: formData.appStructure,
      techStack: formData.selectedTechStack,
      competitors: formData.competitors
    },
    design: {
      colors: {
        primary: formData.primaryColor,
        secondary: formData.secondaryColor,
        accent: formData.accentColor,
        chart: [
          formData.chartColor1,
          formData.chartColor2,
          formData.chartColor3,
          formData.chartColor4,
          formData.chartColor5
        ]
      },
      typography: {
        primaryFont: formData.primaryFont,
        headingsFont: formData.headingsFont,
        sizes: {
          h1: formData.h1Size,
          h2: formData.h2Size,
          h3: formData.h3Size,
          h4: formData.h4Size,
          h5: formData.h5Size,
          body: formData.bodySize
        }
      },
      images: {
        borderRadius: formData.imageBorderRadius,
        aspectRatio: formData.imageAspectRatio,
        quality: formData.imageQuality,
        guidelines: formData.imageGuidelines
      },
      charts: {
        guidelines: formData.chartGuidelines
      }
    },
    timeline: {
      milestones: formData.milestones,
      team: formData.assignedTeam
    },
    userPersonas: {
      primary: formData.primaryUserPersonas,
      secondary: formData.secondaryUsers
    },
    userJourney: formData.userJourney,
    userStories: formData.userStories,
    featurePriority: formData.featurePriority,
    successMetrics: formData.successMetrics,
    successTimeline: formData.successTimeline,
    navigationArchitecture: formData.navigationArchitecture,
    techStackJustifications: formData.techStackJustifications,
    databaseArchitecture: {
      dataModels: formData.dataModels,
      apiSpecification: formData.apiSpecification
    },
    securityCompliance: {
      security: formData.security,
      compliance: formData.compliance
    },
    performanceScalability: {
      performanceTargets: formData.performanceTargets,
      scalabilityPlan: formData.scalabilityPlan
    },
    competitivePositioning: formData.competitivePositioning,
    uxGuidelines: formData.uxGuidelines,
    responsiveDesign: formData.responsiveDesign,
    developmentPhases: formData.developmentPhases,
    implementationRoadmap: formData.implementationRoadmap,
    riskAssessment: formData.riskAssessment,
    testingStrategy: formData.testingStrategy,
    qaProcess: formData.qaProcess,
    deploymentStrategy: formData.deploymentStrategy,
    launchPlan: formData.launchPlan,
    budgetPlanning: formData.budgetPlanning,
    documentationReqs: formData.documentationReqs,
    prd: {
      content: prdContent,
      generatedAt: new Date().toISOString()
    }
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
};

/**
 * Download a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export PRD to Markdown format
 * @param {string} prdContent - The PRD content (already markdown)
 * @param {object} formData - Form data for metadata
 * @returns {Blob}
 */
export const exportToMarkdown = (prdContent, formData) => {
  const header = `# Product Requirements Document\n**${formData.appName || 'Application'}** | Version ${formData.prdVersion || '1.0'} | ${new Date().toLocaleDateString()}\n\n---\n\n`;
  const content = header + prdContent;
  return new Blob([content], { type: 'text/markdown' });
};

/**
 * Export PRD in the specified format
 * @param {string} format - 'pdf', 'docx', 'json', or 'md'
 * @param {string} prdContent - The PRD content
 * @param {object} formData - Form data
 */
export const exportPRD = async (format, prdContent, formData) => {
  const timestamp = Date.now();
  const appName = formData.appName || 'PRD';

  try {
    let blob;
    let filename;

    switch (format.toLowerCase()) {
      case 'pdf':
        blob = await exportToPDF(prdContent, formData);
        filename = `${appName}-PRD-${timestamp}.pdf`;
        break;

      case 'docx':
      case 'doc':
        blob = await exportToDOCX(prdContent, formData);
        filename = `${appName}-PRD-${timestamp}.docx`;
        break;

      case 'json':
        blob = exportToJSON(prdContent, formData);
        filename = `${appName}-PRD-${timestamp}.json`;
        break;

      case 'md':
      case 'markdown':
        blob = exportToMarkdown(prdContent, formData);
        filename = `${appName}-PRD-${timestamp}.md`;
        break;

      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    downloadBlob(blob, filename);
    return { success: true, filename };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: error.message };
  }
};

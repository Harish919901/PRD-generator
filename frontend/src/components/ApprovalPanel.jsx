import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, MessageSquare } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Pending' },
  approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Approved' },
  rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Rejected' },
  changes_requested: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Changes Requested' }
};

const STEPS = [
  { key: 'step1', label: 'App Concept & Scope' },
  { key: 'step2', label: 'Platform & Tech Stack' },
  { key: 'step3', label: 'Visual Style Guide' },
  { key: 'step4', label: 'Generate PRD' }
];

const ApprovalPanel = ({ approvals = {}, onApprove, onReject, onRequestChanges, canApprove = false, isOpen, onClose }) => {
  const [feedback, setFeedback] = useState({});
  const [activeStep, setActiveStep] = useState(null);

  const getStepStatus = (stepKey) => approvals[stepKey]?.status || 'pending';

  const handleAction = (stepKey, action) => {
    const feedbackText = feedback[stepKey] || '';
    if (action === 'approve') onApprove?.(stepKey, feedbackText);
    else if (action === 'reject') onReject?.(stepKey, feedbackText);
    else if (action === 'changes_requested') onRequestChanges?.(stepKey, feedbackText);
    setFeedback(prev => ({ ...prev, [stepKey]: '' }));
    setActiveStep(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          Approvals
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
          <XCircle className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {STEPS.map(({ key, label }) => {
          const status = getStepStatus(key);
          const config = STATUS_CONFIG[status];
          const StatusIcon = config.icon;
          const approval = approvals[key];

          return (
            <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setActiveStep(activeStep === key ? null : key)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${config.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className={`text-xs ${config.color}`}>{config.label}</p>
                  </div>
                </div>
              </div>

              {activeStep === key && (
                <div className="p-3 border-t border-gray-100 bg-gray-50 space-y-3">
                  {approval?.feedback && (
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-500">Feedback</p>
                      <p className="text-sm text-gray-700 mt-1">{approval.feedback}</p>
                      {approval.approver_email && (
                        <p className="text-xs text-gray-400 mt-1">by {approval.approver_email}</p>
                      )}
                    </div>
                  )}

                  {canApprove && (
                    <>
                      <textarea
                        value={feedback[key] || ''}
                        onChange={(e) => setFeedback(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder="Add feedback (optional)..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(key, 'approve')}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(key, 'changes_requested')}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Changes
                        </button>
                        <button
                          onClick={() => handleAction(key, 'reject')}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ApprovalBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export default ApprovalPanel;

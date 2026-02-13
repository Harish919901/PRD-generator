import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Check, CornerDownRight } from 'lucide-react';
import { commentService } from '../services/commentService';

const CommentSidebar = ({ projectId, fieldPath, fieldLabel, isOpen, onClose, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && projectId && fieldPath) {
      loadComments();
      const unsubscribe = commentService.subscribeToComments(projectId, () => loadComments());
      return () => { if (unsubscribe) unsubscribe(); };
    }
  }, [isOpen, projectId, fieldPath]);

  const loadComments = async () => {
    setLoading(true);
    const data = await commentService.getComments(projectId, fieldPath);
    setComments(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await commentService.addComment(projectId, fieldPath, newComment.trim(), currentUserId, replyTo);
    setNewComment('');
    setReplyTo(null);
    await loadComments();
  };

  const handleResolve = async (commentId, resolved) => {
    await commentService.resolveComment(commentId, !resolved);
    await loadComments();
  };

  const handleDelete = async (commentId) => {
    await commentService.deleteComment(commentId);
    await loadComments();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
        <div>
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Comments
          </h3>
          <p className="text-xs text-gray-500 mt-1">{fieldLabel || fieldPath}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments yet</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-xl ${comment.resolved ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'} ${comment.parent_comment_id ? 'ml-6' : ''}`}
            >
              {comment.parent_comment_id && (
                <CornerDownRight className="w-3 h-3 text-gray-400 mb-1" />
              )}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600">{comment.author_email || 'Anonymous'}</p>
                  <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleResolve(comment.id, comment.resolved)}
                    className={`p-1 rounded ${comment.resolved ? 'text-green-600 bg-green-100' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                    title={comment.resolved ? 'Unresolve' : 'Resolve'}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setReplyTo(comment.id); inputRef.current?.focus(); }}
                    className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    title="Reply"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                  </button>
                  {comment.author_id === currentUserId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-gray-50">
        {replyTo && (
          <div className="flex items-center gap-2 mb-2 text-xs text-blue-600">
            <CornerDownRight className="w-3 h-3" />
            <span>Replying to comment</span>
            <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-red-500">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export const CommentButton = ({ onClick, commentCount = 0 }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
    title="Comments"
  >
    <MessageSquare className="w-3.5 h-3.5" />
    {commentCount > 0 && <span className="text-xs font-medium">{commentCount}</span>}
  </button>
);

export default CommentSidebar;

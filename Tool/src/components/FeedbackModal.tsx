
import React, { useState } from 'react';
import { X, Check } from "lucide-react";

interface FeedbackItem {
  id: number;
  text: string;
  completed: boolean;
}

interface FeedbackModalProps {
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    { id: 1, text: "Prompt needs more specificity on analytical methods", completed: false },
    { id: 2, text: "Include more domain-specific terminology in expert role", completed: false },
    { id: 3, text: "Better structure needed for default actions section", completed: false },
    { id: 4, text: "Communication style should reflect industry standards", completed: false },
    { id: 5, text: "Add more don'ts to improve prompt guardrails", completed: false }
  ]);

  const toggleFeedback = (id: number) => {
    setFeedbacks(feedbacks.map(feedback => 
      feedback.id === id ? { ...feedback, completed: !feedback.completed } : feedback
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-promptcraft-panel rounded-lg border border-promptcraft-border p-5 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">User Feedback</h2>
          <button 
            onClick={onClose}
            className="text-promptcraft-text hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {feedbacks.map(feedback => (
            <div 
              key={feedback.id}
              className="flex items-center space-x-3 p-2 hover:bg-promptcraft-background rounded cursor-pointer"
              onClick={() => toggleFeedback(feedback.id)}
            >
              <div className={`flex items-center justify-center w-5 h-5 border rounded ${feedback.completed ? 'bg-promptcraft-highlight border-promptcraft-highlight' : 'border-promptcraft-border'}`}>
                {feedback.completed && <Check className="h-4 w-4 text-white" />}
              </div>
              <span className={`text-sm ${feedback.completed ? 'text-promptcraft-text line-through' : 'text-white'}`}>
                {feedback.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-promptcraft-background hover:bg-promptcraft-highlight text-promptcraft-text border border-promptcraft-border rounded px-4 py-2 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

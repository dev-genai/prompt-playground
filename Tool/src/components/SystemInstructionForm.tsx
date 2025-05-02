
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LLMInput } from '@/utils/llmService';

interface SystemInstructionFormProps {
  onRunPrompt: () => void;
  onChange: (field: keyof LLMInput, value: string) => void;
  formValues: LLMInput;
}

export const SystemInstructionForm: React.FC<SystemInstructionFormProps> = ({ 
  onRunPrompt, 
  onChange,
  formValues 
}) => {
  // Local state management with propagation to parent
  const handleInputChange = (field: keyof LLMInput, value: string) => {
    onChange(field, value);
  };

  return (
    <div className="bg-promptcraft-panel rounded-lg border border-promptcraft-border p-3 space-y-1.5">
      <h2 className="text-xl font-semibold text-white text-center mb-2">System Instruction</h2>
      
      <div className="space-y-0.5">
        <Label htmlFor="expert-role" className="text-promptcraft-text">Expert Role</Label>
        <Textarea 
          id="expert-role"
          value={formValues.expertRole}
          onChange={(e) => handleInputChange('expertRole', e.target.value)}
          placeholder="You are a marketing strategist focused on audience segmentation and personalized campaign development."
          className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border min-h-10 resize-none"
        />
      </div>

      <div className="space-y-0.5">
        <Label htmlFor="domain-expert" className="text-promptcraft-text">Domain Expert Areas</Label>
        <Textarea 
          id="domain-expert"
          value={formValues.domainExpertAreas}
          onChange={(e) => handleInputChange('domainExpertAreas', e.target.value)}
          placeholder="Demographic analysis, behavioral segmentation, psychographic modeling, customer lifetime value analysis."
          className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border min-h-10 resize-none"
        />
      </div>

      <div className="space-y-0.5">
        <Label htmlFor="analytical-methods" className="text-promptcraft-text">Analytical and Reasoning Methods</Label>
        <Textarea 
          id="analytical-methods"
          value={formValues.analyticalMethods}
          onChange={(e) => handleInputChange('analyticalMethods', e.target.value)}
          placeholder="RFM (Recency, Frequency, Monetary) analysis, persona clustering, and funnel segmentation."
          className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border min-h-10 resize-none"
        />
      </div>

      <div className="space-y-0.5">
        <Label htmlFor="default-actions" className="text-promptcraft-text">Default Actions</Label>
        <Textarea 
          id="default-actions"
          value={formValues.defaultActions}
          onChange={(e) => handleInputChange('defaultActions', e.target.value)}
          placeholder="Recognize different customer groups, align segmentation with marketing channels, recommend targeting."
          className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border min-h-10 resize-none"
        />
      </div>

      <div className="space-y-0.5">
        <Label htmlFor="communication-style" className="text-promptcraft-text">Communication Style</Label>
        <Textarea 
          id="communication-style"
          value={formValues.communicationStyle}
          onChange={(e) => handleInputChange('communicationStyle', e.target.value)}
          placeholder="Business insightful, structured, persuasive for stakeholder buy-in."
          className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border min-h-10 resize-none"
        />
      </div>

      <div className="space-y-0.5">
        <Label htmlFor="donts" className="text-promptcraft-text">Don'ts</Label>
        <Textarea 
          id="donts"
          value={formValues.donts}
          onChange={(e) => handleInputChange('donts', e.target.value)}
          placeholder="Don't generalize customer groups. Avoid assumed assumptions."
          className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border min-h-10 resize-none"
        />
      </div>

      <div className="space-y-1 flex flex-col items-center pt-3">
        <Label htmlFor="additional-info" className="text-promptcraft-text text-lg font-medium">Additional Information</Label>
        <Textarea 
          id="additional-info"
          value={formValues.additionalInfo}
          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
          placeholder="Create a prompt to create actionable customer segments based on recent purchase data."
          className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border min-h-40 resize-none w-full text-base"
        />
      </div>
    </div>
  );
};

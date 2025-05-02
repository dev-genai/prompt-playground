
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";
import { toast } from "@/components/ui/sonner";

interface ConfigPanelProps {
  onRunPrompt: (params: {temperature: number, topP?: number, topK?: number}) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ onRunPrompt }) => {
  const [temperature, setTemperature] = useState<string>("0.7");
  const [topP, setTopP] = useState<string>("0.9");
  const [topK, setTopK] = useState<string>("50");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Handle validation and parsing of number inputs
  const validateAndParseNumber = (value: string, min: number, max: number): number | null => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
      return null;
    }
    return num;
  };

  // Function to validate parameters
  const handleRunPrompt = () => {
    const tempValue = validateAndParseNumber(temperature, 0, 1);
    
    if (tempValue === null) {
      toast.error("Temperature must be a number between 0 and 1");
      return;
    }
    
    const params = {
      temperature: tempValue,
      topP: validateAndParseNumber(topP, 0, 1) || undefined,
      topK: validateAndParseNumber(topK, 1, 100) || undefined
    };
    
    onRunPrompt(params);
  };

  return (
    <div className="bg-promptcraft-panel rounded-lg border border-promptcraft-border p-3 space-y-3">
      {/* UseCase Section */}
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-white">UseCase</h2>
        <div className="relative">
          <select 
            className="w-full bg-promptcraft-background text-promptcraft-text border border-promptcraft-border rounded p-1 pr-8 appearance-none text-xs"
            defaultValue="business-insights"
          >
            <option value="business-insights">Business Insights</option>
            <option value="marketing-charts">Marketing Charts</option>
            <option value="sales-presentation">Sales Presentation</option>
          </select>
          <ChevronDown className="absolute top-1.5 right-2 h-3 w-3 text-promptcraft-text" />
        </div>
      </div>

      {/* Configs Section */}
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-white">Configs</h2>
        <div className="relative">
          <select 
            className="w-full bg-promptcraft-background text-promptcraft-text border border-promptcraft-border rounded p-1 pr-8 appearance-none text-xs"
            defaultValue="gemini"
          >
            <option value="gemini" selected>Gemini</option>
            <option value="nova-pro">Nova Pro</option>
            <option value="nova-lite">Nova Lite</option>
            <option value="clause">Clause</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-3">GPT-3</option>
          </select>
          <ChevronDown className="absolute top-1.5 right-2 h-3 w-3 text-promptcraft-text" />
        </div>
      </div>

      {/* Parameters Section */}
      <div className="space-y-1.5">
        <h2 className="text-sm font-semibold text-white">Parameters</h2>
        
        <div className="grid grid-cols-[80px_1fr] items-center gap-1">
          <Label htmlFor="temperature" className="text-promptcraft-text text-xs">
            Temperature*
          </Label>
          <Input 
            id="temperature" 
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border text-xs h-7 px-2 py-1"
            placeholder="0.7"
            required
          />
        </div>
        
        <div className="grid grid-cols-[80px_1fr] items-center gap-1">
          <Label htmlFor="top-p" className="text-promptcraft-text text-xs">Top P</Label>
          <Input 
            id="top-p" 
            value={topP}
            onChange={(e) => setTopP(e.target.value)}
            className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border text-xs h-7 px-2 py-1"
            placeholder="0.9"
          />
        </div>
        
        <div className="grid grid-cols-[80px_1fr] items-center gap-1">
          <Label htmlFor="top-k" className="text-promptcraft-text text-xs">Top K</Label>
          <Input 
            id="top-k" 
            value={topK}
            onChange={(e) => setTopK(e.target.value)}
            className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border text-xs h-7 px-2 py-1"
            placeholder="50"
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-2">
        <Button 
          variant="outline" 
          onClick={handleRunPrompt}
          className="w-full bg-promptcraft-highlight hover:bg-blue-700 text-white border-promptcraft-border text-xs h-7"
        >
          Generate Prompt
        </Button>
      </div>

      {/* Feedback Button */}
      <div className="pt-2">
        <Button 
          variant="outline" 
          className="w-full bg-promptcraft-panel hover:bg-promptcraft-highlight text-promptcraft-text border-promptcraft-border text-xs h-7"
          onClick={() => setShowFeedbackModal(true)}
        >
          Feedback
        </Button>
      </div>

      {showFeedbackModal && (
        <FeedbackModal onClose={() => setShowFeedbackModal(false)} />
      )}
    </div>
  );
};

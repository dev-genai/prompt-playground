
import React from 'react';
import { Button } from "@/components/ui/button";
import { InfoIcon, HelpCircleIcon, GithubIcon } from "lucide-react";

interface PromptCraftHeaderProps {
  title?: string;
}

export const PromptCraftHeader: React.FC<PromptCraftHeaderProps> = ({ title = "Usecase based Prompt Generation Tool" }) => {
  return (
    <header className="bg-promptcraft-panel border-b border-promptcraft-border p-2 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          {title}
        </h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-transparent border-promptcraft-border text-promptcraft-text hover:bg-promptcraft-highlight hover:text-white">
            <InfoIcon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">About</span>
          </Button>
          
          <Button variant="outline" size="sm" className="bg-transparent border-promptcraft-border text-promptcraft-text hover:bg-promptcraft-highlight hover:text-white">
            <HelpCircleIcon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Help</span>
          </Button>
          
          <Button variant="outline" size="sm" className="bg-transparent border-promptcraft-border text-promptcraft-text hover:bg-promptcraft-highlight hover:text-white">
            <GithubIcon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
        </div>
      </div>
    </header>
  );
};


import React, { useState } from 'react';
import { PromptCraftHeader } from '@/components/PromptCraftHeader';
import { ConfigPanel } from '@/components/ConfigPanel';
import { SystemInstructionForm } from '@/components/SystemInstructionForm';
import { GeneratedPrompt } from '@/components/GeneratedPrompt';
import { toast } from "@/components/ui/sonner";
import { generatePrompt, LLMParams, LLMInput } from '@/utils/llmService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Index = () => {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showSavedPromptsDialog, setShowSavedPromptsDialog] = useState<boolean>(false);
  const [savedPrompts, setSavedPrompts] = useState<Array<{
    id: string;
    title: string;
    content: string;
    department?: string;
  }>>([
    { 
      id: "1", 
      title: "Marketing Segment Analysis", 
      content: "1)You are a marketing strategist specializing in segmentation and customer lifecycle analysis.",
      department: "Marketing" 
    },
    { 
      id: "2", 
      title: "Sales Performance Review", 
      content: "1)You are a sales analytics expert focused on performance metrics and conversion optimization.",
      department: "Sales"
    },
    { 
      id: "3", 
      title: "Product Feature Analysis", 
      content: "1)You are a product manager specializing in feature prioritization and user feedback analysis.",
      department: "Product"
    },
    { 
      id: "4", 
      title: "HR Talent Assessment", 
      content: "1)You are an HR specialist focusing on talent acquisition and performance evaluation frameworks.",
      department: "HR"
    }
  ]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Create state to track form inputs
  const [formInputs, setFormInputs] = useState<LLMInput>({
    expertRole: "",
    domainExpertAreas: "",
    analyticalMethods: "",
    defaultActions: "",
    communicationStyle: "",
    donts: "",
    additionalInfo: ""
  });

  // Function to update form inputs from SystemInstructionForm
  const handleFormInputChange = (field: keyof LLMInput, value: string) => {
    setFormInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRunPrompt = async (params: LLMParams) => {
    // Validate if temperature is provided
    if (params.temperature === undefined) {
      toast.error("Temperature is required to generate a prompt");
      return;
    }
    
    setIsGenerating(true);
    toast.info("Generating prompt with Gemini...");
    
    try {
      // Call the LLM service with user inputs
      const result = await generatePrompt(formInputs, params);
      setGeneratedPrompt(result);
      toast.success("Prompt generated successfully!");
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error("Failed to generate prompt. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveToDB = (promptContent: string, title: string = "New Prompt") => {
    const departments = ["Marketing", "Sales", "HR", "Product", "Finance", "IT"];
    const randomDepartment = departments[Math.floor(Math.random() * departments.length)];
    
    const newPrompt = {
      id: String(savedPrompts.length + 1),
      title: title,
      content: promptContent,
      department: randomDepartment
    };
    
    setSavedPrompts([...savedPrompts, newPrompt]);
    setShowSavedPromptsDialog(true);
    toast.success("Prompt saved to database successfully!");
  };
  
  const handleDeleteSavedPrompt = (id: string) => {
    setSavedPrompts(savedPrompts.filter(prompt => prompt.id !== id));
    toast.success("Prompt deleted successfully!");
  };

  const departments = Array.from(new Set(savedPrompts.map(p => p.department))).filter(Boolean);
  
  const filteredPrompts = savedPrompts.filter(prompt => {
    const matchesDepartment = selectedDepartment === "all" || prompt.department === selectedDepartment;
    const matchesSearch = !searchQuery || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-promptcraft-background text-white flex flex-col">
      <PromptCraftHeader title="Usecase based Prompt Generation Tool" />
      
      <div className="flex-1 container mx-auto py-4 px-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Panel - Config */}
          <div className="lg:col-span-2">
            <ConfigPanel onRunPrompt={handleRunPrompt} />
          </div>
          
          {/* Middle Panel - System Instructions */}
          <div className="lg:col-span-6">
            <SystemInstructionForm 
              onRunPrompt={() => {}} // Deprecated, now handled by ConfigPanel
              onChange={handleFormInputChange}
              formValues={formInputs}
            />
          </div>
          
          {/* Right Panel - Generated Prompt */}
          <div className="lg:col-span-4">
            <GeneratedPrompt 
              currentPrompt={generatedPrompt}
              onSaveToDB={(content, title) => handleSaveToDB(content, title)}
              isLoading={isGenerating}
            />
          </div>
        </div>
      </div>
      
      {/* Saved Prompts Dialog */}
      <Dialog open={showSavedPromptsDialog} onOpenChange={setShowSavedPromptsDialog}>
        <DialogContent className="bg-promptcraft-panel text-white border-promptcraft-border max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center justify-between">
              Saved Prompts Library
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search prompts..."
                className="bg-promptcraft-background border-promptcraft-border text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="bg-promptcraft-background border border-promptcraft-border rounded p-2 text-white"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <Tabs defaultValue="grid" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="bg-promptcraft-background border-b border-promptcraft-border mb-4">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPrompts.length > 0 ? filteredPrompts.map((prompt) => (
                  <div key={prompt.id} className="bg-promptcraft-background p-3 rounded-md border border-promptcraft-border">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id={`prompt-${prompt.id}`} />
                        <h3 className="font-medium text-promptcraft-text">{prompt.title}</h3>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="px-2 py-1 text-xs rounded bg-promptcraft-highlight/30">
                          {prompt.department}
                        </span>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="bg-promptcraft-highlight text-white text-xs h-7 px-2"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white text-xs h-7 px-2"
                          onClick={() => handleDeleteSavedPrompt(prompt.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="bg-promptcraft-panel p-2 rounded border border-promptcraft-border max-h-32 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap text-promptcraft-text font-mono">
                        {prompt.content}
                      </pre>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 text-center p-8 text-gray-400">
                    No prompts match your current filters
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="table" className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-promptcraft-border hover:bg-promptcraft-background">
                    <TableHead className="text-white">Title</TableHead>
                    <TableHead className="text-white">Department</TableHead>
                    <TableHead className="text-white">Preview</TableHead>
                    <TableHead className="text-white w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrompts.length > 0 ? filteredPrompts.map((prompt) => (
                    <TableRow key={prompt.id} className="border-promptcraft-border hover:bg-promptcraft-background">
                      <TableCell className="text-white font-medium">{prompt.title}</TableCell>
                      <TableCell className="text-white">{prompt.department}</TableCell>
                      <TableCell className="text-white">
                        <div className="max-h-20 overflow-hidden text-ellipsis">
                          {prompt.content.substring(0, 100)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-promptcraft-highlight text-white h-7 w-7 p-0"
                          >
                            <span className="sr-only">Edit</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white h-7 w-7 p-0"
                            onClick={() => handleDeleteSavedPrompt(prompt.id)}
                          >
                            <span className="sr-only">Delete</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                        No prompts match your current filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button 
              onClick={() => setShowSavedPromptsDialog(false)}
              className="bg-promptcraft-highlight text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

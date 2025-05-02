
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, Save, FileText, Plus, Download, File } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface PromptVersion {
  id: string;
  title: string;
  content: string;
}

interface GeneratedPromptProps {
  currentPrompt: string;
  onSaveToDB?: (content: string, title?: string) => void;
  isLoading?: boolean;
}

export const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ currentPrompt, onSaveToDB, isLoading = false }) => {
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([
    { id: '1', title: 'Prompt Test 1', content: '' },
    { id: '2', title: 'Prompt Test 2', content: '' },
    { id: 'manual', title: 'Manual Prompt', content: '' }
  ]);
  
  const [selectedVersionId, setSelectedVersionId] = useState<string>('1');
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [versionToDelete, setVersionToDelete] = useState<string>('');
  const [manualPromptContent, setManualPromptContent] = useState<string>('');

  const handleRemoveVersion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVersionToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setPromptVersions(promptVersions.filter(v => v.id !== versionToDelete));
    if (selectedVersionId === versionToDelete && promptVersions.length > 1) {
      // Select another version if we're removing the currently selected one
      const newVersionId = promptVersions.find(v => v.id !== versionToDelete)?.id || '';
      setSelectedVersionId(newVersionId);
    }
    setShowDeleteDialog(false);
    toast.success("Prompt version removed");
  };

  const handleAddVersion = () => {
    const newId = String(Math.max(...promptVersions.filter(v => v.id !== 'manual').map(v => Number(v.id)), 0) + 1);
    const newVersion = { id: newId, title: `Prompt Test ${newId}`, content: '' };
    setPromptVersions([...promptVersions, newVersion]);
    setSelectedVersionId(newId);
  };

  const handleSaveToDB = () => {
    const content = selectedVersionId === 'manual' ? manualPromptContent : 
                    selectedVersionId === '1' ? currentPrompt : 
                    promptVersions.find(v => v.id === selectedVersionId)?.content || '';
    
    const title = promptVersions.find(v => v.id === selectedVersionId)?.title || 'New Prompt';
    
    // Call the parent component's save function
    if (onSaveToDB) {
      onSaveToDB(content, title);
    } else {
      toast.success("Saved to database successfully!");
    }
  };

  const handleExport = (format: string) => {
    // Create a blob with the content
    const content = selectedVersionId === 'manual' ? manualPromptContent : 
                    selectedVersionId === '1' ? currentPrompt : 
                    promptVersions.find(v => v.id === selectedVersionId)?.content || '';
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-export.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported as ${format.toUpperCase()} successfully!`);
    setShowExportDropdown(false);
  };

  return (
    <div className="bg-promptcraft-panel rounded-lg border border-promptcraft-border p-3 space-y-3">
      <h2 className="text-xl font-semibold text-white text-center">Generated Context Prompt</h2>
      
      {/* Prompt Tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        {promptVersions.map((version) => (
          <div 
            key={version.id}
            className={`flex items-center rounded px-3 py-1 text-sm cursor-pointer ${
              selectedVersionId === version.id ? 'bg-promptcraft-highlight text-white' : 'bg-promptcraft-background text-promptcraft-text'
            }`}
            onClick={() => setSelectedVersionId(version.id)}
          >
            {version.title}
            <X 
              className="ml-2 h-3 w-3 hover:text-red-500" 
              onClick={(e) => handleRemoveVersion(version.id, e)}
            />
          </div>
        ))}
        <button 
          className="bg-promptcraft-background text-promptcraft-text rounded p-1"
          onClick={handleAddVersion}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      {/* Prompt Content */}
      <div className="bg-promptcraft-background border border-promptcraft-border rounded-lg p-3 h-[350px] overflow-y-auto scrollbar-custom relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-promptcraft-background bg-opacity-75">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" />
              <p className="text-promptcraft-text">Generating prompt with Gemini...</p>
            </div>
          </div>
        ) : selectedVersionId === 'manual' ? (
          <textarea
            value={manualPromptContent}
            onChange={(e) => setManualPromptContent(e.target.value)}
            className="w-full h-full bg-transparent text-promptcraft-text resize-none focus:outline-none font-mono text-sm"
            placeholder="Enter your manual prompt here..."
          />
        ) : (
          <pre className="text-promptcraft-text whitespace-pre-wrap text-sm font-mono">
            {selectedVersionId === '1' ? 
              currentPrompt || "No prompt generated yet. Click Generate to create a prompt." : 
              selectedVersionId === '2' ? 
                "No prompt generated yet. Click Generate to create a prompt." : 
                "No prompt generated yet. Click Generate to create a prompt."
            }
          </pre>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-between">
        <Button 
          onClick={handleSaveToDB}
          variant="outline" 
          className="bg-promptcraft-background hover:bg-promptcraft-highlight text-promptcraft-text border-promptcraft-border flex items-center gap-2 text-sm h-8"
          disabled={isLoading}
        >
          <Save className="h-4 w-4" />
          SAVE TO DB
        </Button>
        
        <Button 
          variant="outline" 
          className="bg-promptcraft-background hover:bg-promptcraft-highlight text-promptcraft-text border-promptcraft-border text-sm h-8"
          disabled={isLoading}
        >
          Recent Versions
        </Button>
        
        <div className="relative">
          <Button 
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            variant="outline" 
            className="bg-promptcraft-background hover:bg-promptcraft-highlight text-promptcraft-text border-promptcraft-border flex items-center gap-2 text-sm h-8"
            disabled={isLoading}
          >
            <FileText className="h-4 w-4" />
            EXPORT
          </Button>
          
          {showExportDropdown && (
            <div className="absolute right-0 mt-1 bg-promptcraft-panel border border-promptcraft-border rounded-md shadow-lg z-10">
              <div className="py-1">
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-promptcraft-text hover:bg-promptcraft-highlight hover:text-white"
                  onClick={() => handleExport('docx')}
                >
                  <File className="h-4 w-4 mr-2" />
                  Word
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-promptcraft-text hover:bg-promptcraft-highlight hover:text-white"
                  onClick={() => handleExport('pdf')}
                >
                  <File className="h-4 w-4 mr-2" />
                  PDF
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-promptcraft-text hover:bg-promptcraft-highlight hover:text-white"
                  onClick={() => handleExport('xlsx')}
                >
                  <File className="h-4 w-4 mr-2" />
                  Excel
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-promptcraft-text hover:bg-promptcraft-highlight hover:text-white"
                  onClick={() => handleExport('json')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  JSON
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-promptcraft-text hover:bg-promptcraft-highlight hover:text-white"
                  onClick={() => handleExport('txt')}
                >
                  <File className="h-4 w-4 mr-2" />
                  Text
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-promptcraft-panel text-white border-promptcraft-border">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this prompt version?</p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="bg-promptcraft-background text-promptcraft-text border-promptcraft-border"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

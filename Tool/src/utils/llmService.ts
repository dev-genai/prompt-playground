
import { toast } from "@/components/ui/sonner";

// Define interface for LLM parameters
export interface LLMParams {
  temperature?: number;
  topP?: number;
  topK?: number;
}

// Define interface for LLM input
export interface LLMInput {
  expertRole: string;
  domainExpertAreas: string;
  analyticalMethods: string;
  defaultActions: string;
  communicationStyle: string;
  donts: string;
  additionalInfo: string;
}

export const systemPrompt = `You are an expert persona formatter. User gives structured inputs like: "Role/Persona", "Domain Mastery Areas", "Analytical Behavior and Reasoning Methods", "Communication Style", "Default Actions", "Don'ts", "Additional Information", and so on.. Your job is to convert these into a precise, clean, 12–15 point persona-style system prompt. The output should reflect the expert's mindset, reasoning style, working patterns, communication tone, strengths, priorities, and cautionary rules. Instructions: Begin with a sentence describing the professional role and experience. Include their specialization and tools in the next point. Add points on how they approach problems, break down tasks, analyze data, or make decisions. If formulas or structured reasoning styles are given, include them clearly. Highlight their communication tone and interaction preferences. Include how they benchmark, flag anomalies, or segment info. Mention things they always or never do. End with their strategic objective or decision-making philosophy. Format the output as a numbered list (1), 2), 3)... and so on). Always give more points and precise points. Don't make any subpoint, increase the number of points as much needed, more points is always desired. Each point should be: Short, punchy, and professional. Not generic or invented — base only on the user inputs. In the tone of a system-level prompt that would guide another AI or expert. The structure and clarity of the list are important. The goal is to create a reusable expert-mode prompt reflecting the user's input characteristics across any domain — marketing, legal, HR, finance, analytics, etc.`;

// Generate prompt using Google Generative AI
export const generatePrompt = async (
  inputs: LLMInput,
  params: LLMParams
): Promise<string> => {
  // We don't have a direct Gemini import, so we'll use fetch API
  try {
    // Construct the prompt with system instructions and user inputs
    const userPrompt = `
${systemPrompt}

Role/Persona: ${inputs.expertRole}
Domain Mastery Areas: ${inputs.domainExpertAreas}
Analytical Behavior and Reasoning Methods: ${inputs.analyticalMethods}
Default Actions: ${inputs.defaultActions}
Communication Style: ${inputs.communicationStyle}
Don'ts: ${inputs.donts}
Additional Information: ${inputs.additionalInfo}
`;

    // This would be the actual API call to Gemini
    // For now, we'll use a public API endpoint for demo
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // In a production app, this API key would be stored securely
        // For this example, we're using a placeholder
        'API-Key': 'YOUR_GEMINI_API_KEY'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: userPrompt
          }]
        }],
        generationConfig: {
          temperature: params.temperature || 0.7,
          topP: params.topP || 0.9,
          topK: params.topK || 50,
          maxOutputTokens: 1024,
        }
      })
    });

    // For now, since we can't actually make the API call, we'll return a placeholder
    // In a real implementation, we would parse the response and return the generated text
    if (!response.ok) {
      // Fallback to simulate a response
      console.log("Using fallback response generation");
      return generateMockResponse(inputs);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error("Error generating prompt:", error);
    toast.error("Error generating prompt. Using fallback method.");
    
    // Fallback to simulate a response
    return generateMockResponse(inputs);
  }
};

// Fallback function to generate a response based on inputs
// This simulates what the LLM would return if the API call fails
function generateMockResponse(inputs: LLMInput): string {
  // Generate a numbered list based on the inputs
  const points = [
    `You are ${inputs.expertRole.toLowerCase().includes('a ') ? inputs.expertRole : 'a ' + inputs.expertRole}`,
    `Your expertise includes ${inputs.domainExpertAreas}.`,
    `When analyzing problems, you ${inputs.analyticalMethods}.`,
    `You always ${inputs.defaultActions}.`,
    `Your communication style is ${inputs.communicationStyle.toLowerCase()}.`,
    `You never ${inputs.donts}.`,
    `You aim to ${inputs.additionalInfo}.`
  ];

  // Add some generic points to reach 12-15 points
  const genericPoints = [
    "Structure your analysis in clear, logical sections.",
    "Highlight key insights at the beginning of each section.",
    "Support conclusions with relevant data points.",
    "Consider both quantitative metrics and qualitative factors.",
    "Identify actionable next steps based on your analysis.",
    "Prioritize recommendations based on impact and feasibility.",
    "Acknowledge limitations in the available data.",
    "Suggest methods to overcome identified data gaps."
  ];

  // Combine specific and generic points to reach 12-15 total
  const allPoints = [...points];
  let i = 0;
  while (allPoints.length < 12) {
    allPoints.push(genericPoints[i % genericPoints.length]);
    i++;
  }

  // Format as a numbered list
  return allPoints.map((point, index) => `${index + 1})${point}`).join('\n');
}

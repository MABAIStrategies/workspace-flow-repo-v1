const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateWorkflow = async (prompt: string, dept: string, level: string, tools: string[]) => {
    if (!GEMINI_API_KEY) {
        throw new Error("Missing Gemini API Key");
    }

    const systemPrompt = `
    You are an expert Automation Architect. Your goal is to design a specific, actionable workflow for a user.
    
    Context:
    - Department: ${dept}
    - Automation Level: ${level} (HITL=Human in Loop, Triggered=Event Driven, Background=Fully Auto)
    - Available Tools: ${tools.join(', ')}
    
    User Request: "${prompt}"

    Output Format:
    Return a JSON object ONLY, with this structure:
    {
        "title": "A short, catchy name for this flow",
        "desc": "A 2-sentence summary of what it does and the value it provides.",
        "steps": ["Step 1", "Step 2", "Step 3", "Step 4"]
    }
    `;

    // FIXED: Updated to use correct model names
    const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];
    
    let lastError;

    for (const model of models) {
        try {
            console.log(`Attempting AI with model: ${model}`);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                // If it's a 404 (Not Found) or 400 (Bad Request), try next model
                const apiError = data.error?.message || response.statusText;
                console.warn(`Model ${model} failed: ${apiError}`);
                lastError = apiError;
                continue; // Try next model
            }

            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!text) {
                 // Success response but no text? weird, but try next
                 continue;
            }

            // Clean markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error(`Gemini Attempt Error (${model}):`, error);
            lastError = error;
            // Continue to next model
        }
    }

    // If we get here, all models failed
    throw new Error(`AI Failed after trying multiple models. Last error: ${lastError}`);
};
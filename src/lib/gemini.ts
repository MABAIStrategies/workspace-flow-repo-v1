const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateWorkflow = async (prompt: string, dept: string, level: string, tools: string[], platform: string) => {
    if (!GEMINI_API_KEY) {
        throw new Error("Missing Gemini API Key");
    }

    const systemPrompt = `
    You are an expert Universal Automation Architect specializing in ${platform}.
    Your goal is to design a high-value, production-grade automation workflow for the ${platform} ecosystem.
    
    Architecture Context:
    - Department: ${dept}
    - Automation Style: ${level} (HITL=Human in Loop, Triggered=Event-Driven, Background=Fully Autonomous)
    - Available Tools: ${tools.join(', ')}
    - Target Execution Platform: ${platform}
    
    User Intent: "${prompt}"

    Guidelines for ${platform}:
    1. If Zapier/Make: Focus on specific triggers/actions (e.g., Webhooks, Search Step, Iterator).
    2. If Google/Microsoft: Focus on App Script or Power Automate logic.
    3. If multi-platform: Explain how data moves between systems securely.

    Output Requirements:
    Return a valid JSON object ONLY. Do not include any text before or after the JSON.
    
    JSON Structure:
    {
        "title": "A short, professional name",
        "desc": "A concise summary of the workflow's architecture and the business ROI.",
        "platform": "${platform}",
        "steps": [
            "Step 1: [Specific Logic]",
            "Step 2: [Specific Logic]",
            "Step 3: [Specific Logic]"
        ],
        "implementationPrompt": "A detailed, technical specification that the user can copy-paste into an AI assistant (like Gemini, ChatGPT, or the platform's native AI) to generate the actual code, script, or configuration. Include specific variable names, API endpoints if relevant, and error handling logic."
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
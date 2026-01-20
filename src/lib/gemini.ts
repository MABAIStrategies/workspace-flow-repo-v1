
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

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            const apiError = data.error?.message || response.statusText;
            throw new Error(`Gemini API Error: ${apiError}`);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
             console.error("Gemini Unexpected Response:", data);
             throw new Error("AI returned success but no text. Check safety settings.");
        }

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
};

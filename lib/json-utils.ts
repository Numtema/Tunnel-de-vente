export function parseJsonResponse(text: string | undefined): any {
  if (!text) return {};
  
  // Try to find the JSON block within the text
  let jsonStr = text.trim();
  
  // Remove markdown code blocks if present
  const markdownMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
  if (markdownMatch) {
    jsonStr = markdownMatch[1];
  } else {
    // If no markdown block, try to find the first '{' or '[' and last '}' or ']'
    const firstBrace = jsonStr.indexOf('{');
    const firstBracket = jsonStr.indexOf('[');
    const lastBrace = jsonStr.lastIndexOf('}');
    const lastBracket = jsonStr.lastIndexOf(']');
    
    const start = (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) ? firstBrace : firstBracket;
    const end = (lastBrace !== -1 && (lastBracket === -1 || lastBrace > lastBracket)) ? lastBrace : lastBracket;
    
    if (start !== -1 && end !== -1 && end > start) {
      jsonStr = jsonStr.substring(start, end + 1);
    }
  }

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON:", jsonStr);
    // Fallback: try to clean up common issues like trailing commas if simple parse fails
    try {
      // Very basic cleanup for trailing commas in objects/arrays
      const cleaned = jsonStr.replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(cleaned);
    } catch (innerE) {
      return {};
    }
  }
}

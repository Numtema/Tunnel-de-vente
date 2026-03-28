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
    // We try to find the largest possible JSON object/array
    const firstBrace = jsonStr.indexOf('{');
    const firstBracket = jsonStr.indexOf('[');
    
    let start = -1;
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      start = firstBrace;
    } else if (firstBracket !== -1) {
      start = firstBracket;
    }

    if (start !== -1) {
      // Try to find the matching closing brace/bracket
      // We'll try from the end of the string and see if it parses
      const lastBrace = jsonStr.lastIndexOf('}');
      const lastBracket = jsonStr.lastIndexOf(']');
      let end = Math.max(lastBrace, lastBracket);

      while (end > start) {
        const potentialJson = jsonStr.substring(start, end + 1);
        try {
          return JSON.parse(potentialJson);
        } catch (e) {
          // Not this one, try the next one from the end
          const nextBrace = jsonStr.lastIndexOf('}', end - 1);
          const nextBracket = jsonStr.lastIndexOf(']', end - 1);
          end = Math.max(nextBrace, nextBracket);
        }
      }
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

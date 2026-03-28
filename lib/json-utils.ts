export function parseJsonResponse(text: string | undefined): any {
  if (!text) return {};
  const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON:", cleaned);
    return {};
  }
}

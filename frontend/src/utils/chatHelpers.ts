/**
 * Helper utility to extract clean human-readable response text
 * from any chatbot backend API response payload.
 *
 * Prevents raw JSON strings (like {"preferred_language":..., "english":...})
 * or raw JSON objects from ever rendering directly on the screen.
 */

export function extractResponseText(data: any): string {
  if (data === null || data === undefined) {
    return "";
  }

  // Handle direct string
  if (typeof data === "string") {
    const trimmed = data.trim();
    // If it looks like a JSON string, try parsing it recursively
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        const parsed = JSON.parse(trimmed);
        return extractResponseText(parsed);
      } catch {
        return data;
      }
    }
    return data;
  }

  // Handle Backend ChatResponse structured payload
  // Response shape 1: { response: { preferred_language: { text: "..." }, english: { text: "..." } } }
  // Response shape 2: { response: { language: "English", text: "..." } }
  // Response shape 3: { response: "..." }
  if (data.response) {
    if (typeof data.response === "string") {
      return extractResponseText(data.response);
    }
    if (typeof data.response === "object") {
      // Non-English bilingual response
      if (data.response.preferred_language && typeof data.response.preferred_language.text === "string") {
        return data.response.preferred_language.text;
      }
      // English response inside preferred_language or english key
      if (data.response.english && typeof data.response.english.text === "string") {
        return data.response.english.text;
      }
      // Single language response: { language: "...", text: "..." }
      if (typeof data.response.text === "string") {
        return data.response.text;
      }
    }
  }

  // Response shape 4: { success: true, data: { answer: "..." } }
  if (data.data) {
    if (typeof data.data === "string") return extractResponseText(data.data);
    if (typeof data.data === "object") {
      if (typeof data.data.answer === "string") return data.data.answer;
      if (typeof data.data.message === "string") return data.data.message;
      if (typeof data.data.text === "string") return data.data.text;
      if (typeof data.data.content === "string") return data.data.content;
    }
  }

  // Direct key fallbacks
  if (typeof data.answer === "string") return data.answer;
  if (typeof data.message === "string") return data.message;
  if (typeof data.text === "string") return data.text;
  if (typeof data.content === "string") return data.content;

  // Fallback if data is an object without known keys
  return "Unable to format backend response.";
}

/**
 * Retries an async function up to maxRetries times before throwing an error.
 * Default delay is 0ms to eliminate artificial delays.
 */
export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 0, delayMs = 0): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= maxRetries) {
        throw err;
      }
      attempt++;
      if (delayMs > 0) {
        await new Promise(res => setTimeout(res, delayMs));
      }
    }
  }
}

export interface ChatTimings {
  clickTime: number;
  reqStartTime: number;
  respReceivedTime: number;
  renderCompleteTime?: number;
}

export function logChatPerformance(timings: ChatTimings) {
  const renderTime = timings.renderCompleteTime || performance.now();
  const tClick = 0;
  const tReqStart = Math.max(0, timings.reqStartTime - timings.clickTime).toFixed(2);
  const tBackendResp = Math.max(0, timings.respReceivedTime - timings.clickTime).toFixed(2);
  const tNetBackend = Math.max(0, timings.respReceivedTime - timings.reqStartTime).toFixed(2);
  const tRender = Math.max(0, renderTime - timings.clickTime).toFixed(2);

  console.log(
    `%c[AgriSarthi Chatbot Performance Metrics]\n` +
    `UI Click: ${tClick.toFixed(2)}ms\n` +
    `API Request Started: +${tReqStart}ms\n` +
    `Backend Response Received: +${tBackendResp}ms (Network+Backend: ${tNetBackend}ms)\n` +
    `Frontend Render Completed: +${tRender}ms\n` +
    `Total Time: ${tRender}ms`,
    'color: #10B981; font-weight: bold; font-size: 12px;'
  );
}

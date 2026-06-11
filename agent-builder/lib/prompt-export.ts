/**
 * Export format data structure
 */
interface ExportData {
  agentName: string;
  agentType: string;
  prompt: {
    system: string;
    examples?: Array<{
      input: string;
      expected_output: string;
    }>;
    success_criteria?: string[];
  };
}

/**
 * Convert prompt data to Markdown format
 */
export function toMarkdown(data: ExportData): string {
  const { agentName, agentType, prompt } = data;
  const lines: string[] = [];

  // Header
  lines.push(`# ${agentName}`);
  lines.push(`**Type:** ${agentType}`);
  lines.push("");

  // System Prompt Section
  lines.push("## System Prompt");
  lines.push("");
  lines.push("```");
  lines.push(prompt.system);
  lines.push("```");
  lines.push("");

  // Examples Section (if present)
  if (prompt.examples && prompt.examples.length > 0) {
    lines.push("## Examples");
    lines.push("");

    prompt.examples.forEach((example, idx) => {
      lines.push(`### Example ${idx + 1}`);
      lines.push("");

      lines.push("**Input:**");
      lines.push("");
      lines.push("```");
      lines.push(example.input);
      lines.push("```");
      lines.push("");

      lines.push("**Expected Output:**");
      lines.push("");
      lines.push("```");
      lines.push(example.expected_output);
      lines.push("```");
      lines.push("");
    });
  }

  // Success Criteria Section (if present)
  if (prompt.success_criteria && prompt.success_criteria.length > 0) {
    lines.push("## Success Criteria");
    lines.push("");

    prompt.success_criteria.forEach((criterion, idx) => {
      lines.push(`${idx + 1}. ${criterion}`);
    });
    lines.push("");
  }

  // Metadata footer
  lines.push("---");
  lines.push(`_Generated on ${new Date().toISOString()}_`);

  return lines.join("\n");
}

/**
 * Convert prompt data to plain text format
 */
export function toText(data: ExportData): string {
  const { agentName, agentType, prompt } = data;
  const lines: string[] = [];

  // Header
  lines.push("=".repeat(80));
  lines.push(agentName.toUpperCase());
  lines.push("=".repeat(80));
  lines.push("");

  lines.push(`Type: ${agentType}`);
  lines.push("");

  // System Prompt Section
  lines.push("-".repeat(80));
  lines.push("SYSTEM PROMPT");
  lines.push("-".repeat(80));
  lines.push("");
  lines.push(prompt.system);
  lines.push("");

  // Examples Section (if present)
  if (prompt.examples && prompt.examples.length > 0) {
    lines.push("-".repeat(80));
    lines.push("EXAMPLES");
    lines.push("-".repeat(80));
    lines.push("");

    prompt.examples.forEach((example, idx) => {
      lines.push(`EXAMPLE ${idx + 1}:`);
      lines.push("");

      lines.push("INPUT:");
      lines.push(example.input);
      lines.push("");

      lines.push("EXPECTED OUTPUT:");
      lines.push(example.expected_output);
      lines.push("");
    });
  }

  // Success Criteria Section (if present)
  if (prompt.success_criteria && prompt.success_criteria.length > 0) {
    lines.push("-".repeat(80));
    lines.push("SUCCESS CRITERIA");
    lines.push("-".repeat(80));
    lines.push("");

    prompt.success_criteria.forEach((criterion, idx) => {
      lines.push(`${idx + 1}. ${criterion}`);
    });
    lines.push("");
  }

  // Metadata footer
  lines.push("=".repeat(80));
  lines.push(`Generated on: ${new Date().toISOString()}`);
  lines.push("=".repeat(80));

  return lines.join("\n");
}

/**
 * Trigger a file download in the browser
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  // Create blob with appropriate MIME type
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  // Create and trigger download
  const element = document.createElement("a");
  element.setAttribute("href", url);
  element.setAttribute("download", filename);
  element.style.display = "none";

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  // Clean up object URL
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard and return success status
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}

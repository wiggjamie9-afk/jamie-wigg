/**
 * Example: Using Studio LLM Router in components
 *
 * Shows how to integrate intelligent LLM routing into STARLIGHTMIX Studio
 */

import React, { useState } from "react";
import {
  routeStudioTask,
  generateCaption,
  generateMetadata,
  interpretEditingInstruction,
  getTaskRoutingInfo,
} from "./llm-studio";

/**
 * Example 1: Caption generator component
 */
export function CaptionGenerator({ videoDescription }: { videoDescription: string }) {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("");

  const handleGenerateCaption = async () => {
    setLoading(true);
    try {
      const result = await generateCaption(videoDescription);
      setCaption(result.text);
      setProvider(result.provider);
    } catch (error) {
      console.error("Failed to generate caption:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateCaption} disabled={loading}>
        {loading ? "Generating..." : "Generate Caption"}
      </button>
      {caption && (
        <div>
          <p>{caption}</p>
          <small>Generated via: {provider}</small>
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Metadata generator (bulk tags + description)
 */
export function MetadataGenerator({
  videoTitle,
  videoDescription,
}: {
  videoTitle: string;
  videoDescription: string;
}) {
  const [metadata, setMetadata] = useState("");
  const [mode, setMode] = useState<"free" | "paid">("free");
  const [loading, setLoading] = useState(false);

  const handleGenerateMetadata = async () => {
    setLoading(true);
    try {
      // This task is low-value, so it will always try free tier first
      const result = await generateMetadata(videoTitle, videoDescription);
      setMetadata(result.text);
      setMode(result.mode);
    } catch (error) {
      console.error("Failed to generate metadata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateMetadata} disabled={loading}>
        {loading ? "Generating..." : "Generate Tags & Description"}
      </button>
      {metadata && (
        <div>
          <pre>{metadata}</pre>
          <small>Generated via: {mode === "free" ? "Free tier" : "Claude"}</small>
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Editing instruction interpreter
 *
 * This is a HIGH-VALUE task, so it:
 * - Uses "auto" mode by default (free in morning, Claude at night)
 * - Can be forced to Claude with forceMode="paid"
 */
export function EditingInstructionHelper({
  instruction,
}: {
  instruction: string;
}) {
  const [explanation, setExplanation] = useState("");
  const [provider, setProvider] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInterpret = async (forceMode?: "free" | "paid") => {
    setLoading(true);
    try {
      const result = await interpretEditingInstruction(instruction, forceMode);
      setExplanation(result.text);
      setProvider(result.provider);
    } catch (error) {
      console.error("Failed to interpret instruction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => handleInterpret()} disabled={loading}>
        {loading ? "Analyzing..." : "Interpret Instruction"}
      </button>
      <button onClick={() => handleInterpret("paid")} disabled={loading}>
        Force Claude
      </button>
      {explanation && (
        <div>
          <p>{explanation}</p>
          <small>Interpreted by: {provider}</small>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Advanced usage with custom routing
 */
export function AdvancedLLMExample() {
  const [result, setResult] = useState("");

  const handleCustomTask = async () => {
    // Route a custom task
    const response = await routeStudioTask({
      task: "suggestion",
      prompt: "What editing style would work well for a music video about space exploration?",
      options: {
        temperature: 0.9,
        maxTokens: 250,
        // Optionally force a specific mode:
        // forceMode: "paid",
      },
    });

    setResult(`${response.text}\n\n[Generated via ${response.provider} on ${response.mode}]`);
  };

  return (
    <div>
      <button onClick={handleCustomTask}>Get Style Suggestion</button>
      {result && <pre>{result}</pre>}
    </div>
  );
}

/**
 * Example 5: Task routing info (for debugging/logging)
 */
export function TaskRoutingDebugger() {
  const tasks = ["caption", "narration", "metadata", "reasoning", "editing"] as const;

  return (
    <div>
      <h3>Task Routing Matrix</h3>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Mode</th>
            <th>Expected Provider</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const info = getTaskRoutingInfo(task);
            return (
              <tr key={task}>
                <td>{task}</td>
                <td>{info.priority}</td>
                <td>{info.mode}</td>
                <td>{info.expectedProvider}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

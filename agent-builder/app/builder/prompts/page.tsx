import PromptViewer from "@/components/PromptViewer";
import {
  loadAllTemplates,
  AgentTemplate,
} from "@/lib/agent-templates";

export default async function PromptsPage() {
  // Load all templates
  const templates = loadAllTemplates();
  const templatesList = Array.from(templates.values()).sort((a, b) => {
    const tierOrder = { starter: 0, pro: 1, addon: 2 };
    return (
      tierOrder[a.tier as keyof typeof tierOrder] -
      tierOrder[b.tier as keyof typeof tierOrder]
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Agent Prompts
          </h1>
          <p className="text-lg text-gray-600">
            Copy-paste ready prompts for all 6 agent types. Export as Markdown
            or plain text for easy integration.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {templatesList.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No agent templates found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {templatesList.map((template: AgentTemplate) => (
              <div key={template.id} className="scroll-mt-12" id={template.id}>
                {/* Agent header with tier badge */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {template.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {template.description}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                      template.tier === "starter"
                        ? "bg-blue-100 text-blue-800"
                        : template.tier === "pro"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {template.tier.charAt(0).toUpperCase() +
                      template.tier.slice(1)}{" "}
                    Tier
                  </span>
                </div>

                {/* Prompt Viewer Component */}
                <PromptViewer
                  agentName={template.name}
                  agentType={template.id}
                  prompt={template.prompts}
                />

                {/* Agent Config Details */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Environment
                    </h4>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-600">Model</dt>
                        <dd className="font-mono text-gray-900">
                          {template.environment.model}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-600">Temperature</dt>
                        <dd className="font-mono text-gray-900">
                          {template.environment.temperature}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-600">Max Tokens</dt>
                        <dd className="font-mono text-gray-900">
                          {template.environment.max_tokens}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-600">Tools</dt>
                        <dd className="font-mono text-gray-900">
                          {template.environment.tools.join(", ")}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Session
                    </h4>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-600">Max Duration</dt>
                        <dd className="font-mono text-gray-900">
                          {template.session.max_duration}s
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-600">Memory Type</dt>
                        <dd className="font-mono text-gray-900">
                          {template.session.memory_type}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-600">Context Window</dt>
                        <dd className="font-mono text-gray-900">
                          {template.session.context_window}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <hr className="my-12" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation Sidebar */}
      {templatesList.length > 0 && (
        <div className="fixed right-8 top-32 hidden lg:block">
          <nav className="w-48 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Agent Types
            </h3>
            <ul className="space-y-2">
              {templatesList.map((template) => (
                <li key={template.id}>
                  <a
                    href={`#${template.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline block truncate"
                  >
                    {template.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

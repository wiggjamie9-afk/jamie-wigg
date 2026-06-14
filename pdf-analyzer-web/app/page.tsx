'use client';

import { useState, useRef } from 'react';
import { FileText, Upload, Loader, Send, MessageSquare, Download } from 'lucide-react';
import axios from 'axios';

interface AnalysisResult {
  status: string;
  analysis: string;
  pages_analyzed: number;
  tokens_used?: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyze' | 'chat' | 'extract'>('analyze');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('analysis_type', analysisType);

      const response = await axios.post(`${API_BASE}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE}/extract`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult({
        status: 'success',
        analysis: response.data.text,
        pages_analyzed: response.data.pages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!file || !chatMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatMessage,
    };

    setMessages([...messages, userMessage]);
    setChatMessage('');
    setChatLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'messages',
        JSON.stringify(messages.concat([userMessage]))
      );

      const response = await axios.post(`${API_BASE}/chat`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chat failed');
    } finally {
      setChatLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;

    const element = document.createElement('a');
    const file = new Blob([result.analysis], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `pdf-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">PDF Analyzer</h1>
          </div>
          <p className="text-purple-200 text-lg">
            Extract insights from PDFs with AI-powered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-purple-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-white font-semibold mb-4">PDF Upload</h2>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-400 rounded-lg p-8 text-center cursor-pointer hover:border-purple-300 transition"
              >
                <Upload className="w-10 h-10 text-purple-300 mx-auto mb-2" />
                <p className="text-purple-200">
                  {file ? file.name : 'Click to select PDF'}
                </p>
                <p className="text-purple-400 text-sm mt-1">
                  or drag and drop
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {file && (
                <div className="mt-4 p-3 bg-purple-700 rounded text-purple-100 text-sm">
                  ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-900 rounded text-red-100 text-sm">
                  {error}
                </div>
              )}

              {/* Tabs */}
              <div className="mt-6 space-y-3">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('analyze')}
                    className={`flex-1 py-2 rounded text-sm font-medium transition ${
                      activeTab === 'analyze'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-purple-700 text-purple-200 hover:bg-purple-600'
                    }`}
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-2 rounded text-sm font-medium transition ${
                      activeTab === 'chat'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-purple-700 text-purple-200 hover:bg-purple-600'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('extract')}
                    className={`flex-1 py-2 rounded text-sm font-medium transition ${
                      activeTab === 'extract'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-purple-700 text-purple-200 hover:bg-purple-600'
                    }`}
                  >
                    Extract
                  </button>
                </div>

                {activeTab === 'analyze' && (
                  <>
                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">
                        Analysis Type
                      </label>
                      <select
                        value={analysisType}
                        onChange={(e) => setAnalysisType(e.target.value)}
                        className="w-full bg-purple-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="general">General Analysis</option>
                        <option value="summary">Executive Summary</option>
                        <option value="extraction">Key Information</option>
                        <option value="questions">Q&A Generation</option>
                      </select>
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={!file || loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-purple-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Analyze PDF
                        </>
                      )}
                    </button>
                  </>
                )}

                {activeTab === 'chat' && (
                  <button
                    disabled={!file}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-purple-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Ready to Chat
                  </button>
                )}

                {activeTab === 'extract' && (
                  <button
                    onClick={handleExtract}
                    disabled={!file || loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-purple-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Extract Text
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {activeTab === 'chat' ? (
              <div className="bg-purple-800 rounded-lg p-6 shadow-xl h-96 flex flex-col">
                <h2 className="text-white font-semibold mb-4">Chat</h2>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-purple-300 mt-10">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Start a conversation about your PDF</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-purple-700 text-purple-100'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-purple-700 px-4 py-2 rounded-lg">
                        <Loader className="w-4 h-4 animate-spin text-purple-300" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && handleSendMessage()
                    }
                    placeholder="Ask about the PDF..."
                    className="flex-1 bg-purple-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    disabled={!file || chatLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!file || !chatMessage.trim() || chatLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-purple-700 text-white px-4 py-2 rounded transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : result ? (
              <div className="bg-purple-800 rounded-lg p-6 shadow-xl h-96 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white font-semibold">Results</h2>
                  <button
                    onClick={downloadResult}
                    className="text-purple-300 hover:text-white transition"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto mb-4">
                  <div className="text-purple-100 text-sm whitespace-pre-wrap leading-relaxed">
                    {result.analysis}
                  </div>
                </div>

                <div className="text-xs text-purple-400 border-t border-purple-700 pt-3">
                  Pages analyzed: {result.pages_analyzed}
                  {result.tokens_used && ` • Tokens used: ${result.tokens_used}`}
                </div>
              </div>
            ) : (
              <div className="bg-purple-800 rounded-lg p-6 shadow-xl h-96 flex items-center justify-center text-center">
                <div>
                  <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
                  <p className="text-purple-300">
                    Select a PDF and click analyze to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ClipLoader } from 'react-spinners';
import type { ModelOption, ChatResponse, FormData } from './types';

const Select = dynamic(() => import('react-select'), { ssr: false });

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    apiKey: '',
    prompt: '',
    selectedModel: null,
  });
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchModels = async () => {
      setModelsLoading(true);
      try {
        const res = await fetch('/api/models');
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          setModelOptions(
            data.data.map((model: any) => ({
              value: model.id,
              label: model.id + (model.name ? ` (${model.name})` : ''),
            }))
          );
        } else {
          setModelOptions([]);
        }
      } catch (err) {
        setModelOptions([]);
      } finally {
        setModelsLoading(false);
      }
    };
    fetchModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: formData.prompt,
          model: formData.selectedModel?.value,
          apiKey: formData.apiKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Try to extract the assistant's message
      const assistantMessage = data?.choices?.[0]?.message?.content;
      if (assistantMessage) {
        setResponse(assistantMessage);
      } else {
        setResponse(JSON.stringify(data, null, 2)); // fallback: show raw response
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">OpenRouter Prompt Interface</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
            OpenRouter API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={formData.apiKey}
            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium mb-2">
            Select Model
          </label>
          <Select
            id="model"
            options={modelOptions}
            value={formData.selectedModel}
            onChange={(option: any) => setFormData({ ...formData, selectedModel: option })}
            isSearchable
            isLoading={modelsLoading}
            className="text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Your Prompt
          </label>
          <textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            className="w-full p-2 border rounded-md h-32"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <ClipLoader size={20} color="white" />
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            'Submit'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md whitespace-pre-wrap text-black dark:text-white">
            {response}
          </div>
        </div>
      )}
    </main>
  );
}

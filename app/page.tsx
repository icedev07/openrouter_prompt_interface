'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ClipLoader } from 'react-spinners';
import type { ModelOption, FormData } from './types';

const Select = dynamic(() => import('react-select'), { ssr: false });

interface OpenRouterModel {
  id: string;
  name?: string;
}

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
            data.data.map((model: OpenRouterModel) => ({
              value: model.id,
              label: model.id + (model.name ? ` (${model.name})` : ''),
            }))
          );
        } else {
          setModelOptions([]);
        }
      } catch {
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
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-col items-center justify-center py-10 px-2">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 sm:p-12 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center mb-8 gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 text-white text-2xl font-extrabold shadow-lg select-none">
            T
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              Toloka.ai
              <span className="text-lg font-semibold text-indigo-500 ml-2">OpenRouter Prompt Interface</span>
            </h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none transition"
              required
            />
          </div>

          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              OpenRouter API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 outline-none transition"
              required
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Select Model
            </label>
            <Select
              id="model"
              options={modelOptions}
              value={formData.selectedModel}
              onChange={(option) => setFormData({ ...formData, selectedModel: option as ModelOption | null })}
              isSearchable
              isLoading={modelsLoading}
              className="text-black"
              required
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#f3f4f6',
                  borderColor: '#a5b4fc',
                  minHeight: '48px',
                  boxShadow: 'none',
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 100,
                }),
              }}
            />
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Your Prompt
            </label>
            <textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none transition h-32 resize-none"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white p-3 rounded-lg font-bold text-lg shadow-md hover:from-indigo-500 hover:to-pink-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <ClipLoader size={22} color="white" />
                <span className="ml-3">Processing...</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-700 shadow">
            {error}
          </div>
        )}

        {response && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Response:</h2>
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl whitespace-pre-wrap text-gray-900 dark:text-white border border-indigo-100 dark:border-gray-700 shadow-inner min-h-[56px]">
              {response}
            </div>
          </div>
        )}
      </div>
      <footer className="mt-10 text-gray-500 dark:text-gray-400 text-sm text-center">
        &copy; {new Date().getFullYear()} Toloka.ai. Powered by OpenRouter.
      </footer>
    </div>
  );
}

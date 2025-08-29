import React, { useState } from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';
import WordForm from './components/WordForm';
import ExplanationCard from './components/ExplanationCard';
import StoryCard from './components/StoryCard';
import { callOpenAI } from './api/openai';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (words, age) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Calling OpenAI API with words:', words, 'for age:', age);
      const response = await callOpenAI(words, age);
      console.log('OpenAI response:', response);
      setResult(response);
    } catch (err) {
      console.error('API Error:', err);

      // Provide specific error messages based on error type
      let errorMessage = 'Failed to generate explanations. ';

      if (err.message.includes('API key')) {
        errorMessage += 'Please check your OpenAI API key in the .env file.';
      } else if (
        err.message.includes('quota') ||
        err.message.includes('billing')
      ) {
        errorMessage += 'You may have exceeded your OpenAI API usage quota.';
      } else if (
        err.message.includes('network') ||
        err.message.includes('fetch')
      ) {
        errorMessage += 'Please check your internet connection and try again.';
      } else {
        errorMessage += 'Please try again in a moment.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
              <BookOpen className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Vocabulary Teacher
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transform learning with AI-powered vocabulary explanations and
            engaging stories! Perfect for students, teachers, and curious minds
            of all ages.
          </p>
        </div>

        {/* Main Form */}
        <WordForm onSubmit={handleSubmit} loading={loading} />

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-r-xl animate-slide-up">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Oops! Something went wrong
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <div className="mt-4">
                  <button
                    onClick={handleTryAgain}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Creating Your Learning Content
            </h3>
            <p className="text-gray-600">
              Our AI is crafting personalized explanations and stories just for
              you...
            </p>
          </div>
        )}

        {/* Results Display */}
        {result && !loading && (
          <div className="space-y-8 animate-fade-in">
            {/* Success Message */}
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    🎉 Success! Your vocabulary content has been generated. Use
                    the "Read" buttons to hear the explanations aloud!
                  </p>
                </div>
              </div>
            </div>
            {/* Word Explanations Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-full">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Word Explanations
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
              </div>

              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                {result.explanations.map((explanation, index) => (
                  <div
                    key={index}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ExplanationCard explanation={explanation} />
                  </div>
                ))}
              </div>
            </section>

            {/* Story Section */}
            {result.story && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <BookOpen className="text-orange-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Your Vocabulary Story
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                </div>
                <StoryCard story={result.story} />
              </section>
            )}
          </div>
        )}

        {/* Example Word Lists */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            🌟 Example Word Lists to Get You Started
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-2">
                  💰 Finance & Money
                </h4>
                <p className="text-sm text-blue-700 font-mono">
                  afford, loan, profit, prosper, risk, savings, scarce, wages
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h4 className="font-semibold text-green-800 mb-2">
                  🔬 Science & Space
                </h4>
                <p className="text-sm text-green-700 font-mono">
                  atom, energy, gravity, molecule, orbit, planet, solar,
                  universe
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <h4 className="font-semibold text-purple-800 mb-2">
                  🌿 Nature & Environment
                </h4>
                <p className="text-sm text-purple-700 font-mono">
                  ecosystem, habitat, migration, predator, species, adaptation,
                  environment
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h4 className="font-semibold text-orange-800 mb-2">
                  ⚡ Adventure & Exploration
                </h4>
                <p className="text-sm text-orange-700 font-mono">
                  courage, explore, journey, treasure, mystery, discovery,
                  brave, quest
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              💡 <strong>Pro Tip:</strong> Mix different difficulty levels and
              topics to create engaging learning experiences!
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen size={16} />
            <span>Powered by GPT-4o</span>
          </div>
          <p>
            Created by{' '}
            <a
              className="text-blue-600"
              href="https://parisadarkhal.github.io/React-Portfolio/"
              target="blank"
            >
              Parisa
            </a>{' '}
            with ❤️ for learners everywhere
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;

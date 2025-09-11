import { useState, useEffect } from 'react';
import {
  BookOpen,
  User,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const WordForm = ({ onSubmit, loading }) => {
  const [words, setWords] = useState('');
  const [age, setAge] = useState(9);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Update word count
  useEffect(() => {
    const count = words.split(',').filter((w) => w.trim().length > 0).length;
    setWordCount(count);
  }, [words]);

  const handleSubmit = () => {
    const newErrors = {};

    if (!words.trim()) {
      newErrors.words = 'Please enter some words';
    }

    if (age < 5 || age > 18) {
      newErrors.age = 'Age must be between 5 and 18';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const wordList = words
        .split(',')
        .map((w) => w.trim())
        .filter((w) => w.length > 0);

      setIsSubmitted(true);
      setTimeout(() => {
        onSubmit(wordList, age);
      }, 300);
    }
  };

  const getWordCountColor = () => {
    if (wordCount === 0) return 'text-gray-400';
    if (wordCount <= 3) return 'text-orange-500';
    if (wordCount <= 6) return 'text-green-500';
    return 'text-blue-500';
  };

  const getWordCountMessage = () => {
    if (wordCount === 0) return 'Start typing some words...';
    if (wordCount === 1) return `${wordCount} word added`;
    if (wordCount <= 3) return `${wordCount} words - add a few more!`;
    if (wordCount <= 6) return `${wordCount} words - perfect amount!`;
    return `${wordCount} words - great selection!`;
  };

  return (
    <div
      className={`transform transition-all duration-1000 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-2xl p-8 mb-8 border border-white/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group">
        {/* Animated background elements */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse delay-300"></div>

        {/* Header with enhanced animation */}
        <div className="relative flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300">
              <BookOpen className="text-blue-600" size={28} />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-1">
              Vocabulary Learning Tool
            </h2>
            <p className="text-gray-600 text-sm font-medium">
              Powered by AI Magic ✨
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 px-4 py-2 rounded-full shadow-inner">
            <Zap className="text-emerald-500" size={16} />
            <span className="text-emerald-700 text-sm font-semibold">
              Ready to Learn
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Words Input with enhanced styling */}
          <div
            className={`transform transition-all duration-500 ${
              focusedField === 'words' ? 'scale-[1.02]' : 'scale-100'
            }`}
          >
            <label
              htmlFor="words"
              className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"
            >
              <Sparkles size={16} className="text-purple-500" />
              Enter words (separated by commas)
              <div
                className={`ml-auto text-xs px-3 py-1 rounded-full font-semibold transition-all duration-300 ${
                  wordCount > 0
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm'
                    : 'bg-gray-100'
                }`}
              >
                <span className={getWordCountColor()}>
                  {getWordCountMessage()}
                </span>
              </div>
            </label>

            <div className="relative group/input">
              <input
                type="text"
                id="words"
                value={words}
                onChange={(e) => setWords(e.target.value)}
                onFocus={() => setFocusedField('words')}
                onBlur={() => setFocusedField('')}
                placeholder="e.g., afford, loan, profit, prosper, risk, savings"
                className={`w-full px-6 py-4 border-2 rounded-2xl text-gray-800 placeholder-gray-400 font-medium
                  transition-all duration-300 ease-out shadow-lg focus:shadow-2xl transform focus:scale-[1.01]
                  bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm
                  ${
                    errors.words
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                      : focusedField === 'words'
                      ? 'border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleSubmit();
                  }
                }}
              />

              {/* Animated input border effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-sm opacity-0 transition-all duration-300 -z-10 ${
                  focusedField === 'words' ? 'opacity-100 scale-105' : ''
                }`}
              ></div>

              {/* Success checkmark animation */}
              {wordCount > 0 && !errors.words && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <CheckCircle2
                    className="text-green-500 animate-bounce"
                    size={20}
                  />
                </div>
              )}
            </div>

            {errors.words && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-2 animate-shake">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                {errors.words}
              </p>
            )}

            {/* Word preview chips */}
            {wordCount > 0 && !errors.words && (
              <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
                {words
                  .split(',')
                  .filter((w) => w.trim())
                  .slice(0, 8)
                  .map((word, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 shadow-sm animate-scale-in border border-blue-200/50"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {word.trim()}
                    </span>
                  ))}
                {wordCount > 8 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                    +{wordCount - 8} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Age Selection with enhanced styling */}
          <div
            className={`transform transition-all duration-500 ${
              focusedField === 'age' ? 'scale-[1.02]' : 'scale-100'
            }`}
          >
            <label
              htmlFor="age"
              className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"
            >
              <User size={16} className="text-emerald-500" />
              Age of audience
              <span className="ml-auto text-xs bg-gradient-to-r from-emerald-100 to-blue-100 px-3 py-1 rounded-full text-emerald-700 font-semibold">
                Age {age} selected
              </span>
            </label>

            <div className="relative flex items-center gap-4 group/age">
              <div className="flex-shrink-0">
                <User
                  className="text-gray-400 group-hover/age:text-emerald-500 transition-colors duration-300"
                  size={24}
                />
              </div>

              <select
                id="age"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                onFocus={() => setFocusedField('age')}
                onBlur={() => setFocusedField('')}
                className={`flex-1 px-6 py-4 border-2 rounded-2xl text-gray-800 font-medium cursor-pointer
                  transition-all duration-300 ease-out shadow-lg focus:shadow-2xl transform focus:scale-[1.01]
                  bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm hover:shadow-xl
                  ${
                    errors.age
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                      : focusedField === 'age'
                      ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                {[...Array(14)].map((_, i) => (
                  <option key={i + 5} value={i + 5}>
                    {i + 5} years old
                  </option>
                ))}
              </select>

              {/* Animated select border effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-sm opacity-0 transition-all duration-300 -z-10 ${
                  focusedField === 'age' ? 'opacity-100 scale-105' : ''
                }`}
              ></div>
            </div>

            {errors.age && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-2 animate-shake">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                {errors.age}
              </p>
            )}
          </div>

          {/* Enhanced Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`group/btn relative w-full overflow-hidden rounded-2xl font-bold text-lg py-4 px-8 
                transition-all duration-500 ease-out transform hover:scale-[1.02] active:scale-[0.98]
                ${
                  loading
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed shadow-lg'
                    : isSubmitted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-2xl shadow-green-500/30'
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl shadow-purple-500/30 hover:shadow-3xl hover:shadow-purple-500/40'
                } text-white`}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>

              {/* Button shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>

              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="animate-pulse">
                      Creating explanations...
                    </span>
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle2 size={24} className="animate-bounce" />
                    <span>Success! Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles
                      size={24}
                      className="animate-pulse group-hover/btn:animate-spin transition-all duration-300"
                    />
                    <span>Generate Explanations & Story</span>
                    <ArrowRight
                      size={20}
                      className="transform group-hover/btn:translate-x-1 transition-transform duration-300"
                    />
                  </>
                )}
              </div>

              {/* Particle effects */}
              {!loading && (
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                  <div
                    className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="absolute top-4 right-8 w-1 h-1 bg-white rounded-full animate-ping"
                    style={{ animationDelay: '200ms' }}
                  ></div>
                  <div
                    className="absolute bottom-3 left-12 w-1 h-1 bg-white rounded-full animate-ping"
                    style={{ animationDelay: '400ms' }}
                  ></div>
                  <div
                    className="absolute bottom-2 right-6 w-1 h-1 bg-white rounded-full animate-ping"
                    style={{ animationDelay: '600ms' }}
                  ></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        {(wordCount > 0 || age !== 9) && (
          <div className="mt-6 animate-fade-in">
            {/* <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">Ready to generate</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {wordCount > 0 && age ? '100%' : wordCount > 0 ? '90%' : '50%'}{' '}
                complete
              </span>
            </div> */}
            {/* <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out ${
                  wordCount > 0 && age
                    ? 'w-full'
                    : wordCount > 0
                    ? 'w-[90%]'
                    : 'w-1/2'
                }`}
              ></div>
            </div> */}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default WordForm;

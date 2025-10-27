import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

// Mock the OpenAI API
jest.mock('../src/api/openai', () => ({
  callOpenAI: jest.fn(),
}));

import { callOpenAI } from '../src/api/openai';

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the main heading', () => {
    render(<App />);
    expect(screen.getByText('AI Vocabulary Teacher')).toBeInTheDocument();
  });

  test('renders the form elements', () => {
    render(<App />);
    expect(
      screen.getByPlaceholderText(/e.g., afford, loan, profit/)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('9 years old')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Generate Explanations & Story/ })
    ).toBeInTheDocument();
  });

  test('shows error when submitting empty form', async () => {
    render(<App />);
    const submitButton = screen.getByRole('button', {
      name: /Generate Explanations & Story/,
    });

    fireEvent.click(submitButton);

    expect(screen.getByText('Please enter some words')).toBeInTheDocument();
  });

  test('calls API and displays results on successful submission', async () => {
    const mockResponse = {
      explanations: [
        {
          word: 'test',
          definition: 'A way to check if something works',
          example: 'We took a test at school today.',
        },
      ],
      story:
        'Once upon a time, there was a magical test that helped children learn new things!',
    };

    callOpenAI.mockResolvedValueOnce(mockResponse);

    render(<App />);

    const wordInput = screen.getByPlaceholderText(/e.g., afford, loan, profit/);
    const submitButton = screen.getByRole('button', {
      name: /Generate Explanations & Story/,
    });

    fireEvent.change(wordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Word Explanations')).toBeInTheDocument();
    });

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(
      screen.getByText('A way to check if something works')
    ).toBeInTheDocument();
    expect(screen.getByText(/Once upon a time/)).toBeInTheDocument();
  });

  test('displays error message on API failure', async () => {
    callOpenAI.mockRejectedValueOnce(new Error('API Error'));

    render(<App />);

    const wordInput = screen.getByPlaceholderText(/e.g., afford, loan, profit/);
    const submitButton = screen.getByRole('button', {
      name: /Generate Explanations & Story/,
    });

    fireEvent.change(wordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to generate explanations/)
      ).toBeInTheDocument();
    });
  });
});

// tests/WordForm.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Create a minimal WordForm component for testing
const WordForm = ({ onSubmit, loading }) => {
  const [words, setWords] = React.useState('');
  const [age, setAge] = React.useState(9);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (words.trim()) {
      const wordList = words
        .split(',')
        .map((w) => w.trim())
        .filter((w) => w.length > 0);
      onSubmit(wordList, age);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={words}
        onChange={(e) => setWords(e.target.value)}
        placeholder="Enter words"
        data-testid="word-input"
      />
      <select
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        data-testid="age-select"
      >
        {[...Array(14)].map((_, i) => (
          <option key={i + 5} value={i + 5}>
            {i + 5} years old
          </option>
        ))}
      </select>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
    </div>
  );
};

describe('WordForm Component', () => {
  test('renders input fields', () => {
    const mockSubmit = jest.fn();
    render(<WordForm onSubmit={mockSubmit} loading={false} />);

    expect(screen.getByTestId('word-input')).toBeInTheDocument();
    expect(screen.getByTestId('age-select')).toBeInTheDocument();
  });

  test('calls onSubmit with correct data', () => {
    const mockSubmit = jest.fn();
    render(<WordForm onSubmit={mockSubmit} loading={false} />);

    const wordInput = screen.getByTestId('word-input');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(wordInput, { target: { value: 'test, word, list' } });
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith(['test', 'word', 'list'], 9);
  });

  test('shows loading state', () => {
    const mockSubmit = jest.fn();
    render(<WordForm onSubmit={mockSubmit} loading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeDisabled();
  });

  test('handles age selection', () => {
    const mockSubmit = jest.fn();
    render(<WordForm onSubmit={mockSubmit} loading={false} />);

    const ageSelect = screen.getByTestId('age-select');
    const wordInput = screen.getByTestId('word-input');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(ageSelect, { target: { value: '12' } });
    fireEvent.change(wordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith(['test'], 12);
  });
});

// tests/api/openai.test.js
import { callOpenAI, validateApiKey } from '../src/api/openai';

// Mock fetch
global.fetch = jest.fn();

describe('OpenAI API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
    process.env.REACT_APP_OPENAI_API_KEY = 'sk-test-key-12345678901234567890';
  });

  test('validateApiKey works correctly', () => {
    expect(validateApiKey('sk-valid-key-12345678901234567890')).toBe(true);
    expect(validateApiKey('invalid-key')).toBe(false);
    expect(validateApiKey('')).toBe(false);
    expect(validateApiKey(null)).toBe(false);
  });

  test('throws error when API key is missing', async () => {
    delete process.env.REACT_APP_OPENAI_API_KEY;

    await expect(callOpenAI(['test'], 10)).rejects.toThrow(
      'OpenAI API key not found'
    );
  });

  test('makes correct API call', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              explanations: [
                {
                  word: 'test',
                  definition: 'def',
                  example: 'ex',
                },
              ],
              story: 'A test story',
            }),
          },
        },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await callOpenAI(['test'], 10);

    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer sk-test-key-12345678901234567890',
        },
      })
    );

    expect(result.explanations).toHaveLength(1);
    expect(result.story).toBe('A test story');
  });

  test('handles API errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: { message: 'Invalid API key' } }),
    });

    await expect(callOpenAI(['test'], 10)).rejects.toThrow(
      'OpenAI API error: 401 - Invalid API key'
    );
  });
});

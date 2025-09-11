import React, { useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const TextToSpeechButton = ({ text, className = '' }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(() => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Set voice to a child-friendly one if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) => voice.name.includes('Female') || voice.name.includes('Woman')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  }, [text]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return (
    <button
      onClick={isSpeaking ? stop : speak}
      className={`flex items-center gap-2 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition-colors duration-200 ${className}`}
      title={isSpeaking ? 'Stop reading' : 'Read aloud'}
      aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
    >
      {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
      {isSpeaking ? 'Stop' : 'Read'}
    </button>
  );
};

export default TextToSpeechButton;

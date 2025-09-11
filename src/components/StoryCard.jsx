import React from 'react';
import { MessageSquare } from 'lucide-react';
import TextToSpeechButton from './TextToSpeechButton';

const StoryCard = ({ story }) => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl shadow-md p-6 border border-orange-100 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <MessageSquare className="text-orange-600" size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Your Vocabulary Story
          </h3>
        </div>
        <TextToSpeechButton text={story} />
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed text-lg">{story}</p>
      </div>
    </div>
  );
};

export default StoryCard;

import React from 'react';
import TextToSpeechButton from './TextToSpeechButton';

const ExplanationCard = ({ explanation }) => {
  const fullText = `${explanation.word}. ${explanation.definition} ${explanation.example} ${explanation.realWorld}`;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-blue-600 capitalize">
          {explanation.word}
        </h3>
        <TextToSpeechButton text={fullText} />
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-gray-700 mb-1">Definition:</h4>
          <p className="text-gray-600">{explanation.definition}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-1">
            Example sentence:
          </h4>
          <p className="text-gray-600 italic">"{explanation.example}"</p>
        </div>

        {/* <div>
          <h4 className="font-semibold text-gray-700 mb-1">
            Real-world example:
          </h4>
          <p className="text-gray-600">{explanation.realWorld}</p>
        </div> */}
      </div>
    </div>
  );
};

export default ExplanationCard;

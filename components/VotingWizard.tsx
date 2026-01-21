import React, { useState } from 'react';
import { Position } from '../types';
import CandidateCard from './CandidateCard';

interface VotingWizardProps {
  voterId: string;
  voterName: string;
  positions: Position[];
  onSubmit: (votes: Record<string, string>) => void;
}

const VotingWizard: React.FC<VotingWizardProps> = ({ voterId, voterName, positions, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({}); // PositionID -> CandidateID

  const currentPosition = positions[currentStep];
  const isLastStep = currentStep === positions.length - 1;
  const currentSelection = selections[currentPosition.id];

  const handleSelect = (candidateId: string) => {
    setSelections(prev => ({
      ...prev,
      [currentPosition.id]: candidateId
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      onSubmit(selections);
    } else {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const progressPercentage = ((currentStep + 1) / positions.length) * 100;

  return (
    <div className="pb-24">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 sticky top-0 z-20">
        <div 
          className="bg-indigo-600 h-2 transition-all duration-500 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <span className="text-indigo-600 font-semibold tracking-wider text-sm uppercase">
            Step {currentStep + 1} of {positions.length}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            {currentPosition.title}
          </h2>
          <p className="text-slate-500 mt-2">Select one candidate for this position.</p>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentPosition.candidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={currentSelection === candidate.id}
              onSelect={() => handleSelect(candidate.id)}
            />
          ))}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Back
          </button>

          <div className="text-sm text-slate-500 hidden sm:block">
             <span className="font-medium">{voterName}</span> <span className="text-slate-400">({voterId})</span>
          </div>

          <button
            onClick={handleNext}
            disabled={!currentSelection}
            className={`px-8 py-3 rounded-lg font-bold shadow-lg transition-all transform ${
              !currentSelection
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isLastStep ? 'Submit Votes' : 'Next Position →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingWizard;
import React from 'react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, isSelected, onSelect }) => {
  return (
    <div 
      onClick={onSelect}
      className={`group cursor-pointer relative rounded-xl overflow-hidden transition-all duration-300 ${
        isSelected 
          ? 'ring-4 ring-indigo-500 shadow-2xl scale-[1.02]' 
          : 'ring-1 ring-slate-200 hover:shadow-xl hover:-translate-y-1 bg-white'
      }`}
    >
      <div className="aspect-square w-full overflow-hidden bg-slate-100 relative">
        <img 
          src={candidate.image} 
          alt={candidate.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center backdrop-blur-[2px] transition-all">
            <div className="bg-white rounded-full p-3 shadow-lg transform scale-100 animate-in fade-in zoom-in duration-200">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      <div className={`p-4 text-center ${isSelected ? 'bg-indigo-50' : 'bg-white'}`}>
        <h3 className={`font-bold text-lg leading-tight ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>
          {candidate.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">Nominee</p>
      </div>
    </div>
  );
};

export default CandidateCard;
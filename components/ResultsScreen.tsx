import React, { useMemo } from 'react';
import { VoteRecord, Position } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsScreenProps {
  votes: VoteRecord[];
  positions?: Position[]; // Make optional to support legacy calls if any, but ideally required
  onBack?: () => void;
  embedded?: boolean;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ votes, positions = [], onBack, embedded = false }) => {
  const totalVotes = votes.length;

  // Calculate results
  const results = useMemo(() => {
    return positions.map(position => {
      const counts: Record<string, number> = {};
      
      // Initialize counts to 0 for all candidates
      position.candidates.forEach(c => counts[c.id] = 0);

      // Tally
      votes.forEach(record => {
        const candidateId = record.selections[position.id];
        if (candidateId) {
          counts[candidateId] = (counts[candidateId] || 0) + 1;
        }
      });

      // Format for Chart
      const chartData = position.candidates.map(c => ({
        name: c.name,
        votes: counts[c.id] || 0,
      })).sort((a, b) => b.votes - a.votes);

      return {
        ...position,
        chartData
      };
    });
  }, [votes, positions]);

  return (
    <div className={embedded ? "w-full" : "max-w-6xl mx-auto px-4 py-8"}>
      {!embedded && (
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Election Results</h2>
            <p className="text-slate-500">Total Votes Cast: <span className="font-bold text-indigo-600">{totalVotes}</span></p>
          </div>
          {onBack && (
            <button 
              onClick={onBack}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout Admin
            </button>
          )}
        </div>
      )}

      {embedded && (
         <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center justify-between">
           <span className="text-indigo-900 font-medium">Total Votes Cast</span>
           <span className="text-2xl font-bold text-indigo-600">{totalVotes}</span>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {results.map(position => (
          <div key={position.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">{position.title}</h3>
            
            <div className="h-64 w-full">
              {totalVotes === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No votes recorded yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={position.chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120} 
                      tick={{fontSize: 11}} 
                      interval={0}
                    />
                    <Tooltip cursor={{fill: '#f1f5f9'}} />
                    <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                      {position.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {position.chartData.slice(0, 3).map((c, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className={`${i === 0 ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                    {i + 1}. {c.name}
                  </span>
                  <span className="font-mono">{c.votes}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsScreen;
import React, { useState, useEffect } from 'react';
import { Voter } from '../types';

interface LoginScreenProps {
  onLogin: (voterId: string) => void;
  onAdminLogin: (password: string) => void;
  voterDatabase: Voter[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onAdminLogin, voterDatabase }) => {
  const [mode, setMode] = useState<'voter' | 'admin'>('voter');
  const [inputVal, setInputVal] = useState('');
  const [password, setPassword] = useState('');
  const [matchedVoter, setMatchedVoter] = useState<Voter | null>(null);

  // Auto-search for voter name
  useEffect(() => {
    if (mode === 'voter' && inputVal.trim().length > 0) {
      const found = voterDatabase.find(v => v.id.toLowerCase() === inputVal.trim().toLowerCase());
      setMatchedVoter(found || null);
    } else {
      setMatchedVoter(null);
    }
  }, [inputVal, mode, voterDatabase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'admin') {
      onAdminLogin(password);
    } else {
      if (inputVal.trim()) {
        onLogin(inputVal.trim());
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${mode === 'admin' ? 'bg-slate-800 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
            {mode === 'admin' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            {mode === 'admin' ? 'Admin Access' : 'Voter Authentication'}
          </h2>
          <p className="text-slate-500 mt-2">
            {mode === 'admin' ? 'Enter password to manage system.' : 'Enter your Roll Number to proceed.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'voter' ? (
            <div>
              <label htmlFor="voterId" className="block text-sm font-medium text-slate-700 mb-1">
                Roll Number / Voter ID
              </label>
              <input
                id="voterId"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. VOTER101"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase"
                autoFocus
              />
              
              {/* Name Display Animation */}
              <div className={`mt-3 overflow-hidden transition-all duration-300 ease-in-out ${matchedVoter ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-emerald-100 text-emerald-600 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Verified Student</p>
                    <p className="text-sm text-emerald-900 font-bold">{matchedVoter?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="adminPass" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="adminPass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
                autoFocus
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={mode === 'voter' && !matchedVoter}
            className={`w-full font-semibold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              mode === 'voter' 
                ? matchedVoter ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            {mode === 'admin' ? 'Login to Dashboard' : 'Proceed to Vote'}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          {mode === 'voter' ? (
            <button
              onClick={() => { setMode('admin'); setPassword(''); }}
              className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Access Admin Panel
            </button>
          ) : (
             <button
              onClick={() => { setMode('voter'); setInputVal(''); }}
              className="text-xs font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              ← Back to Voter Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
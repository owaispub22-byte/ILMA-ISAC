import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import VotingWizard from './components/VotingWizard';
import AdminDashboard from './components/AdminDashboard';
import { DEMO_VOTERS, ADMIN_PASSWORD, POSITIONS as DEFAULT_POSITIONS } from './constants';
import { VoteRecord, Voter, Position } from './types';

// Storage Keys
const STORAGE_KEY_VOTES = 'app_votes_data';
const STORAGE_KEY_USED_IDS = 'app_voted_ids';
const STORAGE_KEY_VALID_VOTERS = 'app_valid_voters_db';
const STORAGE_KEY_POSITIONS = 'app_positions_data';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'voting' | 'admin'>('login');
  
  // Current logged in user (Voter ID and Name)
  const [currentUser, setCurrentUser] = useState<Voter | null>(null);
  
  // Data State
  const [votes, setVotes] = useState<VoteRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOTES);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [usedIds, setUsedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USED_IDS);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [voterDatabase, setVoterDatabase] = useState<Voter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VALID_VOTERS);
      return saved ? JSON.parse(saved) : DEMO_VOTERS;
    } catch { return DEMO_VOTERS; }
  });

  // Positions Data (Candidates & Images)
  const [positions, setPositions] = useState<Position[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSITIONS);
      return saved ? JSON.parse(saved) : DEFAULT_POSITIONS;
    } catch { return DEFAULT_POSITIONS; }
  });

  const handleUpdateVoters = (newVoters: Voter[]) => {
    setVoterDatabase(newVoters);
    localStorage.setItem(STORAGE_KEY_VALID_VOTERS, JSON.stringify(newVoters));
  };

  const handleUpdateCandidateImage = (positionId: string, candidateId: string, imageUrl: string) => {
    const newPositions = positions.map(pos => {
      if (pos.id !== positionId) return pos;
      return {
        ...pos,
        candidates: pos.candidates.map(cand => {
          if (cand.id !== candidateId) return cand;
          return { ...cand, image: imageUrl };
        })
      };
    });
    setPositions(newPositions);
    localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(newPositions));
  };

  const handleResetSystem = () => {
    if (confirm('Are you sure you want to delete all votes and reset used IDs? This cannot be undone.')) {
      setVotes([]);
      setUsedIds([]);
      localStorage.removeItem(STORAGE_KEY_VOTES);
      localStorage.removeItem(STORAGE_KEY_USED_IDS);
    }
  };

  const handleAdminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setCurrentView('admin');
    } else {
      alert('Incorrect password');
    }
  };

  const handleVoterLogin = (voterId: string) => {
    // Check database
    const voter = voterDatabase.find(v => v.id.toLowerCase() === voterId.toLowerCase());

    if (!voter) {
      alert('Invalid Voter ID. Please contact the administrator.');
      return;
    }

    if (usedIds.includes(voter.id)) {
      alert('This Voter ID has already cast a vote.');
      return;
    }

    setCurrentUser(voter);
    setCurrentView('voting');
  };

  const handleVoteSubmit = (newVotes: Record<string, string>) => {
    if (!currentUser) return;

    // 1. Save the votes
    const newVoteRecord: VoteRecord = {
      voterId: currentUser.id,
      selections: newVotes,
      timestamp: Date.now(),
    };
    
    const updatedVotes = [...votes, newVoteRecord];
    setVotes(updatedVotes);
    localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(updatedVotes));

    // 2. Mark ID as used
    const updatedUsedIds = [...usedIds, currentUser.id];
    setUsedIds(updatedUsedIds);
    localStorage.setItem(STORAGE_KEY_USED_IDS, JSON.stringify(updatedUsedIds));

    // 3. Reset
    alert(`Thank you ${currentUser.name}! Your vote has been recorded.`);
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleLogout = () => {
    setCurrentView('login');
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white p-4 shadow-md z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
          <h1 className="text-xl font-bold tracking-tight">University Elections 2024</h1>
          {currentView !== 'login' && (
            <button 
              onClick={handleLogout}
              className="text-sm bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow bg-slate-50 relative">
        {currentView === 'login' && (
          <LoginScreen 
            onLogin={handleVoterLogin} 
            onAdminLogin={handleAdminLogin}
            voterDatabase={voterDatabase}
          />
        )}
        
        {currentView === 'voting' && currentUser && (
          <VotingWizard 
            voterId={currentUser.id}
            voterName={currentUser.name}
            positions={positions}
            onSubmit={handleVoteSubmit} 
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard 
            votes={votes} 
            voterDatabase={voterDatabase}
            positions={positions}
            onUpdateVoters={handleUpdateVoters}
            onUpdateCandidateImage={handleUpdateCandidateImage}
            onResetSystem={handleResetSystem}
            onLogout={handleLogout}
          />
        )}
      </main>

      <footer className="bg-slate-200 text-slate-500 text-center p-4 text-xs">
        <p>&copy; 2024 Election System. Secure & Anonymous.</p>
      </footer>
    </div>
  );
};

export default App;
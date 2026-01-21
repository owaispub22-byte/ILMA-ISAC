import React, { useState, useRef } from 'react';
import ResultsScreen from './ResultsScreen';
import { VoteRecord, Voter, Position } from '../types';
import * as XLSX from 'xlsx';

interface AdminDashboardProps {
  votes: VoteRecord[];
  voterDatabase: Voter[];
  positions: Position[];
  onUpdateVoters: (voters: Voter[]) => void;
  onUpdateCandidateImage: (positionId: string, candidateId: string, imageUrl: string) => void;
  onResetSystem: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  votes, 
  voterDatabase, 
  positions,
  onUpdateVoters, 
  onUpdateCandidateImage,
  onResetSystem,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'results' | 'voters' | 'images'>('voters');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of arrays
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        // Expect Column 0 = ID, Column 1 = Name
        const extractedVoters: Voter[] = [];
        data.forEach((row, index) => {
          // Skip potentially empty rows
          if (row[0]) {
             const id = String(row[0]).trim();
             const name = row[1] ? String(row[1]).trim() : `Voter ${id}`; // Default name if missing
             
             // Skip header if it exists
             if (index === 0 && (id.toLowerCase() === 'id' || id.toLowerCase() === 'voterid')) {
               return;
             }
             
             extractedVoters.push({ id, name });
          }
        });

        if (extractedVoters.length > 0) {
          onUpdateVoters(extractedVoters);
          setUploadStatus(`Successfully updated database with ${extractedVoters.length} voters.`);
        } else {
          setUploadStatus('Error: No valid data found in file.');
        }
      } catch (error) {
        console.error(error);
        setUploadStatus('Error parsing Excel file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImageUpload = (positionId: string, candidateId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) { // 800KB Limit
      alert("File is too large! Please upload an image smaller than 800KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (result) {
        onUpdateCandidateImage(positionId, candidateId, result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2>
           <p className="text-slate-500">Manage elections and view real-time results.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onResetSystem}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Reset Election Data
          </button>
          <button 
            onClick={onLogout}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('voters')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'voters' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Voter Database
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'images' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Manage Images
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'results' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Live Results
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
        {activeTab === 'voters' && (
          <div className="p-8">
            <div className="max-w-3xl">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Upload Voter List</h3>
              <p className="text-slate-600 mb-6">
                Upload an Excel file (.xlsx) with: <br/>
                <span className="font-mono bg-slate-100 px-1 rounded">Column A: ID</span>, 
                <span className="font-mono bg-slate-100 px-1 rounded ml-2">Column B: Name</span>.
              </p>

              <div className="mb-8 p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <label className="block">
                  <span className="sr-only">Choose file</span>
                  <input 
                    type="file" 
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100
                      cursor-pointer
                    "
                  />
                </label>
                <p className="text-xs text-slate-400 mt-2">Supported formats: .xlsx, .xls</p>
              </div>

              {uploadStatus && (
                <div className={`p-4 rounded-lg mb-6 ${uploadStatus.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {uploadStatus}
                </div>
              )}

              <div className="mt-8">
                <h4 className="font-semibold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Registered Voters</span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{voterDatabase.length} Total</span>
                </h4>
                <div className="bg-slate-50 rounded-lg border border-slate-200 h-80 overflow-y-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-500 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 font-medium">ID / Roll No</th>
                        <th className="px-4 py-2 font-medium">Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {voterDatabase.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="px-4 py-4 text-center text-slate-400 italic">No allowed IDs found.</td>
                        </tr>
                      ) : (
                        voterDatabase.map((voter) => (
                          <tr key={voter.id} className="hover:bg-slate-100">
                            <td className="px-4 py-2 font-mono text-slate-600">{voter.id}</td>
                            <td className="px-4 py-2 text-slate-800 font-medium">{voter.name}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Manage Candidate Images</h3>
            <p className="text-slate-600 mb-6 text-sm">
              Upload images for each candidate. Images are saved locally in your browser.
              <br/>
              <span className="text-amber-600 font-medium">Note: Use small images (under 500KB) to prevent storage issues.</span>
            </p>

            <div className="space-y-8">
              {positions.map(position => (
                <div key={position.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="font-bold text-lg text-indigo-900 mb-4 border-b border-slate-200 pb-2">{position.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {position.candidates.map(candidate => (
                      <div key={candidate.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                          <img 
                            src={candidate.image} 
                            alt={candidate.name} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{candidate.name}</p>
                            <p className="text-xs text-slate-400">ID: {candidate.id}</p>
                          </div>
                        </div>
                        <label className="block w-full">
                          <span className="sr-only">Upload Photo</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(position.id, candidate.id, e)}
                            className="block w-full text-xs text-slate-500
                              file:mr-2 file:py-1 file:px-2
                              file:rounded file:border-0
                              file:text-xs file:font-semibold
                              file:bg-indigo-50 file:text-indigo-700
                              hover:file:bg-indigo-100
                            "
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="p-4 md:p-8">
            <ResultsScreen votes={votes} positions={positions} embedded={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
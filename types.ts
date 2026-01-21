export interface Candidate {
  id: string;
  name: string;
  image: string; // URL or path
}

export interface Position {
  id: string;
  title: string;
  candidates: Candidate[];
}

export interface VoteRecord {
  voterId: string;
  selections: Record<string, string>; // PositionID -> CandidateID
  timestamp: number;
}

export interface Voter {
  id: string;
  name: string;
}

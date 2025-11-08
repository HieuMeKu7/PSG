// User types
export type UserName = "Hieu" | "Ha" | "Dai";

export interface User {
  id: UserName;
  displayName: string;
  role: string;
}

// Six Techniques
export interface Technique {
  id: string;
  englishName: string;
  vietnameseName: string;
}

export const TECHNIQUES: Technique[] = [
  { id: "T1", englishName: "Consecration via Performance", vietnameseName: "Thánh hiến qua trình diễn" },
  { id: "T2", englishName: "Desacralization by Recontextualization", vietnameseName: "Phi thiêng hóa qua tái bối cảnh hóa" },
  { id: "T3", englishName: "Commodification of Merit", vietnameseName: "Giao dịch hóa công đức" },
  { id: "T4", englishName: "Power as Spectacle", vietnameseName: "Quyền lực như trình diễn" },
  { id: "T5", englishName: "Relic–Filth Oscillation", vietnameseName: "Dao động thánh tích / rác rưởi" },
  { id: "T6", englishName: "Bureaucratization of Transcendence", vietnameseName: "Quan liêu hóa siêu việt" }
];

// Scene Record Status
export type RecordStatus = "Draft" | "In Review" | "Approved" | "Rejected";

// Sacred Sign Types
export type SacredSignType = "Symbol" | "Ritual" | "Role" | "Object";

// Main Scene Record Schema
export interface SceneRecord {
  id: string;
  episode_id: string;
  timestamp_start: string;
  timestamp_end?: string;
  image_path?: string;
  image_data?: string; // Base64 encoded image for local storage
  sacred_sign_type: SacredSignType;
  techniques: string[]; // Array of technique IDs (T1-T6)
  humor_devices: string[];
  narrative_function: string;
  frame_description: string;
  quoted_lines?: string;
  translation_notes?: string;
  visual_cues?: string;
  audio_cues?: string;
  recontext_note?: string;
  technique_reasoning?: string;
  confidence: number; // 0-100
  tags?: string[];
  status: RecordStatus;
  created_by: UserName;
  created_at: string;
  updated_by?: UserName;
  updated_at?: string;
}

// Episode data
export interface Episode {
  id: string;
  number: number;
  title: string;
}

// Episodes list (13 episodes for Panty & Stocking with Garterbelt)
export const EPISODES: Episode[] = [
  { id: "ep01", number: 1, title: "Episode 1: Excretion Without Honor and Humanity / Death Race 2010" },
  { id: "ep02", number: 2, title: "Episode 2: The Turmoil of the Beehive / Sex and the Daten City" },
  { id: "ep03", number: 3, title: "Episode 3: Catfight Club / Pulp Addiction" },
  { id: "ep04", number: 4, title: "Episode 4: Diet Syndrome / High School Nudical" },
  { id: "ep05", number: 5, title: "Episode 5: The Runny / Vomiting Point" },
  { id: "ep06", number: 6, title: "Episode 6: Les Diaboliques / Trans-homers" },
  { id: "ep07", number: 7, title: "Episode 7: If the Angels Wore Swimsuits / Ghost: The Phantom of Daten City" },
  { id: "ep08", number: 8, title: "Episode 8: ... Of the Dead / 1 Angry Ghost" },
  { id: "ep09", number: 9, title: "Episode 9: Once Upon a Time in Garterbelt / Panty + Brief" },
  { id: "ep10", number: 10, title: "Episode 10: Inner Brief / Chuck to the Future Part I" },
  { id: "ep11", number: 11, title: "Episode 11: Chuck to the Future Part II / Chuck to the Future Part III" },
  { id: "ep12", number: 12, title: "Episode 12: D.C. Confidential / D.C. Confidential (Continued)" },
  { id: "ep13", number: 13, title: "Episode 13: Bitch Girls / Bitch Girls: 2 Bitch" }
];

// View types
export type ViewType = "dashboard" | "quick-add" | "table" | "timeline" | "kanban" | "gallery";

// Export options
export interface ExportOptions {
  format: "excel" | "word" | "csv" | "json";
  filterBy?: {
    episode?: string;
    technique?: string;
    status?: RecordStatus;
    user?: UserName;
  };
  includeImages?: boolean;
}

// App State
export interface AppState {
  currentUser: UserName | null;
  currentView: ViewType;
  records: SceneRecord[];
  selectedRecord: SceneRecord | null;
  filters: {
    episode?: string;
    technique?: string;
    status?: RecordStatus;
    user?: UserName;
    searchTerm?: string;
  };
}

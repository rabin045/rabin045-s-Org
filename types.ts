export enum GradeLevel {
  Grade1 = "Grade 1",
  Grade2 = "Grade 2",
  Grade3 = "Grade 3",
  Grade4 = "Grade 4",
  Grade5 = "Grade 5",
  Grade6 = "Grade 6",
  Grade7 = "Grade 7",
  Grade8 = "Grade 8",
}

export enum AppView {
  Home = 'home',
  Explainer = 'explainer',
  Homework = 'homework',
  Planner = 'planner',
  Worksheet = 'worksheet',
  Tips = 'tips',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface WorksheetQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface WorksheetData {
  title: string;
  grade: string;
  topic: string;
  questions: WorksheetQuestion[];
}

export interface StudyPlanParams {
  grade: string;
  weakSubjects: string;
  goals: string;
  timeAvailable: string;
}
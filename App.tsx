import React, { useState } from 'react';
import Navigation from './components/Navigation';
import TopicExplainer from './components/TopicExplainer';
import HomeworkHelper from './components/HomeworkHelper';
import StudyPlanner from './components/StudyPlanner';
import WorksheetGenerator from './components/WorksheetGenerator';
import ParentTips from './components/ParentTips';
import { AppView } from './types';
import { Menu, Sparkles } from 'lucide-react';

// Hero/Dashboard Component internal to App for simplicity
const Dashboard: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-8 animate-in fade-in duration-500">
    <div className="space-y-4 max-w-2xl">
      <div className="inline-block p-3 rounded-full bg-indigo-50 mb-2">
        <Sparkles className="w-10 h-10 text-indigo-600" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
        How can I help your child’s studies today?
      </h1>
      <p className="text-xl text-slate-500">
        Your AI companion for Grades 1-8. Simplify homework, plan routines, and make learning fun.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-8">
      <button 
        onClick={() => setView(AppView.Explainer)}
        className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all text-left group"
      >
        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 mb-2">Explain a Topic</h3>
        <p className="text-slate-500 text-sm">Get simple, clear explanations for any subject.</p>
      </button>

      <button 
        onClick={() => setView(AppView.Homework)}
        className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-amber-300 transition-all text-left group"
      >
        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-600 mb-2">Homework Help</h3>
        <p className="text-slate-500 text-sm">Step-by-step guidance for tough questions.</p>
      </button>

      <button 
        onClick={() => setView(AppView.Worksheet)}
        className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-teal-300 transition-all text-left group"
      >
        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-teal-600 mb-2">Create Worksheet</h3>
        <p className="text-slate-500 text-sm">Generate practice quizzes instantly.</p>
      </button>

      <button 
        onClick={() => setView(AppView.Planner)}
        className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-purple-300 transition-all text-left group"
      >
        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-purple-600 mb-2">Make Study Plan</h3>
        <p className="text-slate-500 text-sm">Build a custom schedule that works.</p>
      </button>
    </div>
  </div>
);

function App() {
  const [currentView, setView] = useState<AppView>(AppView.Home);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Navigation 
        currentView={currentView} 
        setView={setView} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-slate-200">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-semibold text-slate-800">ParentSupport</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8 relative">
          {currentView === AppView.Home && <Dashboard setView={setView} />}
          {currentView === AppView.Explainer && <TopicExplainer />}
          {currentView === AppView.Homework && <HomeworkHelper />}
          {currentView === AppView.Planner && <StudyPlanner />}
          {currentView === AppView.Worksheet && <WorksheetGenerator />}
          {currentView === AppView.Tips && <ParentTips />}
        </div>
      </main>
    </div>
  );
}

export default App;
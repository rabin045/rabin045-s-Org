import React, { useState } from 'react';
import { GradeLevel } from '../types';
import { generateStudyPlan } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { Calendar, Loader2, Sparkles, Clock, Target, AlertCircle } from 'lucide-react';

const StudyPlanner: React.FC = () => {
  const [formData, setFormData] = useState({
    grade: GradeLevel.Grade5,
    weakSubjects: '',
    goals: '',
    timeAvailable: '1 hour per day'
  });
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setPlan('');

    try {
      let accumulated = '';
      await generateStudyPlan({
        grade: formData.grade,
        weakSubjects: formData.weakSubjects || 'None',
        goals: formData.goals || 'General improvement',
        timeAvailable: formData.timeAvailable
      }, (chunk) => {
        accumulated += chunk;
        setPlan(accumulated);
      });
    } catch (error) {
      console.error(error);
      setPlan('Failed to generate plan. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Input Form */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 text-indigo-600">
          <Calendar className="w-6 h-6" />
          <h2 className="text-lg font-bold">Plan Settings</h2>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value as GradeLevel})}
              className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2"
            >
              {Object.values(GradeLevel).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <span className="flex items-center gap-1"><AlertCircle size={14}/> Weak Subjects</span>
            </label>
            <input
              type="text"
              value={formData.weakSubjects}
              onChange={(e) => setFormData({...formData, weakSubjects: e.target.value})}
              placeholder="e.g. Math Fractions, Spelling"
              className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <span className="flex items-center gap-1"><Target size={14}/> Goals</span>
            </label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({...formData, goals: e.target.value})}
              placeholder="e.g. Prepare for final exams, Improve reading speed"
              rows={3}
              className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <span className="flex items-center gap-1"><Clock size={14}/> Time Available</span>
            </label>
            <input
              type="text"
              value={formData.timeAvailable}
              onChange={(e) => setFormData({...formData, timeAvailable: e.target.value})}
              placeholder="e.g. 45 mins on weekdays, 2 hours weekends"
              className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            Generate Plan
          </button>
        </form>
      </div>

      {/* Output Display */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Your Custom Study Plan</h3>
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          {!plan && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <Calendar size={48} className="opacity-20" />
              <p>Fill out the form to generate a personalized schedule.</p>
            </div>
          ) : (
            <div className="prose prose-indigo max-w-none">
              <ReactMarkdown>{plan}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
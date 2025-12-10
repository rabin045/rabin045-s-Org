import React, { useState } from 'react';
import { GradeLevel, WorksheetData } from '../types';
import { generateWorksheetJSON } from '../services/gemini';
import { CheckCircle, XCircle, RefreshCw, PenTool, CheckSquare, Loader2 } from 'lucide-react';

const WorksheetGenerator: React.FC = () => {
  const [grade, setGrade] = useState(GradeLevel.Grade3);
  const [subject, setSubject] = useState('Math');
  const [topic, setTopic] = useState('');
  const [worksheet, setWorksheet] = useState<WorksheetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setWorksheet(null);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const data = await generateWorksheetJSON(grade, subject, topic);
      setWorksheet(data);
    } catch (error) {
      alert("Failed to generate worksheet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (qIndex: number, optIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const calculateScore = () => {
    if (!worksheet) return 0;
    let correct = 0;
    worksheet.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) correct++;
    });
    return correct;
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-6">
      {/* Config Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <PenTool className="text-teal-600" /> Create Worksheet
        </h2>
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">GRADE</label>
            <select 
              value={grade}
              onChange={e => setGrade(e.target.value as GradeLevel)}
              className="w-full rounded-lg border-slate-200 text-sm"
            >
              {Object.values(GradeLevel).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">SUBJECT</label>
            <select 
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full rounded-lg border-slate-200 text-sm"
            >
              <option>Math</option>
              <option>Science</option>
              <option>English</option>
              <option>Social Science</option>
              <option>Computer</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">TOPIC</label>
            <input 
              type="text" 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Solar System"
              className="w-full rounded-lg border-slate-200 text-sm"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-teal-600 text-white rounded-lg py-2.5 px-4 font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckSquare size={18} />}
            Generate
          </button>
        </form>
      </div>

      {/* Worksheet Display */}
      {worksheet && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-teal-50">
            <div>
              <h3 className="text-xl font-bold text-teal-900">{worksheet.title}</h3>
              <p className="text-sm text-teal-700">{worksheet.grade} • {worksheet.topic}</p>
            </div>
            {showResults && (
              <div className="text-2xl font-bold text-teal-600">
                Score: {calculateScore()} / {worksheet.questions.length}
              </div>
            )}
          </div>

          <div className="overflow-y-auto p-6 space-y-8 flex-1">
            {worksheet.questions.map((q, qIdx) => {
              const userAns = selectedAnswers[qIdx];
              const isCorrect = userAns === q.correctAnswerIndex;
              
              return (
                <div key={qIdx} className="space-y-3">
                  <p className="font-medium text-lg text-slate-800">
                    <span className="font-bold text-slate-400 mr-2">{qIdx + 1}.</span>
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                    {q.options.map((opt, oIdx) => {
                      let btnClass = "border-slate-200 hover:bg-slate-50 text-slate-700";
                      
                      if (showResults) {
                        if (oIdx === q.correctAnswerIndex) {
                          btnClass = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                        } else if (userAns === oIdx) {
                          btnClass = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                        } else {
                          btnClass = "border-slate-100 text-slate-400 opacity-50";
                        }
                      } else if (userAns === oIdx) {
                        btnClass = "border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500";
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionSelect(qIdx, oIdx)}
                          disabled={showResults}
                          className={`text-left px-4 py-3 rounded-lg border transition-all ${btnClass}`}
                        >
                          <span className="font-semibold mr-2 text-xs uppercase tracking-wide opacity-60">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  
                  {showResults && (
                    <div className={`mt-2 ml-6 p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      <div className="flex items-start gap-2">
                        {isCorrect ? <CheckCircle size={16} className="mt-0.5" /> : <XCircle size={16} className="mt-0.5" />}
                        <div>
                          <p className="font-semibold">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                          <p className="opacity-90 mt-1">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            {!showResults ? (
              <button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(selectedAnswers).length < worksheet.questions.length}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Answers
              </button>
            ) : (
              <button
                onClick={() => {
                   setWorksheet(null);
                   setTopic('');
                   setShowResults(false);
                }}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-4 py-2"
              >
                <RefreshCw size={18} /> Create New
              </button>
            )}
          </div>
        </div>
      )}

      {!worksheet && !isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <CheckSquare size={48} className="mb-4 opacity-20" />
          <p>Enter a topic above to generate a quiz</p>
        </div>
      )}
    </div>
  );
};

export default WorksheetGenerator;
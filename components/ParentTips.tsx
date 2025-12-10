import React from 'react';
import { Heart, Clock, BookOpen, Brain, Coffee, Smartphone } from 'lucide-react';

const ParentTips: React.FC = () => {
  const tips = [
    {
      icon: Clock,
      title: "Establish a Routine",
      desc: "Children thrive on consistency. Set a fixed time for homework every day, ideally not right before bedtime when they are tired.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: BookOpen,
      title: "Reading Together",
      desc: "For younger kids (Grades 1-4), read aloud together. For older ones (5-8), discuss what they are reading. This builds vocabulary and empathy.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: Brain,
      title: "Growth Mindset",
      desc: "Praise effort, not just intelligence. Say 'You worked hard on this' instead of 'You are so smart'. This builds resilience.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: Smartphone,
      title: "Screen Time Balance",
      desc: "Use the '20-20-20' rule: Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.",
      color: "text-pink-600",
      bg: "bg-pink-50"
    },
    {
      icon: Coffee,
      title: "Breaks are Crucial",
      desc: "Short 5-10 minute breaks every 30-45 minutes improve focus. Encourage movement during breaks, not more screens.",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: Heart,
      title: "Stay Positive",
      desc: "Your attitude towards learning is contagious. If you are anxious about math, they will be too. Stay calm and curious.",
      color: "text-rose-600",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-indigo-600 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Parenting & Study Tips</h2>
          <p className="text-indigo-100 text-lg">
            Supporting your child isn't just about homework answers. It's about building habits for life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${tip.bg} ${tip.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{tip.title}</h3>
                <p className="text-slate-600 leading-relaxed">{tip.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mt-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Daily Check-in Questions</h3>
          <p className="text-slate-600 mb-6">Ask these instead of "How was school?" to get better conversations started:</p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm">1</span>
              <span className="text-slate-700">What was the most interesting thing you heard today?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm">2</span>
              <span className="text-slate-700">Did you ask any good questions in class?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm">3</span>
              <span className="text-slate-700">What was challenging today, and how did you handle it?</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParentTips;
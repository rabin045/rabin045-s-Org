import React from 'react';
import { AppView } from '../types';
import { 
  BookOpen, 
  BrainCircuit, 
  Calendar, 
  CheckSquare, 
  HeartHandshake, 
  LayoutDashboard 
} from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  
  const navItems = [
    { id: AppView.Home, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.Explainer, label: 'Topic Explainer', icon: BookOpen },
    { id: AppView.Homework, label: 'Homework Helper', icon: BrainCircuit },
    { id: AppView.Planner, label: 'Study Planner', icon: Calendar },
    { id: AppView.Worksheet, label: 'Worksheets', icon: CheckSquare },
    { id: AppView.Tips, label: 'Parent Tips', icon: HeartHandshake },
  ];

  const handleNavClick = (view: AppView) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen
      `}>
        <div className="flex items-center justify-center h-16 border-b border-slate-100">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <span className="text-2xl">🎓</span> ParentSupport
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-slate-50">
          <div className="text-xs text-slate-500 text-center">
            Powered by Gemini 2.5
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
import { BookOpen, Compass, FileText, MessageSquare, Moon } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab, setReadingDoc }) {
  return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0c]/95 border-t border-[#22201d] flex justify-around py-3">
        {[
          { id: 'home', label: 'INDEX', icon: Moon },
          { id: 'archive', label: 'ARCHIVES', icon: BookOpen },
          { id: 'forum', label: 'FORUM', icon: MessageSquare },
          { id: 'journal', label: 'JOURNAL', icon: FileText },
          { id: 'about', label: 'ABOUT', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setReadingDoc(null); }}
              className={`flex flex-col items-center space-y-1 text-[9px] font-mono tracking-widest ${
                isActive ? 'text-[#c5a880]' : 'text-[#837f75]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
  );
}


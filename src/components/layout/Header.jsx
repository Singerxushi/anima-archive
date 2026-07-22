import { Compass, Github, Settings } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, setReadingDoc, githubConfig }) {
  return (
      <header className="border-b border-[#22201d] sticky top-0 bg-[#0d0d0c]/95 backdrop-blur-sm z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => { setActiveTab('home'); setReadingDoc(null); }}>
            <div className="w-9 h-9 border border-[#c5a880]/60 flex items-center justify-center rotate-45 group-hover:border-[#c5a880] transition-colors">
              <Compass className="w-4 h-4 text-[#c5a880] -rotate-45" />
            </div>
            <div>
              <h1 className="text-md font-semibold tracking-[0.25em] text-[#f4f1eb]">
                ANIMA ARCHIVE
              </h1>
              <p className="text-[9px] font-mono tracking-widest text-[#938e83] uppercase">
                Occultism & Analytical Psychology
              </p>
            </div>
          </div>

          {/* 选项菜单 */}
          <nav className="hidden md:flex items-center space-x-1 text-xs tracking-widest">
            {[
              { id: 'home', label: 'INDEX' },
              { id: 'archive', label: 'ARCHIVES' },
              { id: 'forum', label: 'DISCUSSIONS' },
              { id: 'journal', label: 'JOURNAL' },
              { id: 'about', label: 'ABOUT' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setReadingDoc(null); }}
                className={`px-4 py-2 hover:text-[#c5a880] transition-colors font-mono relative ${
                  activeTab === tab.id ? 'text-[#c5a880] font-bold' : 'text-[#a29d93]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-[#c5a880]" />
                )}
              </button>
            ))}
          </nav>

          {/* 右侧工具 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => { setActiveTab('settings'); setReadingDoc(null); }}
              className={`p-2 border transition-all ${
                activeTab === 'settings' 
                  ? 'border-[#c5a880] text-[#c5a880] bg-[#171614]' 
                  : 'border-[#22201d] text-[#a29d93] hover:text-[#f4f1eb] hover:border-[#423f39]'
              }`}
              title="GitHub Integration Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <a 
              href={`https://github.com/${githubConfig.owner || 'Aethelgard'}/${githubConfig.repo || 'anima-archive'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 text-[10px] font-mono text-[#a29d93] hover:text-[#c5a880] border border-[#22201d] px-3 py-1.5 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>REPOS</span>
            </a>
          </div>

        </div>
      </header>
  );
}


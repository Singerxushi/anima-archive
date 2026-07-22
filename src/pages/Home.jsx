import { ArrowRight } from 'lucide-react';

export default function Home({ archiveList, setActiveTab, setReadingDoc }) {
  return (
          <div className="space-y-16">
            
            {/* 顶层古典主义微缩星图与大标题 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-[#22201d] pb-12 items-center">
              
              <div className="lg:col-span-8 space-y-6">
                <div className="font-mono text-xs text-[#c5a880] uppercase tracking-[0.25em] flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-[#c5a880] inline-block" />
                  <span>Subconscious Investigation Project</span>
                </div>
                
                <h2 className="text-3xl sm:text-5xl font-serif text-[#f4f1eb] font-normal leading-[1.2] tracking-tight">
                  你没有觉察到的潜意识，<br />
                  <span className="italic text-[#c5a880] font-light">将成为你的命运。</span>
                </h2>
                
                <p className="text-[#a29d93] text-sm leading-relaxed max-w-2xl font-sans">
                  欢迎来到 <strong>Anima Archive</strong>。这是一处致力于在分析心理学与历史秘契主义之间构筑理智桥梁的在线知识库。我们通过整理荣格心理学、古典炼金术、诺斯替教派符号及梦境映射文献，以实现心灵维度的自性化记录。本系统架构于 GitHub 基础之上，将学术出版与去中心化协同开发深度融合。
                </p>

                <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono">
                  <button 
                    onClick={() => setActiveTab('archive')}
                    className="border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] px-5 py-3 transition-all tracking-widest uppercase"
                  >
                    ENTER ARCHIVES / 浏览馆藏
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="border border-[#22201d] hover:border-[#c5a880] text-[#a29d93] hover:text-[#e8e4dc] px-5 py-3 transition-all tracking-widest uppercase"
                  >
                    INTEGRATION / 绑定 GitHub 仓库
                  </button>
                </div>
              </div>

              {/* 炼金术微缩日月同辉 SVG (Un-canon 精髓) */}
              <div className="lg:col-span-4 flex justify-center py-6">
                <svg className="w-48 h-48 text-[#c5a880]/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="30" />
                  <path d="M50 10 L50 90 M10 50 L90 50" strokeDasharray="2 2" />
                  <circle cx="50" cy="50" r="4" fill="currentColor" />
                  <path d="M35 35 Q50 40 65 35 Q60 50 65 65 Q50 60 35 65 Q40 50 35 35 Z" strokeWidth="0.5" />
                  {/* 装饰星 */}
                  <polygon points="50,22 52,28 58,28 53,32 55,38 50,34 45,38 47,32 42,28 48,28" fill="currentColor" opacity="0.6"/>
                  <text x="50" y="8" textAnchor="middle" className="font-mono text-[5px] fill-[#c5a880] uppercase tracking-widest">Macrocosm</text>
                  <text x="50" y="96" textAnchor="middle" className="font-mono text-[5px] fill-[#c5a880] uppercase tracking-widest">Microcosm</text>
                </svg>
              </div>

            </div>

            {/* 极简网格目录 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#22201d] divide-y md:divide-y-0 md:divide-x divide-[#22201d] font-sans">
              
              <div className="p-8 hover:bg-[#121211] transition-all group flex flex-col justify-between h-64">
                <div>
                  <div className="font-mono text-xs text-[#c5a880] mb-4">01 / REPOSITORY</div>
                  <h3 className="text-lg font-serif text-[#f4f1eb] font-semibold group-hover:text-[#c5a880] transition-colors">原初档案</h3>
                  <p className="text-[#a29d93] text-xs mt-3 leading-relaxed">
                    收录关于梦、暗影整合及仪式意象的文献及临床解析档案。支持通过 Git 内容管理一键发布。
                  </p>
                </div>
                <button onClick={() => setActiveTab('archive')} className="text-xs font-mono text-[#c5a880] flex items-center space-x-1 mt-4">
                  <span>INDEX ARCHIVES</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="p-8 hover:bg-[#121211] transition-all group flex flex-col justify-between h-64">
                <div>
                  <div className="font-mono text-xs text-[#c5a880] mb-4">02 / SYMPOSIUM</div>
                  <h3 className="text-lg font-serif text-[#f4f1eb] font-semibold group-hover:text-[#c5a880] transition-colors">集会论坛</h3>
                  <p className="text-[#a29d93] text-xs mt-3 leading-relaxed">
                    基于 GitHub Discussions 机制运行。在此写下您对炼金术意象和共时性现象的心灵共振记录。
                  </p>
                </div>
                <button onClick={() => setActiveTab('forum')} className="text-xs font-mono text-[#c5a880] flex items-center space-x-1 mt-4">
                  <span>DISCUSS PORTAL</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="p-8 hover:bg-[#121211] transition-all group flex flex-col justify-between h-64">
                <div>
                  <div className="font-mono text-xs text-[#c5a880] mb-4">03 / QUARTERLY</div>
                  <h3 className="text-lg font-serif text-[#f4f1eb] font-semibold group-hover:text-[#c5a880] transition-colors">《ANIMA》学报</h3>
                  <p className="text-[#a29d93] text-xs mt-3 leading-relaxed">
                    定期精选深度研究期刊，基于 GitHub Issues 发起分布式学术审阅与论文投稿。
                  </p>
                </div>
                <button onClick={() => setActiveTab('journal')} className="text-xs font-mono text-[#c5a880] flex items-center space-x-1 mt-4">
                  <span>VIEW VOLUMES</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* 精选近刊目录 */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#22201d] pb-3">
                <span className="font-mono text-xs tracking-widest text-[#a29d93] uppercase">RECENT ARCHIVES / 近期收录</span>
                <button onClick={() => setActiveTab('archive')} className="font-mono text-[11px] text-[#c5a880] hover:underline">
                  [ ALL ENTRIES ]
                </button>
              </div>
              <div className="divide-y divide-[#22201d]">
                {archiveList.slice(0, 3).map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => { setReadingDoc(item); setActiveTab('archive'); }}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer hover:bg-[#121211]/50 px-2 transition-all"
                  >
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-[#c5a880] uppercase tracking-wider">{item.category}</span>
                      <h4 className="text-md font-serif text-[#f4f1eb] font-medium group-hover:text-[#c5a880] transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-6 text-[11px] font-mono text-[#837f75] mt-2 sm:mt-0">
                      <span>BY {item.author.toUpperCase()}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
  );
}


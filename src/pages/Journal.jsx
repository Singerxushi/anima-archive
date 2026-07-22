import { Book, ExternalLink, Github } from 'lucide-react';
import { JOURNAL_ISSUES } from '../data/initialData';

export default function Journal({
  newPaper,
  setNewPaper,
  handleSubmitPaper,
}) {
  return (
          <div className="space-y-8">
            
            {/* 复古学术本大题头 */}
            <div className="border border-[#22201d] p-8 space-y-4 bg-gradient-to-br from-[#0d0d0c] to-[#121110]">
              <span className="font-mono text-[10px] border border-[#c5a880]/30 text-[#c5a880] px-3 py-1 uppercase tracking-[0.2em]">
                ANIMA EDITORIAL BOARD
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#f4f1eb]">
                《ANIMA》 深度心理学与先锋秘契主义学报
              </h2>
              <p className="text-xs text-[#a29d93] max-w-3xl leading-relaxed">
                本学报采用全流程开源审阅。通过 <strong>GitHub Issues</strong> 来收集论文并公开讨论同行评议（Peer-Review）。我们诚邀广大心理分析师、神话学学者和思想史探险家，在此共同发掘被理性遗忘的深海暗礁。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* 学术目录架 */}
              <div className="lg:col-span-8 space-y-6">
                <h3 className="font-mono text-xs tracking-widest text-[#a29d93] uppercase border-b border-[#22201d] pb-2">
                  PUBLISHED ISSUES / 已刊行列表
                </h3>

                {JOURNAL_ISSUES.map((issue) => (
                  <div key={issue.id} className="border border-[#22201d] p-6 space-y-5 bg-[#0f0f0e]">
                    
                    <div className="flex items-center justify-between border-b border-[#22201d]/60 pb-3">
                      <span className="font-mono text-xs font-bold text-[#c5a880] tracking-wider">
                        {issue.volume}
                      </span>
                      <span className={`font-mono text-[10px] px-2.5 py-0.5 border ${
                        issue.status.includes('已出版') 
                          ? 'border-emerald-500/20 text-emerald-400 bg-emerald-950/20' 
                          : 'border-amber-500/20 text-amber-400 bg-amber-950/20 animate-pulse'
                      }`}>
                        {issue.status}
                      </span>
                    </div>

                    <h4 className="text-lg font-serif text-[#f4f1eb] font-semibold">
                      {issue.title}
                    </h4>

                    <div className="space-y-2">
                      <p className="font-mono text-[10px] text-[#837f75] uppercase">PAPERS INDEXED / 收录篇目：</p>
                      {issue.papers.map((paper, pIdx) => (
                        <div key={pIdx} className="flex items-start justify-between bg-[#0d0d0c] p-4 border border-[#22201d]/50 hover:border-[#c5a880]/30 transition-all">
                          <div className="space-y-1">
                            <p className="text-xs text-[#e8e4dc] font-sans font-medium">{paper.title}</p>
                            <p className="font-mono text-[10px] text-[#837f75]">CONTRIBUTOR: {paper.author}</p>
                          </div>
                          <Book className="w-4 h-4 text-[#837f75] cursor-pointer hover:text-[#c5a880] transition-colors" />
                        </div>
                      ))}
                    </div>

                    <div className="font-mono text-[10px] text-[#837f75] flex justify-between">
                      <span>RELEASE DATE: {issue.date}</span>
                    </div>

                  </div>
                ))}
              </div>

              {/* 右侧：基于 Issue 的去中心化投稿表单 */}
              <div className="lg:col-span-4 space-y-4">
                <div className="border border-[#c5a880]/30 p-6 bg-[#0f0f0e] space-y-4 shadow-lg shadow-[#c5a880]/5">
                  <div className="border-b border-[#22201d] pb-3">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-[#c5a880] uppercase flex items-center space-x-2">
                      <Github className="w-4 h-4 text-[#c5a880]" />
                      <span>SUBMISSION BY ISSUE / 学术投稿</span>
                    </h3>
                  </div>
                  
                  <p className="text-[11px] text-[#a29d93] leading-relaxed">
                    本学报实行分布式、透明化审阅机制。点击下表递交将直接在您的 GitHub 仓库下生成专用的 <strong>Issue</strong> 模板，以便审稿组快速立项。
                  </p>

                  <form onSubmit={handleSubmitPaper} className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-[#a29d93] mb-1">论文题目 (TITLE)</label>
                      <input
                        type="text"
                        required
                        placeholder="输入论文学术名称"
                        value={newPaper.title}
                        onChange={(e) => setNewPaper({...newPaper, title: e.target.value})}
                        className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-[#a29d93] mb-1">作者姓名/学者笔名</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. C.G. Jung"
                          value={newPaper.author}
                          onChange={(e) => setNewPaper({...newPaper, author: e.target.value})}
                          className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#a29d93] mb-1">联络信箱 / EMAIL</label>
                        <input
                          type="email"
                          required
                          placeholder="editor@subconscious.org"
                          value={newPaper.email}
                          onChange={(e) => setNewPaper({...newPaper, email: e.target.value})}
                          className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#a29d93] mb-1">摘要及大纲 (ABSTRACT & OUTLINE)</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="1. 心灵研究命题核心
2. 所属案例分析或文献印证
3. 主体大纲骨架"
                        value={newPaper.abstract}
                        onChange={(e) => setNewPaper({...newPaper, abstract: e.target.value})}
                        className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] p-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#c5a880] text-[#0d0d0c] hover:bg-[#b0936f] py-2.5 transition-all font-semibold tracking-widest uppercase flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>SUBMIT VIA GITHUB ISSUE</span>
                    </button>
                  </form>
                </div>
              </div>

            </div>

          </div>
  );
}


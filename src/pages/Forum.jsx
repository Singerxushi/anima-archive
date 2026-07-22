import { Github, Heart, MessageSquare, Send, Sparkles } from 'lucide-react';

export default function Forum({
  discussions,
  newDiscussion,
  setNewDiscussion,
  newReply,
  setNewReply,
  handleCreateDiscussion,
  handleAddReply,
  handleLike,
  getDiscussionsUrl,
}) {
  return (
          <div className="space-y-8">
            
            {/* 顶层导流板块 */}
            <div className="border border-[#22201d] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#0f0f0e]">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-serif text-[#f4f1eb]">心灵共振集会广场</h2>
                  <span className="text-[9px] font-mono bg-[#1c1a17] border border-[#c5a880]/20 text-[#c5a880] px-2 py-0.5 uppercase tracking-widest">
                    Discussions Forum
                  </span>
                </div>
                <p className="text-xs text-[#a29d93] leading-relaxed max-w-xl">
                  此板块与您的 <strong>GitHub Discussions</strong> 协同，为未分类的心灵经验、共时性体验和直觉闪现提供交流港湾。您亦可以直接前往远程讨论广场。
                </p>
              </div>

              <a
                href={getDiscussionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] text-xs font-mono tracking-widest px-5 py-3 transition-all flex items-center space-x-1.5"
              >
                <Github className="w-4 h-4" />
                <span>OPEN DISCUSSIONS</span>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* 帖子目录 */}
              <div className="lg:col-span-8 space-y-6">
                
                {discussions.map((disc) => (
                  <div key={disc.id} className="border border-[#22201d] p-6 space-y-4 bg-[#0a0a09]">
                    
                    {/* 发帖人信息 */}
                    <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#22201d]/60 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
                        <span className="font-semibold text-[#e8e4dc]">{disc.author}</span>
                        <span className="text-[#837f75]">•</span>
                        <span className="text-[#c5a880] tracking-wider uppercase">{disc.category}</span>
                      </div>
                      <span className="text-[#837f75]">{disc.date}</span>
                    </div>

                    {/* 帖子正文 */}
                    <h4 className="text-md font-serif text-[#f4f1eb] leading-snug">
                      {disc.title}
                    </h4>

                    {/* 回复与交互栏 */}
                    <div className="flex items-center space-x-6 text-[11px] font-mono pt-2">
                      <button 
                        onClick={() => handleLike(disc.id)}
                        className="flex items-center space-x-1.5 text-[#a29d93] hover:text-[#c5a880] transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>{disc.likes} 共识</span>
                      </button>
                      <span className="text-[#837f75]">
                        {disc.replies.length} 个洞见回复
                      </span>
                    </div>

                    {/* 细线回复箱 */}
                    <div className="space-y-3 bg-[#0d0d0c] p-4 border-l-2 border-[#22201d] font-sans">
                      {disc.replies.map((rep, rIdx) => (
                        <div key={rIdx} className="text-xs space-y-1 pb-3 last:pb-0 border-b border-[#22201d]/30 last:border-none">
                          <div className="flex justify-between text-[10px] font-mono text-[#837f75]">
                            <span className="text-[#c5a880]">{rep.author}</span>
                            <span>{rep.date}</span>
                          </div>
                          <p className="text-[#a29d93] leading-relaxed">{rep.content}</p>
                        </div>
                      ))}

                      {/* 极简回复录入 */}
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="text"
                          placeholder="写下你的心灵直觉或洞见..."
                          value={newReply[disc.id] || ''}
                          onChange={(e) => setNewReply({ ...newReply, [disc.id]: e.target.value })}
                          className="flex-grow bg-[#0a0a09] border border-[#22201d] text-[#e8e4dc] px-3 py-2 text-xs focus:outline-none focus:border-[#c5a880] font-mono rounded-none"
                        />
                        <button
                          onClick={() => handleAddReply(disc.id)}
                          className="border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] px-4 py-2 text-xs font-mono tracking-widest transition-all"
                        >
                          RESPOND
                        </button>
                      </div>
                    </div>

                  </div>
                ))}

              </div>

              {/* 右侧：起草新议题 */}
              <div className="lg:col-span-4 space-y-4">
                <div className="border border-[#22201d] p-6 bg-[#0f0f0e] space-y-4">
                  <div className="border-b border-[#22201d] pb-3">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-[#c5a880] uppercase flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>NEW COGNITION / 新建议题</span>
                    </h3>
                  </div>
                  
                  <form onSubmit={handleCreateDiscussion} className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-[#a29d93] mb-1">探讨核心命题 / SUBJECT</label>
                      <input
                        type="text"
                        required
                        placeholder="简短明确的共识主题"
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                        className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#a29d93] mb-1">探讨分类域 / FIELD</label>
                      <select
                        value={newDiscussion.category}
                        onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
                        className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-2 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
                      >
                        <option value="梦境探讨 / ONEIROMANCY">梦境探讨 / ONEIROMANCY</option>
                        <option value="哲学哲学 / PHILOSOPHY">哲学哲学 / PHILOSOPHY</option>
                        <option value="心灵共时性 / SYNCHRONICITY">心灵共时性 / SYNCHRONICITY</option>
                        <option value="实践分享 / PRAXIS">实践分享 / PRAXIS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#a29d93] mb-1">思想描述与缘起 / REASONING</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="在此详细叙述您感知到的共时体验或心理观察..."
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                        className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] p-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-transparent border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] py-2.5 transition-all font-semibold tracking-widest uppercase"
                    >
                      INITIATE MEETING / 开启集会讨论
                    </button>
                  </form>
                </div>
              </div>

            </div>

          </div>
  );
}


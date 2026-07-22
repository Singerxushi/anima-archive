import { Maximize2, Plus, Search } from 'lucide-react';

export default function Archives({
  archiveList,
  archiveFilter,
  setArchiveFilter,
  searchTerm,
  setSearchTerm,
  readingDoc,
  setReadingDoc,
  newArchive,
  setNewArchive,
  handlePublishArchive,
  githubConfig,
}) {
  return (
          <div className="space-y-8">
            
            {/* 顶栏信息与检索 */}
            <div className="border border-[#22201d] p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-lg font-serif text-[#f4f1eb]">馆藏档案检索</h3>
                <p className="text-xs text-[#a29d93] font-mono">RETRIEVING SUBSTANTIAL ARCHIVES</p>
              </div>

              {/* 搜索 */}
              <div className="md:col-span-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#837f75]" />
                <input
                  type="text"
                  placeholder="输入原型、象徽、关键词..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#121211] border border-[#22201d] text-[#e8e4dc] pl-9 pr-4 py-2.5 rounded-none text-xs focus:outline-none focus:border-[#c5a880] transition-all font-mono"
                />
              </div>

              {/* 分类过滤 */}
              <div className="md:col-span-4 flex flex-wrap gap-2 justify-start md:justify-end">
                {['全部', '原型理论 / ARCHETYPES', '炼金术隐喻 / ALCHEMY', '符号与象征 / SYMBOLS', '梦境解析 / ONEIRO'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setArchiveFilter(category)}
                    className={`px-3 py-1 border text-[10px] font-mono tracking-wider transition-all ${
                      archiveFilter === category
                        ? 'border-[#c5a880] text-[#c5a880] bg-[#1a1917]'
                        : 'border-[#22201d] text-[#837f75] hover:text-[#e8e4dc] hover:border-[#423f39]'
                    }`}
                  >
                    {category.split(' / ')[0]}
                  </button>
                ))}
              </div>

            </div>

            {/* 档案核心视图：左：列表及深阅读，右：新建归档 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* 档案列表及阅读区 */}
              <div className="lg:col-span-8 space-y-6">
                
                {readingDoc ? (
                  /* 深度沉浸式经典文献阅读视图 */
                  <div className="border border-[#22201d] p-8 space-y-6 bg-[#0f0f0e] relative">
                    <button 
                      onClick={() => setReadingDoc(null)} 
                      className="absolute top-6 right-6 font-mono text-[10px] text-[#837f75] hover:text-[#c5a880] border border-[#22201d] px-2.5 py-1"
                    >
                      [ BACK TO INDEX ]
                    </button>

                    <div className="space-y-2 pb-6 border-b border-[#22201d]">
                      <span className="font-mono text-xs text-[#c5a880] tracking-widest uppercase">{readingDoc.category}</span>
                      <h2 className="text-2xl sm:text-3xl font-serif text-[#f4f1eb] font-normal tracking-tight">
                        {readingDoc.title}
                      </h2>
                      <p className="font-mono text-[10px] tracking-wider text-[#837f75]">{readingDoc.subtitle}</p>
                    </div>

                    <div className="flex items-center space-x-6 text-[11px] font-mono text-[#837f75] bg-[#0d0d0c] p-3 border border-[#22201d]/40">
                      <span>ARCHIVE REFN: {readingDoc.id.toUpperCase()}</span>
                      <span>RECORDED BY: {readingDoc.author.toUpperCase()}</span>
                      <span>DATE: {readingDoc.date}</span>
                    </div>

                    <div className="text-sm text-[#e8e4dc] leading-relaxed space-y-6 font-serif whitespace-pre-line">
                      {readingDoc.content}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-6 border-t border-[#22201d]">
                      {readingDoc.tags.map((tag, idx) => (
                        <span key={idx} className="font-mono text-[10px] text-[#a29d93] bg-[#121211] border border-[#22201d] px-2.5 py-1">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* 档案列表显示 */
                  <div className="space-y-4">
                    {archiveList
                      .filter(item => {
                        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                              item.summary.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesCat = archiveFilter === '全部' || item.category === archiveFilter;
                        return matchesSearch && matchesCat;
                      })
                      .map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => setReadingDoc(item)}
                          className="border border-[#22201d] hover:border-[#c5a880]/50 p-6 space-y-4 hover:bg-[#121211]/30 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-[#c5a880] tracking-wider uppercase">{item.category}</span>
                            <span className="text-[#837f75]">{item.date}</span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-lg font-serif text-[#f4f1eb] font-medium group-hover:text-[#c5a880] transition-colors flex items-center justify-between">
                              <span>{item.title}</span>
                              <Maximize2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#837f75]" />
                            </h4>
                            <p className="font-mono text-[9px] tracking-widest text-[#837f75]">{item.subtitle}</p>
                          </div>

                          <p className="text-xs text-[#a29d93] leading-relaxed font-sans line-clamp-3">
                            {item.summary}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {item.tags.map((tag, idx) => (
                              <span key={idx} className="font-mono text-[9px] text-[#837f75] border border-[#22201d] px-2 py-0.5">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}

                    {archiveList.filter(item => {
                      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                            item.summary.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesCat = archiveFilter === '全部' || item.category === archiveFilter;
                      return matchesSearch && matchesCat;
                    }).length === 0 && (
                      <div className="text-center py-12 border border-dashed border-[#22201d] text-[#837f75] font-mono text-xs">
                        [ ERROR: NO RESONANCE RECORD FOUND IN THIS FOLDER ]
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 右侧：新建档案推送 */}
              <div className="lg:col-span-4 space-y-4">
                <div className="border border-[#22201d] p-6 bg-[#0f0f0e] space-y-4">
                  <div className="border-b border-[#22201d] pb-3">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-[#c5a880] uppercase flex items-center space-x-2">
                      <Plus className="w-3.5 h-3.5" />
                      <span>ARCHIVE PUSH / 档案提报</span>
                    </h3>
                  </div>

                  <form onSubmit={handlePublishArchive} className="space-y-4 font-mono text-xs">
                    
                    <div>
                      <label className="block text-[#a29d93] mb-1">文章标题 / TITLE</label>
                      <input
                        type="text"
                        required
                        placeholder="主意象标题"
                        value={newArchive.title}
                        onChange={(e) => setNewArchive({...newArchive, title: e.target.value})}
                        className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#a29d93] mb-1">英文副标题 / SUBTITLE</label>
                      <input
                        type="text"
                        placeholder="LATIN OR ENGLISH SUBTITLE"
                        value={newArchive.subtitle}
                        onChange={(e) => setNewArchive({...newArchive, subtitle: e.target.value})}
                        className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880] uppercase placeholder:lowercase"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[#a29d93] mb-1">分类域 / CATEGORY</label>
                        <select
                          value={newArchive.category}
                          onChange={(e) => setNewArchive({...newArchive, category: e.target.value})}
                          className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-2 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
                        >
                          <option value="原型理论 / ARCHETYPES">原型理论 / ARCHETYPES</option>
                          <option value="炼金术隐喻 / ALCHEMY">炼金术隐喻 / ALCHEMY</option>
                          <option value="符号与象征 / SYMBOLS">符号与象征 / SYMBOLS</option>
                          <option value="梦境解析 / ONEIRO">梦境解析 / ONEIRO</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#a29d93] mb-1">标签 / TAGS (半角逗号分隔)</label>
                        <input
                          type="text"
                          placeholder="自性化, 荣格, 赫耳墨斯"
                          value={newArchive.tags}
                          onChange={(e) => setNewArchive({...newArchive, tags: e.target.value})}
                          className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#a29d93] mb-1">摘要提要 / SUMMARY</label>
                      <textarea
                        rows={2}
                        placeholder="精炼阐述主旨大意..."
                        value={newArchive.summary}
                        onChange={(e) => setNewArchive({...newArchive, summary: e.target.value})}
                        className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] p-2.5 rounded-none focus:outline-none focus:border-[#c5a880] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#a29d93] mb-1">详实论述内容 / CONTENT (MARKDOWN SUPPORT)</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="在此展开文献核心论据内容..."
                        value={newArchive.content}
                        onChange={(e) => setNewArchive({...newArchive, content: e.target.value})}
                        className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] p-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-transparent border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] py-2.5 transition-all font-semibold tracking-widest uppercase"
                    >
                      {githubConfig.token ? 'SYNC TO GITHUB REPO' : 'PUBLISH TO LOCAL SANDBOX'}
                    </button>

                  </form>
                  
                  {!githubConfig.token && (
                    <p className="text-[10px] text-[#837f75] mt-3 leading-relaxed text-center">
                      ℹ️ 当前保存于浏览器本地数据库中。若要实现协同展示，请去设置项绑定远程 GitHub 账户及专属 Token。
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>
  );
}


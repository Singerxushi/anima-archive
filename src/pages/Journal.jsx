/**
 * 修改原因：
 * 1. 明确投稿是打开 GitHub 预填 Issue 页面，而不是在本站直接创建后台记录。
 * 2. 与新的管理员面板语义保持一致：公开入口走 Issues，管理员写仓库另算。
 *
 * 兼容性注意：
 * - props 与现有 App.jsx 保持兼容。
 */

import { Book, ExternalLink } from 'lucide-react';
import { JOURNAL_ISSUES } from '../data/initialData';

export default function Journal({
  newPaper,
  setNewPaper,
  handleSubmitPaper,
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr,0.95fr] gap-8">
        <section className="space-y-6">
          <div className="border border-[#22201d] bg-[#11110f] p-6 sm:p-8 space-y-4">
            <div className="text-xs tracking-[0.35em] uppercase text-[#c5a880] font-mono">
              Anima Editorial Board
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-[#f4f1eb]">
              《ANIMA》深度心理学与先锋秘契主义学报
            </h2>

            <p className="text-sm leading-7 text-[#b8b1a4]">
              本学报采用公开、可追踪的 GitHub Issues 工作流来接收论文投稿与初步评议。
              点击下文表单提交后，页面会打开 GitHub 中已预填标题、摘要和标签的新 Issue 页面。
            </p>
          </div>

          <div className="border border-[#22201d] bg-[#10100f] p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3 text-[#c5a880]">
              <Book className="w-4 h-4" />
              <span className="text-xs font-mono tracking-[0.35em] uppercase">
                Published Issues
              </span>
            </div>

            <div className="space-y-6">
              {JOURNAL_ISSUES.map((issue) => (
                <article
                  key={issue.id}
                  className="border border-[#22201d] bg-[#0d0d0c] p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs tracking-wider">
                    <span className="text-[#d8d0c4]">{issue.volume}</span>
                    <span className="text-[#c5a880]">{issue.status}</span>
                  </div>

                  <h3 className="text-xl font-serif text-[#f4f1eb]">
                    {issue.title}
                  </h3>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-[#8e8779]">
                      Papers Indexed / 收录篇目
                    </p>
                    <div className="space-y-3">
                      {issue.papers.map((paper, index) => (
                        <div
                          key={`${issue.id}-paper-${index}`}
                          className="border-l border-[#2a241b] pl-4"
                        >
                          <p className="text-[#e8e4dc]">{paper.title}</p>
                          <p className="text-xs mt-1 text-[#8e8779]">
                            Contributor: {paper.author}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#8e8779]">
                    Release Date: {issue.date}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="border border-[#22201d] bg-[#11110f] p-6 sm:p-8 h-fit">
          <div className="space-y-3 mb-6">
            <h3 className="text-xl font-serif text-[#f4f1eb]">
              Submission by Issue / 学术投稿
            </h3>
            <p className="text-sm leading-7 text-[#a29d93]">
              本表单不会在本站保存论文正文；它只负责生成 GitHub 预填 Issue。
              你的题目、作者、邮箱与摘要会被填入一个新 Issue 页面，随后由你自行确认提交。
            </p>
          </div>

          <form onSubmit={handleSubmitPaper} className="space-y-4">
            <div>
              <label className="block text-[#a29d93] mb-1 text-xs tracking-widest uppercase">
                论文题目 / Title
              </label>
              <input
                required
                value={newPaper.title}
                onChange={(event) =>
                  setNewPaper({
                    ...newPaper,
                    title: event.target.value,
                  })
                }
                className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-[#a29d93] mb-1 text-xs tracking-widest uppercase">
                作者姓名 / 学者笔名
              </label>
              <input
                value={newPaper.author}
                onChange={(event) =>
                  setNewPaper({
                    ...newPaper,
                    author: event.target.value,
                  })
                }
                className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-[#a29d93] mb-1 text-xs tracking-widest uppercase">
                联络信箱 / Email
              </label>
              <input
                type="email"
                value={newPaper.email}
                onChange={(event) =>
                  setNewPaper({
                    ...newPaper,
                    email: event.target.value,
                  })
                }
                className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-[#a29d93] mb-1 text-xs tracking-widest uppercase">
                摘要及大纲 / Abstract & Outline
              </label>
              <textarea
                required
                rows={8}
                value={newPaper.abstract}
                onChange={(event) =>
                  setNewPaper({
                    ...newPaper,
                    abstract: event.target.value,
                  })
                }
                className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] p-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#c5a880] text-[#0d0d0c] hover:bg-[#b0936f] py-2.5 transition-all font-semibold tracking-widest uppercase flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Submit via GitHub Issue</span>
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}


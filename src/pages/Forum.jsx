/**
 * 修改原因：
 * 1. 明确本页即时讨论是浏览器本地状态，不会自动同步到 GitHub Discussions。
 * 2. 继续保留 Open Discussions 作为公开讨论入口。
 *
 * 兼容性注意：
 * - props 与现有 App.jsx 保持兼容。
 */

import {
  ExternalLink,
  Github,
  Heart,
  MessageSquare,
  Send,
  Sparkles,
} from 'lucide-react';

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
  const discussionsUrl = getDiscussionsUrl();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr,0.9fr] gap-8">
        <section className="space-y-6">
          <div className="border border-[#22201d] bg-[#11110f] p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-3 text-[#c5a880]">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono tracking-[0.35em] uppercase">
                Discussions Forum
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-[#f4f1eb]">
              心灵共振集会广场
            </h2>

            <p className="text-sm leading-7 text-[#b8b1a4]">
              此板块用于记录梦境、象征和阅读体验的即时交流。需要注意：
              下方“本地帖子”仅保存在当前浏览器沙盒；真正公开、可协作、可链接的讨论区在 GitHub Discussions。
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={discussionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] px-4 py-2 text-xs font-mono tracking-widest transition-all"
              >
                <Github className="w-4 h-4" />
                <span>OPEN DISCUSSIONS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {discussions.length === 0 ? (
            <div className="border border-dashed border-[#2b2823] p-8 text-center text-[#8e8779] text-sm">
              当前还没有本地沙盒讨论。你可以直接去 GitHub Discussions 发起公开议题，
              也可以先在右侧起草一个本地议题。
            </div>
          ) : (
            discussions.map((disc) => (
              <article
                key={disc.id}
                className="border border-[#22201d] bg-[#10100f] p-6 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs tracking-wider text-[#8e8779]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#e8e4dc]">{disc.author}</span>
                    <span>•</span>
                    <span>{disc.category}</span>
                  </div>
                  <span>{disc.date}</span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-serif text-[#f4f1eb]">
                    {disc.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#a29d93]">
                    <button
                      type="button"
                      onClick={() => handleLike(disc.id)}
                      className="flex items-center space-x-1.5 hover:text-[#c5a880] transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{disc.likes} 共识</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <MessageSquare className="w-4 h-4" />
                      <span>{disc.replies.length} 个洞见回复</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {disc.replies.map((rep, index) => (
                    <div
                      key={`${disc.id}-reply-${index}`}
                      className="border-l border-[#2a241b] pl-4 space-y-1"
                    >
                      <div className="text-xs text-[#8e8779]">
                        <span className="text-[#d9d1c2]">{rep.author}</span>
                        <span className="mx-2">•</span>
                        <span>{rep.date}</span>
                      </div>
                      <p className="text-sm leading-7 text-[#c9c2b5]">
                        {rep.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={newReply[disc.id] || ''}
                    onChange={(event) =>
                      setNewReply({
                        ...newReply,
                        [disc.id]: event.target.value,
                      })
                    }
                    className="flex-grow bg-[#0a0a09] border border-[#22201d] text-[#e8e4dc] px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880] rounded-none"
                    placeholder="写下你的回应..."
                  />
                  <button
                    type="button"
                    onClick={() => handleAddReply(disc.id)}
                    className="border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] px-4 py-2 text-xs font-mono tracking-widest transition-all inline-flex items-center space-x-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>RESPOND</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <aside className="border border-[#22201d] bg-[#11110f] p-6 sm:p-8 h-fit">
          <div className="space-y-2 mb-6">
            <h3 className="text-xl font-serif text-[#f4f1eb]">
              NEW COGNITION / 新建议题
            </h3>
            <p className="text-sm leading-7 text-[#a29d93]">
              这里创建的是本地即时讨论草稿，不会自动同步到 GitHub。
              如果你希望公开归档讨论，请点击左侧的 Open Discussions。
            </p>
          </div>

          <form onSubmit={handleCreateDiscussion} className="space-y-4">
            <div>
              <label className="block text-[#a29d93] mb-1 text-xs tracking-widest uppercase">
                探讨核心命题 / Subject
              </label>
              <input
                required
                value={newDiscussion.title}
                onChange={(event) =>
                  setNewDiscussion({
                    ...newDiscussion,
                    title: event.target.value,
                  })
                }
                className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-[#a29d93] mb-1 text-xs tracking-widest uppercase">
                探讨分类域 / Field
              </label>
              <select
                value={newDiscussion.category}
                onChange={(event) =>
                  setNewDiscussion({
                    ...newDiscussion,
                    category: event.target.value,
                  })
                }
                className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-2 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
              >
                <option>梦境探讨 / ONEIROMANCY</option>
                <option>哲学哲学 / PHILOSOPHY</option>
                <option>心灵共时性 / SYNCHRONICITY</option>
                <option>实践分享 / PRAXIS</option>
              </select>
            </div>

            <div>
              <label className="block text-[#a29d93] mb-1 text-xs tracking-widest uppercase">
                思想描述与缘起 / Reasoning
              </label>
              <textarea
                required
                rows={7}
                value={newDiscussion.content}
                onChange={(event) =>
                  setNewDiscussion({
                    ...newDiscussion,
                    content: event.target.value,
                  })
                }
                className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] p-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-transparent border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] py-2.5 transition-all font-semibold tracking-widest uppercase"
            >
              Initiate Meeting / 开启集会讨论
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

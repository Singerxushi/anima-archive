react
import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Settings, 
  Search, 
  Plus, 
  Send, 
  ChevronRight, 
  Moon, 
  Sparkles, 
  GitBranch, 
  Github, 
  CheckCircle, 
  Heart, 
  Eye, 
  AlertCircle,
  Clock,
  User,
  ArrowRight,
  ExternalLink,
  Book,
  Maximize2,
  Minimize2
} from 'lucide-react';

// ==========================================
// 模拟初始数据 (Occultism & Jungian Psychology)
// ==========================================

const INITIAL_ARCHIVE = [
  {
    id: "arch-1",
    title: "阿尼玛与阿尼姆斯：灵魂的双重面镜",
    subtitle: "ON THE ANIMA AND ANIMUS: THE TWIN MIRRORS OF THE SOUL",
    category: "原型理论 / ARCHETYPES",
    tags: ["荣格心理学", "性别原型", "潜意识"],
    summary: "探讨人类心灵中异性潜意识原型的投射与整合过程，如何通过梦境与艺术创作显化并完成内省。",
    author: "Jungian_Explorer",
    date: "2026.07.15",
    content: "荣格指出，每个男人的潜意识深处都隐藏着一个女性形象，即阿尼玛（Anima）；而每个女人的潜意识深处都隐藏着一个男性形象，即阿尼姆斯（Animus）。这两个原型是通往集体潜意识的重要桥梁。\n\n当主体无法在意识层面容纳异性原型时，它们便会不可避免地投射至外界，表现为致命的迷恋、无端的偏见或无法化解的心灵代沟。对阿尼玛/阿尼姆斯的唤醒与整合，是走出蒙昧、走向自性化（Individuation）的第二重门扉。本篇将详细剖析梦境中的四重进化阶段（从本能欲望到无上智慧）。"
  },
  {
    id: "arch-2",
    title: "微观炼金术与人格独立化进程",
    subtitle: "ALCHEMICAL IMAGERY AND THE INDIVIDUATION PROCESS",
    category: "炼金术隐喻 / ALCHEMY",
    tags: ["赫耳墨斯主义", "自性化", "黑化阶段"],
    summary: "将中世纪炼金术的‘黑化、白化、黄化、红化’四大步骤对应心理学上的自我救赎与阴影整合。",
    author: "Hermetic_Mind",
    date: "2026.07.18",
    content: "炼金术并非简单的点石成金，而是一种心灵转化的伟大实验（Magnum Opus）。\n\n‘黑化’（Nigredo）代表直面内心阴影带来的混乱与抑郁，是人格结构瓦解的必经痛苦；‘白化’（Albedo）则是反省与净化的曙光，意识与潜意识开始达成暂时的和解；通过‘黄化’（Citrinitas）的智慧启蒙，最终达成‘红化’（Rubedo），即实现完整的、金黄般永恒自性（Self）的觉醒。炼金炉即是容器，亦是心房。"
  },
  {
    id: "arch-3",
    title: "梦境中的卡巴拉生命之树象征系统",
    subtitle: "THE CABALISTIC TREE OF LIFE IN ONEIRIC CARTOGRAPHY",
    category: "符号与象征 / SYMBOLS",
    tags: ["卡巴拉", "梦境解析", "路径整合"],
    summary: "解析高维潜意识在梦境中如何借用生命之树（Tree of Life）的十个质点（Sephirot）进行空间构图。",
    author: "Kabbalah_Dreamer",
    date: "2026.07.19",
    content: "在某些极具启示性的‘大梦’（Grand Dreams）中，梦者往往会经历上升、坠落或通过特定门户。这些门户在空间几何上与卡巴拉生命之树的质点高度契合。\n\n例如，跨越深渊（Abyss/Da'at）往往伴随着现实中信仰的崩塌与自我的重构。梦境并非无序的神经放电，而是一幅严密的象征地图，藉由古典几何与神圣符号，试图将失衡的意识引回中道。"
  }
];

const INITIAL_DISCUSSIONS = [
  {
    id: "disc-1",
    title: "【探讨】在梦中反复出现的‘黑水’与‘死海’，大家都是怎么解读的？",
    category: "梦境探讨 / ONEIROMANCY",
    author: "Anima_Seeker",
    likes: 42,
    replies: [
      { author: "Shadow_Walker", content: "水通常代表潜意识。黑色的静止之水暗示着未知的、可能带有深重恐惧感但蕴含巨大创造力的深层情绪潜能。这需要极大的勇气去‘潜入’。", date: "2026.07.20" },
      { author: "Alchemist_A", content: "同意楼上，这非常符合炼金术中的 Nigredo（黑化）状态，溶解一切已知的旧结构。不要害怕下沉，下沉即是新生的开端。", date: "2026.07.21" }
    ],
    date: "2026.07.20"
  },
  {
    id: "disc-2",
    title: "神秘学的‘秘契主义’是否就是集体潜意识的艺术化表达？",
    category: "哲学哲学 / PHILOSOPHY",
    author: "Sophia_Wisdom",
    likes: 29,
    replies: [
      { author: "Jungian_Explorer", content: "完全正确。荣格在手稿《红书》中尝试的事情，本质上就是用诺斯替教派和神秘主义的语言来绘制他个人的潜意识地图。理性无法企及的地方，符号是唯一的方舟。", date: "2026.07.21" }
    ],
    date: "2026.07.21"
  }
];

const JOURNAL_ISSUES = [
  {
    id: "vol-1",
    volume: "VOLUME 01 (ISSUE 01)",
    title: "潜意识的显像管：深渊镜鉴",
    status: "已出版 / ARCHIVED",
    date: "2026.06",
    papers: [
      { title: "论‘阴影’在梦中的原型投射及其整合手段", author: "Dr. Rachel Chen" },
      { title: "塔罗大阿尔卡纳的自性化旅程轨迹图谱", author: "Mage Crowley" }
    ]
  },
  {
    id: "vol-2",
    volume: "VOLUME 02 (ISSUE 02)",
    title: "镜与火：炼金术隐喻下的精神危机",
    status: "征稿中 / CALL FOR PAPERS",
    date: "截止 2026.09",
    papers: [
      { title: "目前已收到 5 篇审稿中论文...", author: "Anima 编委会" }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home | archive | forum | journal | settings
  const [archiveList, setArchiveList] = useState(() => {
    const saved = localStorage.getItem('anima_archive_local_uc');
    return saved ? JSON.parse(saved) : INITIAL_ARCHIVE;
  });
  const [discussions, setDiscussions] = useState(() => {
    const saved = localStorage.getItem('anima_forum_local_uc');
    return saved ? JSON.parse(saved) : INITIAL_DISCUSSIONS;
  });

  // 当前阅读的档案详情
  const [readingDoc, setReadingDoc] = useState(null);

  // GitHub 配置
  const [githubConfig, setGithubConfig] = useState(() => {
    const saved = localStorage.getItem('anima_github_config_uc');
    return saved ? JSON.parse(saved) : { owner: '', repo: '', token: '' };
  });

  // UI 交互状态
  const [searchTerm, setSearchTerm] = useState('');
  const [archiveFilter, setArchiveFilter] = useState('全部');
  const [showNotification, setShowNotification] = useState(null);

  // 表单状态
  const [newArchive, setNewArchive] = useState({ title: '', subtitle: '', category: '原型理论 / ARCHETYPES', tags: '', summary: '', content: '' });
  const [newDiscussion, setNewDiscussion] = useState({ title: '', category: '梦境探讨 / ONEIROMANCY', content: '' });
  const [newReply, setNewReply] = useState({}); 
  const [newPaper, setNewPaper] = useState({ title: '', author: '', abstract: '', email: '' });

  useEffect(() => {
    localStorage.setItem('anima_archive_local_uc', JSON.stringify(archiveList));
  }, [archiveList]);

  useEffect(() => {
    localStorage.setItem('anima_forum_local_uc', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('anima_github_config_uc', JSON.stringify(githubConfig));
  }, [githubConfig]);

  const triggerNotification = (message, type = 'success') => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 3500);
  };

  // 生成 GitHub Issue 投稿 URL 
  const generateGithubIssueUrl = (paper) => {
    const base = `https://github.com/${githubConfig.owner || 'YOUR_USER'}/${githubConfig.repo || 'YOUR_REPO'}/issues/new`;
    const title = encodeURIComponent(`[Submission] ${paper.title} - ${paper.author}`);
    const body = encodeURIComponent(`### ANIMA JOURNAL SUBMISSION

**论文题目 (Title):** ${paper.title}
**作者/笔名 (Author):** ${paper.author}
**联系信箱 (Email):** ${paper.email}

**论文大纲与摘要 (Abstract & Outline):**
${paper.abstract}

---
*Created via Anima Archive Portal. This submission will be automatically processed by the editorial board.*`);
    return `${base}?title=${title}&body=${body}&labels=journal-submission`;
  };

  const getDiscussionsUrl = () => {
    return `https://github.com/${githubConfig.owner || 'YOUR_USER'}/${githubConfig.repo || 'YOUR_REPO'}/discussions`;
  };

  // 发布档案 (Push to GitHub or Local)
  const handlePublishArchive = async (e) => {
    e.preventDefault();
    if (!newArchive.title || !newArchive.content) {
      triggerNotification('请填写完整的标题和探讨正文', 'error');
      return;
    }

    const item = {
      id: `arch-${Date.now()}`,
      title: newArchive.title,
      subtitle: newArchive.subtitle.toUpperCase() || 'UNTITLED REFLECTION',
      category: newArchive.category,
      tags: newArchive.tags.split(',').map(t => t.trim()).filter(Boolean),
      summary: newArchive.summary || newArchive.content.substring(0, 110) + '...',
      author: githubConfig.owner ? `${githubConfig.owner}` : 'Anonymous Scholar',
      date: new Date().toISOString().replace(/-/g, '.').split('T')[0],
      content: newArchive.content
    };

    if (githubConfig.token && githubConfig.owner && githubConfig.repo) {
      triggerNotification('正在通过 GitHub API 同步至远程档案库...');
      try {
        const path = `archive/${item.id}.json`;
        const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(item, null, 2))));
        
        const response = await fetch(`https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubConfig.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `archive: add [${item.title}] to subconscious records`,
            content: contentBase64,
            branch: 'main'
          })
        });

        if (response.ok) {
          triggerNotification('🎉 档案已成功写入远程 Git 仓库！');
        } else {
          const errData = await response.json();
          triggerNotification(`同步失败: ${errData.message || 'API 异常'}，已保存在本地沙盒。`, 'error');
        }
      } catch (err) {
        triggerNotification('网络异常，已自动保存在本地沙盒。', 'error');
      }
    } else {
      triggerNotification('文献已安全收录于本地沙盒档案。');
    }

    setArchiveList([item, ...archiveList]);
    setNewArchive({ title: '', subtitle: '', category: '原型理论 / ARCHETYPES', tags: '', summary: '', content: '' });
  };

  // 发布新讨论
  const handleCreateDiscussion = (e) => {
    e.preventDefault();
    if (!newDiscussion.title || !newDiscussion.content) {
      triggerNotification('请补充完整的讨论主题与内容', 'error');
      return;
    }

    const item = {
      id: `disc-${Date.now()}`,
      title: newDiscussion.title,
      category: newDiscussion.category,
      author: 'A_Seeker',
      likes: 1,
      replies: [
        { author: "Anima_Keeper", content: `欢迎开启此议题。文字是锚，将漂浮在潜意识海洋中的无序意象固定在理性的陆地上。`, date: new Date().toISOString().replace(/-/g, '.').split('T')[0] }
      ],
      date: new Date().toISOString().replace(/-/g, '.').split('T')[0]
    };

    setDiscussions([item, ...discussions]);
    setNewDiscussion({ title: '', category: '梦境探讨 / ONEIROMANCY', content: '' });
    triggerNotification('议题已在集会广场公示。');
  };

  // 快捷回复
  const handleAddReply = (discId) => {
    const text = newReply[discId];
    if (!text || !text.trim()) return;

    setDiscussions(discussions.map(d => {
      if (d.id === discId) {
        return {
          ...d,
          replies: [...d.replies, {
            author: "Pilgrim_X",
            content: text,
            date: new Date().toISOString().replace(/-/g, '.').split('T')[0]
          }]
        };
      }
      return d;
    }));

    setNewReply({ ...newReply, [discId]: '' });
    triggerNotification('思想回响已记录。');
  };

  const handleLike = (discId) => {
    setDiscussions(discussions.map(d => {
      if (d.id === discId) {
        return { ...d, likes: d.likes + 1 };
      }
      return d;
    }));
  };

  const handleSubmitPaper = (e) => {
    e.preventDefault();
    if (!newPaper.title || !newPaper.abstract) {
      triggerNotification('请补充完整的投稿信息', 'error');
      return;
    }
    
    const url = generateGithubIssueUrl(newPaper);
    window.open(url, '_blank');
    triggerNotification('标准 Issue 格式稿件已生成。请在打开的 GitHub 页面中点击 Submit 进行递交！');
  };

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-[#e8e4dc] font-sans antialiased flex flex-col selection:bg-[#c5a880] selection:text-[#0d0d0c]">
      
      {/* ==========================================
          顶部极简线描导航栏（Un-canon 风格）
          ========================================== */}
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

      {/* ==========================================
          移动端底部微型导航
          ========================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0c]/95 border-t border-[#22201d] flex justify-around py-3">
        {[
          { id: 'home', label: 'INDEX', icon: Moon },
          { id: 'archive', label: 'ARCHIVES', icon: BookOpen },
          { id: 'forum', label: 'FORUM', icon: MessageSquare },
          { id: 'journal', label: 'JOURNAL', icon: FileText },
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

      {/* 全局通知组件 */}
      {showNotification && (
        <div className="fixed top-24 right-6 z-50 max-w-sm w-full bg-[#141413] border border-[#c5a880]/30 p-4 shadow-xl text-xs font-mono tracking-wider animate-fade-in">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-pulse" />
            <p className="text-[#e8e4dc]">{showNotification.message}</p>
          </div>
        </div>
      )}

      {/* ==========================================
          主体网格系统
          ========================================== */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-10 mb-20 md:mb-10">
        
        {/* ==========================================
            TAB 1: 首页 (INDEX)
            ========================================== */}
        {activeTab === 'home' && (
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
        )}

        {/* ==========================================
            TAB 2: 档案库 (ARCHIVES)
            ========================================== */}
        {activeTab === 'archive' && (
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
        )}

        {/* ==========================================
            TAB 3: 论坛讨论区 (DISCUSSIONS)
            ========================================== */}
        {activeTab === 'forum' && (
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
        )}

        {/* ==========================================
            TAB 4: 学术期刊 (JOURNAL)
            ========================================== */}
        {activeTab === 'journal' && (
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
        )}

        {/* ==========================================
            TAB 5: 配置中心 (SETTINGS)
            ========================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto border border-[#22201d] bg-[#0f0f0e] p-8 space-y-6">
            
            <div className="border-b border-[#22201d] pb-4">
              <h2 className="text-lg font-serif text-[#f4f1eb] flex items-center space-x-2.5">
                <Settings className="w-5 h-5 text-[#c5a880]" />
                <span>GITHUB INTEGRATION / 接口集成中心</span>
              </h2>
              <p className="text-xs font-mono text-[#837f75] mt-1">
                CONFIGURE REPOSITORIES FOR DIRECT GIT PIPELINE
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#a29d93] mb-1.5">
                  GitHub 账户或组织名 / OWNER (USERNAME)
                </label>
                <input
                  type="text"
                  placeholder="e.g. aethelgard"
                  value={githubConfig.owner}
                  onChange={(e) => setGithubConfig({...githubConfig, owner: e.target.value})}
                  className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3.5 py-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[#a29d93] mb-1.5">
                  目标仓库名 / REPOSITORY NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. anima-archive"
                  value={githubConfig.repo}
                  onChange={(e) => setGithubConfig({...githubConfig, repo: e.target.value})}
                  className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3.5 py-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[#a29d93] mb-1.5 flex items-center justify-between">
                  <span>个人访问密匙 / PERSONAL ACCESS TOKEN (PAT)</span>
                  <span className="text-[9px] text-[#837f75] normal-case font-normal">保存在本地安全沙盒</span>
                </label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={githubConfig.token}
                  onChange={(e) => setGithubConfig({...githubConfig, token: e.target.value})}
                  className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3.5 py-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="bg-[#0a0a09] border border-[#22201d] p-5 space-y-2.5">
                <p className="font-bold text-[#c5a880] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>关于无 Token 安全运行模式：</span>
                </p>
                <p className="text-[#837f75] leading-relaxed">
                  本站点全面支持“无 Token”工作流：
                  <br />
                  - 只需要填写 <strong>Owner</strong> 与 <strong>Repository</strong>。
                  <br />
                  - 在学报投稿时，系统将使用纯前端计算出高度规范化的 Issue 链接，用户跳转点击 “Submit” 即可，不需要向网页透露任何凭证密匙。
                </p>
              </div>

              <button
                onClick={() => {
                  triggerNotification('⚙️ 核心配置在本地沙盒环境中写入并更新完毕。');
                  setActiveTab('home');
                }}
                className="w-full bg-[#c5a880] text-[#0d0d0c] hover:bg-[#b0936f] py-3 transition-all font-semibold tracking-widest uppercase flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>SAVE CONFIGURATION / 保存本地</span>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ==========================================
          页脚：学术仪式感声明
          ========================================== */}
      <footer className="bg-[#0a0a09] border-t border-[#22201d] py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="space-y-1 text-left">
            <span className="font-mono text-[9px] tracking-widest text-[#837f75] block">ANIMA ARCHIVE PROJECT</span>
            <p className="text-[11px] text-[#a29d93]">
              探求被遗忘的历史秘契，重构集体潜意识下的自性化图景。
            </p>
          </div>
          <div className="text-left md:text-right font-mono text-[10px] text-[#837f75]">
            <span>STATIC GENERATED PLATFORM & COOPERATIVE REPOSITORY.</span>
            <p className="mt-1">© 2026 UN-CANON INSPIRED INTERACTION LAB.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

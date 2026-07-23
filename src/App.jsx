/**
 * 修改原因：
 * 1. 将 GitHub owner/repo 与 token 分离：owner/repo 保存在 localStorage，token 仅保存在 sessionStorage。
 * 2. 启动时自动迁移旧版 localStorage 中残留的 token，减少敏感信息长期驻留。
 * 3. 继续兼容现有 Home / About / Archives / Forum / Journal 页面结构。
 *
 * 兼容性注意：
 * - 保留原有 localStorage key: anima_github_config_uc
 * - 保留原有 archive/discussion 本地存储 key
 * - 若旧缓存里存在 githubConfig.token，会在首次加载时自动迁移到 sessionStorage
 */

import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import MobileNav from './components/layout/MobileNav';
import Footer from './components/layout/Footer';
import Notification from './components/ui/Notification';
import Home from './pages/Home';
import About from './pages/About';
import Archives from './pages/Archives';
import Forum from './pages/Forum';
import Journal from './pages/Journal';
import SettingsPanel from './pages/SettingsPanel';
import { INITIAL_ARCHIVE, INITIAL_DISCUSSIONS } from './data/initialData';
import useLocalStorage from './hooks/useLocalStorage';
import { formatArchiveDate } from './utils/date';
import {
  generateGithubIssueUrl,
  getDiscussionsUrl,
  syncArchiveToGithub,
} from './utils/github';
import {
  combineGithubConfig,
  DEFAULT_GITHUB_CONFIG,
  GITHUB_STORAGE_KEY,
  GITHUB_TOKEN_SESSION_KEY,
  hasWritableGithubToken,
  sanitizeGithubConfig,
} from './config/github';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home | archive | forum | journal | about | settings
  const [archiveList, setArchiveList] = useLocalStorage(
    'anima_archive_local_uc',
    INITIAL_ARCHIVE
  );
  const [discussions, setDiscussions] = useLocalStorage(
    'anima_forum_local_uc',
    INITIAL_DISCUSSIONS
  );

  const [githubConfig, setGithubConfig] = useLocalStorage(
    GITHUB_STORAGE_KEY,
    DEFAULT_GITHUB_CONFIG
  );

  const [githubToken, setGithubToken] = useState(() => {
    try {
      return sessionStorage.getItem(GITHUB_TOKEN_SESSION_KEY) || '';
    } catch {
      return '';
    }
  });

  const [readingDoc, setReadingDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [archiveFilter, setArchiveFilter] = useState('全部');
  const [showNotification, setShowNotification] = useState(null);

  const [newArchive, setNewArchive] = useState({
    title: '',
    subtitle: '',
    category: '原型理论 / ARCHETYPES',
    tags: '',
    summary: '',
    content: '',
  });

  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    category: '梦境探讨 / ONEIROMANCY',
    content: '',
  });

  const [newReply, setNewReply] = useState({});

  const [newPaper, setNewPaper] = useState({
    title: '',
    author: '',
    abstract: '',
    email: '',
  });

  const resolvedGithubConfig = combineGithubConfig(githubConfig, githubToken);

  useEffect(() => {
    // 启动迁移：把旧版 localStorage 中可能存在的 token 迁移到 sessionStorage
    const legacyToken =
      typeof githubConfig?.token === 'string' ? githubConfig.token.trim() : '';

    const normalizedConfig = sanitizeGithubConfig(githubConfig);

    const needConfigMigration =
      (githubConfig?.owner ?? '') !== normalizedConfig.owner ||
      (githubConfig?.repo ?? '') !== normalizedConfig.repo ||
      Object.prototype.hasOwnProperty.call(githubConfig || {}, 'token');

    if (legacyToken && !githubToken) {
      setGithubToken(legacyToken);
    }

    if (needConfigMigration) {
      setGithubConfig(normalizedConfig);
    }
    // 仅在首次启动执行一次迁移
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if (githubToken) {
        sessionStorage.setItem(GITHUB_TOKEN_SESSION_KEY, githubToken);
      } else {
        sessionStorage.removeItem(GITHUB_TOKEN_SESSION_KEY);
      }
    } catch {
      // 浏览器禁用 sessionStorage 时保持页面可用
    }
  }, [githubToken]);

  function triggerNotification(message, type = 'success') {
    setShowNotification({ message, type });
    window.setTimeout(() => setShowNotification(null), 3500);
  }

  async function handlePublishArchive(event) {
    event.preventDefault();

    if (!newArchive.title || !newArchive.content) {
      triggerNotification('请填写完整的标题和探讨正文', 'error');
      return;
    }

    const explicitOwner =
      typeof githubConfig?.owner === 'string' && githubConfig.owner.trim();

    const item = {
      id: `arch-${Date.now()}`,
      title: newArchive.title,
      subtitle: newArchive.subtitle.toUpperCase() || 'UNTITLED REFLECTION',
      category: newArchive.category,
      tags: newArchive.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      summary: newArchive.summary || `${newArchive.content.substring(0, 110)}...`,
      author: explicitOwner ? resolvedGithubConfig.owner : 'Anonymous Scholar',
      date: formatArchiveDate(),
      content: newArchive.content,
    };

    if (hasWritableGithubToken(githubToken)) {
      triggerNotification('正在通过 GitHub API 同步至远程档案库...');

      try {
        await syncArchiveToGithub(resolvedGithubConfig, item);
        triggerNotification('档案已成功写入远程 Git 仓库！');
      } catch (error) {
        triggerNotification(
          `同步失败: ${error.message}，已保存在本地沙盒。`,
          'error'
        );
      }
    } else {
      triggerNotification('文献已安全收录于本地沙盒档案。');
    }

    setArchiveList([item, ...archiveList]);
    setNewArchive({
      title: '',
      subtitle: '',
      category: '原型理论 / ARCHETYPES',
      tags: '',
      summary: '',
      content: '',
    });
  }

  function handleCreateDiscussion(event) {
    event.preventDefault();

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
        {
          author: 'Anima_Keeper',
          content:
            '欢迎开启此议题。文字是锚，将漂浮在潜意识海洋中的无序意象固定在理性的陆地上。',
          date: formatArchiveDate(),
        },
      ],
      date: formatArchiveDate(),
    };

    setDiscussions([item, ...discussions]);
    setNewDiscussion({
      title: '',
      category: '梦境探讨 / ONEIROMANCY',
      content: '',
    });
    triggerNotification('议题已在本地沙盒中记录。');
  }

  function handleAddReply(discId) {
    const text = newReply[discId];

    if (!text || !text.trim()) {
      return;
    }

    setDiscussions(
      discussions.map((discussion) => {
        if (discussion.id !== discId) {
          return discussion;
        }

        return {
          ...discussion,
          replies: [
            ...discussion.replies,
            {
              author: 'Pilgrim_X',
              content: text,
              date: formatArchiveDate(),
            },
          ],
        };
      })
    );

    setNewReply({
      ...newReply,
      [discId]: '',
    });

    triggerNotification('思想回响已记录。');
  }

  function handleLike(discId) {
    setDiscussions(
      discussions.map((discussion) =>
        discussion.id === discId
          ? { ...discussion, likes: discussion.likes + 1 }
          : discussion
      )
    );
  }

  function handleSubmitPaper(event) {
    event.preventDefault();

    if (!newPaper.title || !newPaper.abstract) {
      triggerNotification('请补充完整的投稿信息', 'error');
      return;
    }

    const url = generateGithubIssueUrl(resolvedGithubConfig, newPaper);
    window.open(url, '_blank', 'noopener,noreferrer');
    triggerNotification(
      '标准 Issue 格式稿件已生成。请在打开的 GitHub 页面中点击 Submit 进行递交！'
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-[#e8e4dc]">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setReadingDoc={setReadingDoc}
        githubConfig={resolvedGithubConfig}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-14">
        <Notification notification={showNotification} />

        {activeTab === 'home' && (
          <Home
            archiveList={archiveList}
            setActiveTab={setActiveTab}
            setReadingDoc={setReadingDoc}
          />
        )}

        {activeTab === 'about' && <About />}

        {activeTab === 'archive' && (
          <Archives
            archiveList={archiveList}
            archiveFilter={archiveFilter}
            setArchiveFilter={setArchiveFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            readingDoc={readingDoc}
            setReadingDoc={setReadingDoc}
            newArchive={newArchive}
            setNewArchive={setNewArchive}
            handlePublishArchive={handlePublishArchive}
            githubConfig={resolvedGithubConfig}
          />
        )}

        {activeTab === 'forum' && (
          <Forum
            discussions={discussions}
            newDiscussion={newDiscussion}
            setNewDiscussion={setNewDiscussion}
            newReply={newReply}
            setNewReply={setNewReply}
            handleCreateDiscussion={handleCreateDiscussion}
            handleAddReply={handleAddReply}
            handleLike={handleLike}
            getDiscussionsUrl={() => getDiscussionsUrl(resolvedGithubConfig)}
          />
        )}

        {activeTab === 'journal' && (
          <Journal
            newPaper={newPaper}
            setNewPaper={setNewPaper}
            handleSubmitPaper={handleSubmitPaper}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            githubConfig={sanitizeGithubConfig(githubConfig)}
            setGithubConfig={setGithubConfig}
            githubToken={githubToken}
            setGithubToken={setGithubToken}
            triggerNotification={triggerNotification}
            setActiveTab={setActiveTab}
          />
        )}

        <Footer />
      </div>

      <div className="md:hidden fixed bottom-0 inset-x-0 border-t border-[#22201d] bg-[#0d0d0c]/95 backdrop-blur-sm px-4 py-3">
        <MobileNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setReadingDoc={setReadingDoc}
        />
      </div>
    </div>
  );
}


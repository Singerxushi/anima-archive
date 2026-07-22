import { useState } from 'react';

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
import { generateGithubIssueUrl, getDiscussionsUrl, syncArchiveToGithub } from './utils/github';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home | archive | forum | journal | about | settings

  const [archiveList, setArchiveList] = useLocalStorage(
    'anima_archive_local_uc',
    INITIAL_ARCHIVE,
  );

  const [discussions, setDiscussions] = useLocalStorage(
    'anima_forum_local_uc',
    INITIAL_DISCUSSIONS,
  );

  const [githubConfig, setGithubConfig] = useLocalStorage(
    'anima_github_config_uc',
    { owner: '', repo: '', token: '' },
  );

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

  const triggerNotification = (message, type = 'success') => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 3500);
  };

  const handlePublishArchive = async (event) => {
    event.preventDefault();

    if (!newArchive.title || !newArchive.content) {
      triggerNotification('请填写完整的标题和探讨正文', 'error');
      return;
    }

    const item = {
      id: `arch-${Date.now()}`,
      title: newArchive.title,
      subtitle: newArchive.subtitle.toUpperCase() || 'UNTITLED REFLECTION',
      category: newArchive.category,
      tags: newArchive.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      summary: newArchive.summary || `${newArchive.content.substring(0, 110)}...`,
      author: githubConfig.owner ? `${githubConfig.owner}` : 'Anonymous Scholar',
      date: formatArchiveDate(),
      content: newArchive.content,
    };

    if (githubConfig.token && githubConfig.owner && githubConfig.repo) {
      triggerNotification('正在通过 GitHub API 同步至远程档案库...');

      try {
        await syncArchiveToGithub(githubConfig, item);
        triggerNotification('🎉 档案已成功写入远程 Git 仓库！');
      } catch (error) {
        triggerNotification(`同步失败: ${error.message}，已保存在本地沙盒。`, 'error');
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
  };

  const handleCreateDiscussion = (event) => {
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
          content: '欢迎开启此议题。文字是锚，将漂浮在潜意识海洋中的无序意象固定在理性的陆地上。',
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
    triggerNotification('议题已在集会广场公示。');
  };

  const handleAddReply = (discId) => {
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
      }),
    );

    setNewReply({ ...newReply, [discId]: '' });
    triggerNotification('思想回响已记录。');
  };

  const handleLike = (discId) => {
    setDiscussions(
      discussions.map((discussion) => (
        discussion.id === discId
          ? { ...discussion, likes: discussion.likes + 1 }
          : discussion
      )),
    );
  };

  const handleSubmitPaper = (event) => {
    event.preventDefault();

    if (!newPaper.title || !newPaper.abstract) {
      triggerNotification('请补充完整的投稿信息', 'error');
      return;
    }

    const url = generateGithubIssueUrl(githubConfig, newPaper);
    window.open(url, '_blank');
    triggerNotification('标准 Issue 格式稿件已生成。请在打开的 GitHub 页面中点击 Submit 进行递交！');
  };

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-[#e8e4dc] font-sans antialiased flex flex-col selection:bg-[#c5a880] selection:text-[#0d0d0c]">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setReadingDoc={setReadingDoc}
        githubConfig={githubConfig}
      />

      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setReadingDoc={setReadingDoc}
      />

      <Notification notification={showNotification} />

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-10 mb-20 md:mb-10">
        {activeTab === 'home' && (
          <Home
            archiveList={archiveList}
            setActiveTab={setActiveTab}
            setReadingDoc={setReadingDoc}
          />
        )}

        {activeTab === 'about' && (
          <About />
        )}

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
            githubConfig={githubConfig}
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
            getDiscussionsUrl={() => getDiscussionsUrl(githubConfig)}
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
            githubConfig={githubConfig}
            setGithubConfig={setGithubConfig}
            triggerNotification={triggerNotification}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}


import { useCallback, useEffect, useMemo, useState } from 'react';

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


import {
  INITIAL_ARCHIVE,
  INITIAL_DISCUSSIONS,
} from './data/initialData';


import useLocalStorage from './hooks/useLocalStorage';


import {
  formatArchiveDate,
} from './utils/date';


import {
  generateGithubIssueUrl,
  getDiscussionsUrl,
} from './utils/github';


import {
  loadDiscussionsCache,
} from './utils/discussions';


import {
  clearStoredGithubToken,
  DEFAULT_GITHUB_CONFIG,
  GITHUB_STORAGE_KEY,
  sanitizeGithubConfig,
} from './config/github';



function buildLocalDraftDiscussion(payload){

  return {

    id:
      `local-draft-${Date.now()}`,

    source:
      'local-draft',

    githubId:
      '',

    number:
      null,

    title:
      payload.title,


    content:
      payload.content,


    category:
      payload.category,


    author:
      'Local_Draft',


    likes:
      0,


    replies:
      [],


    date:
      formatArchiveDate(),


    createdAtISO:
      new Date().toISOString(),


    updatedAtISO:
      new Date().toISOString(),


    url:
      '',

  };

}



function mergeRemoteWithLocalDrafts(
  remoteItems,
  previousItems
){

  const drafts =
    previousItems.filter(
      item =>
        item.source === 'local-draft'
    );


  return [

    ...remoteItems,

    ...drafts,

  ].sort(

    (left,right)=>{

      const l =
        new Date(
          left.updatedAtISO ||
          left.createdAtISO ||
          0
        ).getTime();


      const r =
        new Date(
          right.updatedAtISO ||
          right.createdAtISO ||
          0
        ).getTime();


      return r-l;

    }

  );

}



export default function App(){


const [activeTab,setActiveTab]
=
useState('home');



const [archiveList,setArchiveList]
=
useLocalStorage(
  'anima_archive_local_uc',
  INITIAL_ARCHIVE
);



const [discussions,setDiscussions]
=
useLocalStorage(
  'anima_forum_local_uc',
  INITIAL_DISCUSSIONS
);



const [githubConfig,setGithubConfig]
=
useLocalStorage(
  GITHUB_STORAGE_KEY,
  DEFAULT_GITHUB_CONFIG
);



const [readingDoc,setReadingDoc]
=
useState(null);


const [searchTerm,setSearchTerm]
=
useState('');


const [archiveFilter,setArchiveFilter]
=
useState('全部');


const [showNotification,setShowNotification]
=
useState(null);



const [forumSyncMeta,setForumSyncMeta]
=
useState({

  status:
    'idle',

  source:
    'github-discussions-cache',

  lastSyncedAt:
    null,

  error:
    '',

});



const [newArchive,setNewArchive]
=
useState({

title:'',
subtitle:'',
category:'原型理论 / ARCHETYPES',
tags:'',
summary:'',
content:'',

});



const [newDiscussion,setNewDiscussion]
=
useState({

title:'',
category:'梦境探讨 / ONEIROMANCY',
content:'',

});



const [newReply,setNewReply]
=
useState({});



const [newPaper,setNewPaper]
=
useState({

title:'',
author:'',
abstract:'',
email:'',

});



const resolvedGithubConfig =
useMemo(
()=>sanitizeGithubConfig(githubConfig),
[githubConfig]
);



useEffect(()=>{

clearStoredGithubToken();


setGithubConfig(
 previous =>
 sanitizeGithubConfig(previous)
);


},[setGithubConfig]);



const triggerNotification =
useCallback(
(message,type='success')=>{

setShowNotification({
message,
type
});


window.setTimeout(
()=>setShowNotification(null),
3500
);


},
[]
);




const refreshGithubForum =
useCallback(
async ({silent=false}={})=>{


setForumSyncMeta(
previous=>({

...previous,

status:'syncing',

error:''

})
);



try{


const result =
await loadDiscussionsCache();



setDiscussions(
previous =>
mergeRemoteWithLocalDrafts(
result.discussions,
previous
)
);



setForumSyncMeta({

status:'ready',

source:
result.source ||
'github-discussions-cache',


lastSyncedAt:
result.updatedAt ||
new Date().toISOString(),


error:''

});



if(!silent){

triggerNotification(
'Forum 缓存已从 GitHub Actions 更新'
);

}


}catch(error){


setForumSyncMeta({

status:'error',

source:
'github-discussions-cache',

lastSyncedAt:
null,

error:
error.message

});



if(!silent){

triggerNotification(
`Forum 同步失败：${error.message}`,
'error'
);

}


}


},
[
setDiscussions,
triggerNotification
]
);



useEffect(()=>{

if(activeTab !== 'forum'){

return;

}


refreshGithubForum({
silent:true
});


},[
activeTab,
refreshGithubForum
]);
    function handlePublishArchive(event) {
    event.preventDefault();

    if (!newArchive.title || !newArchive.content) {
      triggerNotification(
        '请填写完整的标题与探讨正文',
        'error'
      );
      return;
    }


    const item = {

      id:
        `arch-${Date.now()}`,

      title:
        newArchive.title,


      subtitle:
        newArchive.subtitle.toUpperCase()
        ||
        'UNTITLED REFLECTION',


      category:
        newArchive.category,


      tags:
        newArchive.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean),


      summary:
        newArchive.summary
        ||
        `${newArchive.content.substring(0,110)}...`,


      author:
        resolvedGithubConfig.owner
        ||
        'Anonymous Scholar',


      date:
        formatArchiveDate(),


      content:
        newArchive.content,

    };


    setArchiveList(
      previous => [
        item,
        ...previous
      ]
    );


    setNewArchive({

      title:'',
      subtitle:'',
      category:'原型理论 / ARCHETYPES',
      tags:'',
      summary:'',
      content:'',

    });


    triggerNotification(
      '文献已保存到本地。公开同步已迁移至 GitHub Actions。',
    );

  }



  function handleCreateDiscussion(event){

    event.preventDefault();


    if(
      !newDiscussion.title ||
      !newDiscussion.content
    ){

      triggerNotification(
        '请补充完整讨论主题与内容',
        'error'
      );

      return;

    }



    const draft =
      buildLocalDraftDiscussion(
        newDiscussion
      );



    setDiscussions(
      previous => [
        draft,
        ...previous
      ]
    );



    setNewDiscussion({

      title:'',
      category:
        '梦境探讨 / ONEIROMANCY',

      content:'',

    });



    triggerNotification(
      '草稿已保存。正式讨论请进入 GitHub Discussions。',
    );

  }





  function handleAddReply(discId){

    const text =
      newReply[discId];



    if(!text || !text.trim()){

      return;

    }



    const target =
      discussions.find(
        item =>
          item.id === discId
      );



    if(!target){

      return;

    }



    if(target.source === 'github'){

      triggerNotification(
        'GitHub 镜像讨论请返回原帖回复。',
        'error'
      );

      return;

    }



    setDiscussions(
      previous =>
        previous.map(
          discussion => {

            if(
              discussion.id !== discId
            ){

              return discussion;

            }



            return {

              ...discussion,


              replies:[

                ...(Array.isArray(
                  discussion.replies
                )
                ?
                discussion.replies
                :
                []),


                {

                  id:
                    `reply-${Date.now()}`,


                  author:
                    'Pilgrim_X',


                  content:
                    text.trim(),


                  date:
                    formatArchiveDate(),

                }

              ],


              updatedAtISO:
                new Date()
                .toISOString(),

            };

          }
        )
    );



    setNewReply(
      previous => ({

        ...previous,

        [discId]:
          '',

      })
    );



    triggerNotification(
      '本地回复已保存。',
    );

  }





  function handleLike(discId){


    const target =
      discussions.find(
        item =>
          item.id === discId
      );



    if(!target){

      return;

    }



    if(target.source === 'github'){

      triggerNotification(
        'GitHub 讨论请在原帖进行 reaction。',
        'error'
      );

      return;

    }



    setDiscussions(
      previous =>
        previous.map(
          discussion =>

            discussion.id === discId

            ?

            {

              ...discussion,

              likes:
                Number(
                  discussion.likes || 0
                )
                +
                1

            }

            :

            discussion

        )
    );

  }





  function handleSubmitPaper(event){

    event.preventDefault();



    if(
      !newPaper.title ||
      !newPaper.abstract
    ){

      triggerNotification(
        '请补充投稿信息',
        'error'
      );

      return;

    }



    const url =
      generateGithubIssueUrl(
        resolvedGithubConfig,
        newPaper
      );



    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );



    triggerNotification(
      'Issue 投稿页面已生成。',
    );

  }



  return (

    <div
      className="
      min-h-screen
      bg-[#0d0d0c]
      text-[#e8e4dc]
      pb-24
      md:pb-0
      "
    >


      <Notification
        notification={
          showNotification
        }
      />



      <div
        className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        "
      >


        <Header

          activeTab={activeTab}

          setActiveTab={setActiveTab}

          setReadingDoc={setReadingDoc}

          githubConfig={
            resolvedGithubConfig
          }

        />



        <main className="py-8">


          {
          activeTab === 'home'
          &&
          <Home

            archiveList={archiveList}

            setActiveTab={setActiveTab}

            setReadingDoc={setReadingDoc}

          />
          }



          {
          activeTab === 'about'
          &&
          <About />
          }



          {
          activeTab === 'archive'
          &&
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

            handlePublishArchive={
              handlePublishArchive
            }

            githubConfig={
              resolvedGithubConfig
            }

          />
          }



          {
          activeTab === 'forum'
          &&
          <Forum

            discussions={discussions}

            newDiscussion={newDiscussion}

            setNewDiscussion={setNewDiscussion}

            newReply={newReply}

            setNewReply={setNewReply}

            handleCreateDiscussion={
              handleCreateDiscussion
            }

            handleAddReply={
              handleAddReply
            }

            handleLike={
              handleLike
            }


            getDiscussionsUrl={
              () =>
              getDiscussionsUrl(
                resolvedGithubConfig
              )
            }


            refreshGithubForum={
              refreshGithubForum
            }


            forumSyncMeta={
              forumSyncMeta
            }

          />
          }




          {
          activeTab === 'journal'
          &&
          <Journal

            newPaper={newPaper}

            setNewPaper={setNewPaper}

            handleSubmitPaper={
              handleSubmitPaper
            }

          />
          }




          {
          activeTab === 'settings'
          &&
          <SettingsPanel

            githubConfig={
              resolvedGithubConfig
            }

            setGithubConfig={
              setGithubConfig
            }

            forumSyncMeta={
              forumSyncMeta
            }

            triggerNotification={
              triggerNotification
            }

            setActiveTab={
              setActiveTab
            }

          />
          }


        </main>



        <Footer />

      </div>



      <MobileNav

        activeTab={activeTab}

        setActiveTab={setActiveTab}

        setReadingDoc={setReadingDoc}

      />


    </div>

  );


}

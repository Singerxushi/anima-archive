import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const owner = process.env.GITHUB_OWNER || 'Singerxushi';
const repo = process.env.GITHUB_REPO || 'anima-archive';
const token = process.env.GITHUB_TOKEN;

const outputPath = path.resolve('public/data/forum-discussions.json');

const FETCH_DISCUSSIONS_QUERY = `
  query FetchDiscussions(
    $owner: String!,
    $repo: String!,
    $first: Int!,
    $commentsFirst: Int!
  ) {
    repository(owner: $owner, name: $repo) {
      discussions(
        first: $first,
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        nodes {
          id
          number
          title
          bodyText
          url
          createdAt
          updatedAt
          upvoteCount
          author {
            login
          }
          category {
            name
            slug
          }
          comments(first: $commentsFirst) {
            totalCount
            nodes {
              id
              bodyText
              url
              createdAt
              updatedAt
              author {
                login
              }
            }
          }
        }
      }
    }
  }
`;

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().replace(/-/g, '.').split('T')[0];
}

function mapComment(comment = {}) {
  return {
    id: comment.id || `comment-${Math.random().toString(36).slice(2, 10)}`,
    githubId: comment.id || '',
    author: comment.author?.login || 'github',
    content: comment.bodyText || '',
    date: formatDate(comment.createdAt),
    createdAtISO: comment.createdAt || null,
    updatedAtISO: comment.updatedAt || null,
    url: comment.url || '',
  };
}

function mapDiscussion(discussion = {}) {
  return {
    id: `github-discussion-${discussion.number ?? discussion.id}`,
    githubId: discussion.id || '',
    source: 'github',
    number: discussion.number ?? null,
    title: discussion.title || 'Untitled discussion',
    content: discussion.bodyText || '',
    category: discussion.category?.name || 'General',
    categorySlug: discussion.category?.slug || 'general',
    author: discussion.author?.login || 'github',
    likes: Number(discussion.upvoteCount || 0),
    replies: Array.isArray(discussion.comments?.nodes)
      ? discussion.comments.nodes.map(mapComment)
      : [],
    date: formatDate(discussion.createdAt),
    createdAtISO: discussion.createdAt || null,
    updatedAtISO: discussion.updatedAt || null,
    url: discussion.url || '',
  };
}

async function githubGraphQL(query, variables) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    const message =
      payload.errors?.map((item) => item.message).join('; ') ||
      payload.message ||
      `GitHub GraphQL 请求失败：HTTP ${response.status}`;

    throw new Error(message);
  }

  return payload.data;
}

async function writeOutput(data) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function main() {
  if (!token) {
    throw new Error('缺少 GITHUB_TOKEN，无法同步 forum discussions 缓存。');
  }

  const data = await githubGraphQL(FETCH_DISCUSSIONS_QUERY, {
    owner,
    repo,
    first: 20,
    commentsFirst: 8,
  });

  const items = Array.isArray(data?.repository?.discussions?.nodes)
    ? data.repository.discussions.nodes.map(mapDiscussion)
    : [];

  const output = {
    updatedAt: new Date().toISOString(),
    source: 'github-actions-cache',
    repo: {
      owner,
      repo,
    },
    items,
  };

  await writeOutput(output);

  console.log(
    `Synced ${items.length} discussion item(s) to ${path.relative(process.cwd(), outputPath)}`,
  );
}

main().catch(async (error) => {
  if (existsSync(outputPath)) {
    console.warn(
      `[forum-cache] 同步失败，但已保留现有缓存文件：${error.message}`,
    );
    process.exit(0);
  }

  console.error(`[forum-cache] 首次生成失败：${error.message}`);
  process.exit(1);
});

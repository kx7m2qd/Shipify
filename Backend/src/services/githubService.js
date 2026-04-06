const { Octokit } = require('@octokit/rest');
const logger = require('../utils/logger');

if (!process.env.GITHUB_TOKEN) {
  logger.warn('GITHUB_TOKEN is not set. API rate limit will be 60 req/hour instead of 5000.');
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || undefined });

function parseGithubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\s]+?)(?:\.git)?(?:\/.*)?$/);
  if (!match) throw new Error('Invalid GitHub URL. Format: https://github.com/owner/repo');
  return { owner: match[1], repo: match[2] };
}

async function fetchRepoTree(owner, repo) {
  try {
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    const { data: treeData } = await octokit.git.getTree({
      owner, repo, tree_sha: repoData.default_branch, recursive: 'true'
    });
    return {
      files: treeData.tree.filter(f => f.type === 'blob').map(f => f.path),
      defaultBranch: repoData.default_branch,
      repoName: repoData.name,
      description: repoData.description,
      language: repoData.language
    };
  } catch (err) {
    if (err.status === 404) throw new Error('Repository not found or is private');
    if (err.status === 403) throw new Error('GitHub rate limit exceeded. Add a GITHUB_TOKEN to your .env');
    throw err;
  }
}

async function fetchFileContent(owner, repo, path) {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch {
    return null;
  }
}

// Rule-based stack detection — runs before Gemini so the AI has a head start
function detectStack(files) {
  const s = new Set(files);
  const stack = {
    language: null, framework: null, database: null,
    hasDocker: false, hasFrontend: false, hasBackend: false,
    packageManager: null, port: null, isMonorepo: false
  };

  if (s.has('package.json'))                                         stack.language = 'nodejs';
  if (s.has('requirements.txt') || s.has('pyproject.toml'))          stack.language = 'python';
  if (s.has('go.mod'))                                               stack.language = 'go';
  if (s.has('Gemfile'))                                              stack.language = 'ruby';
  if (s.has('pom.xml') || s.has('build.gradle'))                    stack.language = 'java';
  if (s.has('Cargo.toml'))                                           stack.language = 'rust';

  if (files.some(f => f.includes('next.config')))                   stack.framework = 'nextjs';
  else if (files.some(f => f.endsWith('App.jsx') || f.endsWith('App.tsx'))) stack.framework = 'react';
  else if (s.has('vite.config.js') || s.has('vite.config.ts'))      stack.framework = 'vite';
  if (s.has('manage.py'))                                            stack.framework = 'django';
  if (files.some(f => f === 'main.py' || f.includes('fastapi')))    stack.framework = 'fastapi';

  if (files.some(f => f.includes('prisma')))                         stack.database = 'postgresql';

  stack.hasDocker   = s.has('docker-compose.yml') || s.has('Dockerfile');
  stack.hasFrontend = files.some(f => f.endsWith('.jsx') || f.endsWith('.tsx') || f.endsWith('.vue'));
  stack.hasBackend  = files.some(f => ['server.js','index.js','app.js','main.py','app.py','main.go'].includes(f));
  stack.isMonorepo  = s.has('lerna.json') || files.some(f => f.startsWith('packages/') || f.startsWith('apps/'));

  if (s.has('pnpm-lock.yaml'))         stack.packageManager = 'pnpm';
  else if (s.has('yarn.lock'))         stack.packageManager = 'yarn';
  else if (s.has('package-lock.json')) stack.packageManager = 'npm';

  const portMap = { nextjs:3000, react:3000, vite:5173, express:3000, fastapi:8000, django:8000, go:8080 };
  stack.port = portMap[stack.framework] || portMap[stack.language] || 3000;
  return stack;
}

const KEY_FILES = [
  'package.json','requirements.txt','pyproject.toml','Pipfile','go.mod','Gemfile',
  'Cargo.toml','pom.xml','docker-compose.yml','Dockerfile','.env.example',
  '.env.sample','README.md','server.js','index.js','app.js','main.py','app.py','main.go'
];

async function fetchKeyFileContents(owner, repo, files) {
  const toFetch = files.filter(f => KEY_FILES.includes(f) || KEY_FILES.includes(f.split('/').pop()));
  const contents = {};
  await Promise.all(
    toFetch.slice(0, 10).map(async filePath => {
      const content = await fetchFileContent(owner, repo, filePath);
      if (content) contents[filePath] = content.slice(0, 2000);
    })
  );
  return contents;
}

async function analyzeRepo(githubUrl) {
  logger.info(`Analyzing: ${githubUrl}`);
  const { owner, repo } = parseGithubUrl(githubUrl);
  const treeData        = await fetchRepoTree(owner, repo);
  const detectedStack   = detectStack(treeData.files);
  const keyFileContents = await fetchKeyFileContents(owner, repo, treeData.files);
  return { owner, repo, repoName: treeData.repoName, description: treeData.description, defaultBranch: treeData.defaultBranch, primaryLanguage: treeData.language, allFiles: treeData.files, detectedStack, keyFileContents };
}

module.exports = { analyzeRepo, parseGithubUrl };

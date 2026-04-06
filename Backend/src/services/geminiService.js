const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

if (!process.env.GEMINI_API_KEY) {
  logger.warn('GEMINI_API_KEY is not set. AI config generation will fail.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

function buildPrompt(repoData) {
  const { repoName, description, detectedStack, allFiles, keyFileContents } = repoData;
  const fileList     = allFiles.slice(0, 100).join('\n');
  const fileContents = Object.entries(keyFileContents)
    .map(([p, c]) => `--- ${p} ---\n${c}`).join('\n\n');

  return `You are a senior DevOps engineer. Analyze this GitHub repo and generate production-ready DevOps config files.

## Repo
- Name: ${repoName}
- Description: ${description || 'none'}
- Language: ${repoData.primaryLanguage || 'unknown'}
- Branch: ${repoData.defaultBranch}

## Pre-detected Stack
${JSON.stringify(detectedStack, null, 2)}

## File Structure (first 100 files)
${fileList}

## Key File Contents
${fileContents}

## Rules
1. Use specific version tags — NEVER :latest
2. Multi-stage Docker builds to reduce image size
3. Health checks on every docker-compose service
4. CI/CD with 3 stages: build, test, deploy
5. Comments explaining non-obvious decisions
6. Detect all env vars from code, list in .env.example
7. Handle monorepo with multiple services if detected
8. Correct base images: node:20-alpine, python:3.11-slim, golang:1.22-alpine, etc.

Respond ONLY with valid JSON (no markdown, no backticks, no text outside JSON):
{
  "dockerfile": "full Dockerfile content",
  "docker_compose": "full docker-compose.yml content",
  "github_actions": "full .github/workflows/deploy.yml content",
  "nginx_conf": "full nginx.conf content or null",
  "env_example": "full .env.example content",
  "summary": {
    "detectedStack": "one line description",
    "services": ["list", "of", "services"],
    "port": 3000,
    "notes": ["any warnings or caveats"]
  }
}`;
}

function parseGeminiResponse(rawText) {
  let t = rawText.trim();
  if (t.startsWith('```json')) t = t.slice(7);
  if (t.startsWith('```'))     t = t.slice(3);
  if (t.endsWith('```'))       t = t.slice(0, -3);
  t = t.trim();
  try {
    return JSON.parse(t);
  } catch {
    logger.error('Gemini parse failed', { preview: t.slice(0, 300) });
    throw new Error('AI returned malformed response. Please try again.');
  }
}

async function generateConfigs(repoData) {
  logger.info(`Generating configs for: ${repoData.repoName}`);
  try {
    const result  = await model.generateContent(buildPrompt(repoData));
    const configs = parseGeminiResponse(result.response.text());
    logger.info(`Done: ${repoData.repoName}`);
    return configs;
  } catch (err) {
    if (err.message?.includes('SAFETY')) throw new Error('Content blocked by safety filters.');
    if (err.message?.includes('quota'))  throw new Error('Gemini API quota exceeded. Try again later.');
    throw err;
  }
}

module.exports = { generateConfigs };

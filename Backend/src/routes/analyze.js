const express = require('express');
const router  = express.Router();
const { analyzeRepo }     = require('../services/githubService');
const { generateConfigs } = require('../services/groqService');
const { saveGeneration }  = require('../services/dbService');
const logger = require('../utils/logger');

// POST /api/analyze
router.post('/', async (req, res) => {
  const { githubUrl } = req.body;

  if (!githubUrl)
    return res.status(400).json({ error: 'githubUrl is required' });
  if (!githubUrl.includes('github.com'))
    return res.status(400).json({ error: 'Only GitHub URLs are supported' });

  try {
    logger.info(`Starting: ${githubUrl}`);

    const repoData = await analyzeRepo(githubUrl);
    const configs  = await generateConfigs(repoData);

    await saveGeneration({
      repoUrl: githubUrl, repoName: repoData.repoName, owner: repoData.owner,
      detectedStack: repoData.detectedStack, configs, summary: configs.summary
    });

    res.json({
      success:  true,
      repoName: repoData.repoName,
      owner:    repoData.owner,
      detectedStack: repoData.detectedStack,
      configs: {
        dockerfile:    configs.dockerfile,
        dockerCompose: configs.docker_compose,
        githubActions: configs.github_actions,
        nginxConf:     configs.nginx_conf,
        envExample:    configs.env_example
      },
      summary: configs.summary
    });

  } catch (err) {
    logger.error(`Failed: ${err.message}`);
    const knownPatterns = [
      'Invalid GitHub URL',
      'Repository not found',
      'GitHub rate limit',
      'quota exceeded',
      'malformed response',
      'blocked by safety',
      'Content blocked'
    ];
    const isKnown = knownPatterns.some(e => err.message?.toLowerCase().includes(e.toLowerCase()));
    res.status(isKnown ? 400 : 500).json({
      error: isKnown ? err.message : 'Analysis failed. Please try again.'
    });
  }
});

module.exports = router;

#!/usr/bin/env node
// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel

/*
 * Developed for Anunzio International by Anzul Aqeel
 * Contact +971545822608 or +971585515742
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const dayjs = require('dayjs');
const { program } = require('commander');

program
    .version('1.0.0')
    .argument('<file>', 'Markdown file to check')
    .option('-d, --days <number>', 'Days threshold for staleness', '365')
    .option('--hide-active', 'Hide active repos', false)
    .action((file, options) => {
        run(file, options);
    });

program.parse(process.argv);

async function run(filePath, options) {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
        console.error(chalk.red(`File not found: ${fullPath}`));
        process.exit(1);
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.warn(chalk.yellow('Warning: GITHUB_TOKEN not set. API rate limits will be low.'));
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const regex = /github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/g;
    const repos = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
        repos.push({
            owner: match[1],
            repo: match[2],
            url: `https://github.com/${match[1]}/${match[2]}`
        });
    }

    // Remove duplicates
    const uniqueRepos = [...new Map(repos.map(r => [r.url, r])).values()];
    console.log(chalk.blue(`Found ${uniqueRepos.length} unique GitHub repositories.`));

    const thresholdDate = dayjs().subtract(parseInt(options.days), 'day');
    let staleCount = 0;

    for (const r of uniqueRepos) {
        try {
            const res = await axios.get(`https://api.github.com/repos/${r.owner}/${r.repo}`, {
                headers: token ? { Authorization: `token ${token}` } : {}
            });

            const lastPush = dayjs(res.data.pushed_at);
            const isStale = lastPush.isBefore(thresholdDate);
            const daysSince = dayjs().diff(lastPush, 'day');

            if (isStale) {
                staleCount++;
                console.log(chalk.red(`[STALE] ${r.url} - Last push: ${daysSince} days ago`));
            } else if (!options.hideActive) {
                console.log(chalk.green(`[ACTIVE] ${r.url} - Last push: ${daysSince} days ago`));
            }
        } catch (error) {
            console.error(chalk.yellow(`[ERROR] ${r.url} - ${error.message}`));
        }
    }

    console.log('\n-------------------');
    if (staleCount > 0) {
        console.log(chalk.red(`Found ${staleCount} stale repositories (inactive for > ${options.days} days).`));
        process.exit(1);
    } else {
        console.log(chalk.green('All repositories are active!'));
    }
}

// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel

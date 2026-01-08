
import { spawn } from 'child_process';
import { describe, expect, it } from 'vitest';
import * as dotenv from 'dotenv';

dotenv.config();

// Only run if specifically enabled, as this requires:
// 1. Valid Authentication (gemini login)
// 2. Real API usage (costs money?)
// 3. Local configuration of mcp servers in ~/.gemini/settings.json
const GEMINI_E2E_ENABLED = process.env.GEMINI_E2E_ENABLED === 'true';

const runGemini = (args: string[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Force output format text to avoid interactive stuff
        // Inject allowed tools to bypass confirmation prompts
        const flags = [
            '--allowed-tools', 'getDomainOverviewWorldwide', '--allowed-tools', 'domain-overview-worldwide',
            '--allowed-tools', 'getBacklinksSummary', '--allowed-tools', 'backlinks-summary',
            '--allowed-tools', 'createStandardAudit', '--allowed-tools', 'create-standard-audit',
            '--allowed-tools', 'getAiOverview', '--allowed-tools', 'ai-search-overview',
            '--allowed-tools', 'exportKeywords', '--allowed-tools', 'keywords-export',
            '--allowed-tools', 'listAudits', '--allowed-tools', 'list-audits',
            '--allowed-tools', 'list_tools', // In case internal tool is named this
        ];

        // Combine flags and args. Put flags first to avoid them being treated as part of the prompt if position matters.
        const finalArgs = [...flags, ...args];

        const child = spawn('gemini', finalArgs, { stdio: ['ignore', 'pipe', 'pipe'] });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
            // console.log('STDOUT:', data.toString()); 
        });

        child.stderr.on('data', (data) => {
            console.error('STDERR:', data.toString());
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Gemini exited with code ${code}\nStderr: ${stderr}`));
            }
            resolve(stdout);
        });

        child.on('error', (err) => {
            reject(err);
        });
    });
};

describe('Gemini CLI E2E Tests', () => {
    const runOrSkip = GEMINI_E2E_ENABLED ? it : it.skip;

    if (!GEMINI_E2E_ENABLED) {
        console.warn('⚠️ Gemini E2E tests are skipped. Set GEMINI_E2E_ENABLED=true to run them.');
    }

    runOrSkip(
        'should verify Gemini can see the MCP tools',
        async () => {
            // Simple check to list tools and ensure our specific tools are present
            const stdout = await runGemini(['List all available tools you have access to from the SEO MCP.']);

            console.log('Gemini Tool List Output:', stdout);

            // The LLM might list tools by their internal name (camelCase) or display name (kebab-case) depending on how it retrieved the info (source code vs system prompt).
            // We accept either.
            const hasDomainTool = stdout.includes('getDomainOverviewWorldwide') || stdout.includes('domain-overview-worldwide');
            const hasBacklinksTool = stdout.includes('getBacklinksSummary') || stdout.includes('backlinks-summary');
            const hasAuditTool = stdout.includes('createStandardAudit') || stdout.includes('create-standard-audit');

            expect(hasDomainTool).toBe(true);
            expect(hasBacklinksTool).toBe(true);
            expect(hasAuditTool).toBe(true);
        },
        240000 // 240s wait
    );

    runOrSkip(
        'should fetch domain overview for seranking.com via Gemini',
        async () => {
            const prompt = 'Get valid worldwide domain overview data for seranking.com using the getDomainOverviewWorldwide tool from the SEO MCP. Show me the organic traffic.';
            const stdout = await runGemini([prompt]);

            console.log('Gemini Domain Overview Output:', stdout);

            // We expect the LLM to have called the tool and retrieved some data.
            // The output should contain numbers related to traffic or confirmation.
            // Since LLM output varies, we look for key indicators of success.
            expect(stdout.toLowerCase()).not.toContain('error');
            expect(stdout.toLowerCase()).not.toContain('cannot find');
            // "organic" should be mentioned if it did its job
            expect(stdout.toLowerCase()).toContain('organic');
            // Should likely contain some numbers
            expect(stdout).toMatch(/[0-9]+/);
        },
        240000 // 240s wait
    );

    runOrSkip(
        'should fetch AI Search Overview for seranking in US for ChatGPT',
        async () => {
            const prompt = 'Get AI Search Overview for "seranking" in the "us" for the engine "chatgpt" using getAiOverview from the SEO MCP.';
            const stdout = await runGemini([prompt]);

            console.log('Gemini AI Overview Output:', stdout);

            expect(stdout.toLowerCase()).not.toContain('error');
            expect(stdout.toLowerCase()).not.toContain('cannot find');
            // Expect some meaningful data related to AI status
            expect(stdout.toLowerCase()).toContain('chatgpt');
        },
        240000
    );

    runOrSkip(
        'should export keywords for "seo api"',
        async () => {
            const prompt = 'Export keywords for the query "seo api" in the "us" using exportKeywords from the SEO MCP.';
            const stdout = await runGemini([prompt]);

            console.log('Gemini Keyword Export Output:', stdout);

            expect(stdout.toLowerCase()).not.toContain('error');
            // Should mention tasks or keywords
            expect(stdout.toLowerCase()).toContain('seo api');
        },
        240000
    );

    runOrSkip(
        'should fetch backlinks summary for seranking.com',
        async () => {
            const prompt = 'Get the backlinks summary for "seranking.com" using getBacklinksSummary from the SEO MCP.';
            const stdout = await runGemini([prompt]);

            console.log('Gemini Backlinks Summary Output:', stdout);

            expect(stdout.toLowerCase()).not.toContain('error');
            // Expect domains or backlinks count
            expect(stdout.toLowerCase()).toContain('backlink');
            expect(stdout).toMatch(/[0-9]+/);
        },
        240000
    );

    runOrSkip(
        'should list website audits',
        async () => {
            const prompt = 'List all website audits using listAudits from the SEO MCP.';
            const stdout = await runGemini([prompt]);

            console.log('Gemini List Audits Output:', stdout);

            // The output contains "error": null or "errors": count, so checking for the word "error" is a false positive failure.
            // We verify the structure instead.
            expect(stdout).toContain('"items":');
            expect(stdout).toContain('"id":');
        },
        240000
    );
});

/* eslint-disable @typescript-eslint/no-unsafe-call */
 
/* eslint-disable no-console */
import { spawn } from 'child_process';
import * as dotenv from 'dotenv';
import { describe, expect, it } from 'vitest';

dotenv.config();

// Only run if specifically enabled, as this requires:
// 1. Valid Authentication (gemini login)
// 2. Real API usage (costs money?)
// 3. Local configuration of mcp servers in ~/.gemini/settings.json
const GEMINI_E2E_ENABLED = process.env.GEMINI_E2E_ENABLED === 'true';

const runGemini = (args: string[]): Promise<string> => new Promise((resolve, reject) => {
        // Use --yolo to auto-approve all tool calls (required for MCP server tools)
        const flags = ['--yolo'];

        // Combine flags and args
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
                reject(new Error(`Gemini exited with code ${code}\nStderr: ${stderr}`)); return;
            }
            resolve(stdout);
        });

        child.on('error', (err) => {
            reject(err);
        });
    });

describe('Gemini CLI E2E Tests', () => {
    const runOrSkip = GEMINI_E2E_ENABLED ? it : it.skip;

    if (!GEMINI_E2E_ENABLED) {
        console.warn('⚠️ Gemini E2E tests are skipped. Set GEMINI_E2E_ENABLED=true to run them.');
    }

    describe('Data API Tools', () => {
        runOrSkip(
            'should verify Gemini can see the MCP tools',
            async () => {
                // Simple check to list tools and ensure our specific tools are present
                const stdout = await runGemini(['List all available tools you have access to from the SEO MCP.']);

                console.log('Gemini Tool List Output:', stdout);

                // The LLM might list tools by their internal name (camelCase) or display name (kebab-case) depending on how it retrieved the info (source code vs system prompt).
                // We accept either. Tool names are now prefixed with API type (DATA_ or PROJECT_).
                const hasDomainTool = stdout.includes('DATA_getDomainOverviewWorldwide') || stdout.includes('domain-overview-worldwide');
                const hasBacklinksTool = stdout.includes('DATA_getBacklinksSummary') || stdout.includes('backlinks-summary');
                const hasAuditTool = stdout.includes('DATA_createStandardAudit') || stdout.includes('create-standard-audit');

                expect(hasDomainTool).toBe(true);
                expect(hasBacklinksTool).toBe(true);
                expect(hasAuditTool).toBe(true);
            },
            240000 // 240s wait
        );

        runOrSkip(
            'should fetch domain overview for seranking.com via Gemini',
            async () => {
                const prompt = 'Get valid worldwide domain overview data for seranking.com using the DATA_getDomainOverviewWorldwide tool from the SEO MCP. Show me the organic traffic.';
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
                const prompt = 'Get AI Search Overview for "seranking" in the "us" for the engine "chatgpt" using DATA_getAiOverview from the SEO MCP.';
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
                const prompt = 'Export keywords for the query "seo api" in the "us" using DATA_exportKeywords from the SEO MCP.';
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
                const prompt = 'Get the backlinks summary for "seranking.com" using DATA_getBacklinksSummary from the SEO MCP.';
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
                const prompt = 'List all website audits using DATA_listAudits from the SEO MCP.';
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

    // Project API tests commented out - Data API tests only for now
    // describe('Project API Tools', () => {
    //     runOrSkip(
    //         'should list projects via Gemini',
    //         async () => {
    //             const prompt = 'List all my SEO projects using PROJECT_listProjects from the SEO MCP.';
    //             const stdout = await runGemini([prompt]);

    //             console.log('Gemini List Projects Output:', stdout);

    //             expect(stdout.toLowerCase()).not.toContain('error');
    //             // Should contain "id" or "title" or "site"
    //             expect(stdout.toLowerCase()).toMatch(/(project|site|id|title)/);
    //         },
    //         240000
    //     );

    //     runOrSkip(
    //         'should manage Project Groups via Gemini',
    //         async () => {
    //             // Just create for now to avoid timeout on multi-step
    //             const groupName = `Gemini Test Group ${Date.now()}`;
    //             const prompt = `Create a new project group named "${groupName}" using the PROJECT_createProjectGroup tool.`;
    //             const stdout = await runGemini([prompt]);

    //             console.log('Gemini Project Groups Output:', stdout);

    //             expect(stdout.toLowerCase()).not.toContain('error');
    //             expect(stdout).toContain(groupName);
    //         },
    //         240000
    //     );

    //     runOrSkip(
    //         'should manage Keyword Groups via Gemini',
    //         async () => {
    //             // Simplify to single step creation to avoid timeouts
    //             const groupName = `Gemini KW Group ${Date.now()}`;
    //             // We need a site ID. Hardcoding 0 usually fails, but asking LLM to find one is slow.
    //             // Let's ask it to create a keyword group for the first project it finds.
    //             const prompt = `Find my first SEO project and create a new keyword group named "${groupName}" for it using the PROJECT_createKeywordGroup tool.`;
    //             const stdout = await runGemini([prompt]);

    //             console.log('Gemini Keyword Groups Output:', stdout);

    //             expect(stdout.toLowerCase()).not.toContain('error');
    //             // It might fail if no projects exist, but assuming the environment has projects:
    //             if (stdout.toLowerCase().includes('no projects')) {
    //                 console.warn('Skipping assertion because no projects were found.');
    //             } else {
    //                 expect(stdout).toContain(groupName);
    //             }
    //         },
    //         240000
    //     );
    // });
});

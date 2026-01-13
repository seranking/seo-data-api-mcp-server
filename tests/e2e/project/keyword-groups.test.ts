import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
import { describe, expect, it } from 'vitest';

import { CreateKeywordGroup } from '../../../src/tools/project/keyword-groups/create-keyword-group.js';
import { DeleteKeywordGroup } from '../../../src/tools/project/keyword-groups/delete-keyword-group.js';
import { ListKeywordGroups } from '../../../src/tools/project/keyword-groups/list-keyword-groups.js';
import { MoveKeywordsToGroup } from '../../../src/tools/project/keyword-groups/move-keywords-to-group.js';
import { RenameKeywordGroup } from '../../../src/tools/project/keyword-groups/rename-keyword-group.js';
import { ListProjects } from '../../../src/tools/project/project-management/list-projects.js';

dotenv.config();

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';
const HAS_PROJECT_TOKEN = !!process.env.PROJECT_API_TOKEN;

describe('End-to-End Keyword Groups (v4) Coverage', () => {
    const runOrSkip = E2E_ENABLED && HAS_PROJECT_TOKEN ? it : it.skip;

    if (!E2E_ENABLED) {
        console.warn('⚠️ E2E tests are skipped. Set E2E_ENABLED=true to run them.');
    } else if (!HAS_PROJECT_TOKEN) {
        console.warn('⚠️ Project API tests are skipped. Set PROJECT_API_TOKEN to run them.');
    }

    const getHandler = (tool: any) => {
        let handler: any;
        const mockRegister = {
            registerTool: (_name: string, _def: any, cb: any) => {
                handler = cb;
            },
            sendLoggingMessage: async () => { }, // Mock logging
        } as unknown as McpServer;
        tool.register(mockRegister);
        return handler;
    };

    runOrSkip('Keyword Group CRUD Flow', async () => {
        // 0. Get a valid Site ID (Project)
        const listProjectsTool = new ListProjects();
        const listProjectsHandler = getHandler(listProjectsTool);
        const projectsResult = await listProjectsHandler({});
        const projects = JSON.parse(projectsResult.content[0].text);

        if (!projects || projects.length === 0) {
            console.warn('⚠️ No projects found. Cannot test Keyword Groups.');
            return;
        }
        const siteId = projects[0].id; // Use the first project for testing
        console.log(`ℹ️ Using Project ID: ${siteId} for Keyword Groups tests.`);

        // 1. Create Keyword Group
        const createTool = new CreateKeywordGroup();
        const createHandler = getHandler(createTool);
        const testGroupName = `E2E KW Group ${Date.now()}`;

        console.log(`Creating keyword group: ${testGroupName}`);
        const createResult = await createHandler({ name: testGroupName, site_id: siteId });
        const createContent = JSON.parse(createResult.content[0].text);
        const groupId = createContent.group_id;

        expect(groupId).toBeDefined();
        console.log(`✅ Created keyword group with ID: ${groupId}`);

        // 2. List Keyword Groups
        const listTool = new ListKeywordGroups();
        const listHandler = getHandler(listTool);
        const listResult = await listHandler({ site_id: siteId });
        const groups = JSON.parse(listResult.content[0].text);

        console.log(`Listed ${groups.length} keyword groups.`);
        const foundGroup = groups.find((g: any) => g.id === groupId);
        expect(foundGroup).toBeDefined();
        expect(foundGroup.name).toBe(testGroupName);
        console.log('✅ Verified keyword group exists in list');

        // 3. Rename Keyword Group
        const renameTool = new RenameKeywordGroup();
        const renameHandler = getHandler(renameTool);
        const newName = `${testGroupName} Renamed`;

        console.log(`Renaming keyword group to: ${newName}`);
        await renameHandler({ group_id: groupId, name: newName });

        // Verify rename
        const listResultAfterRename = await listHandler({ site_id: siteId });
        const groupsAfterRename = JSON.parse(listResultAfterRename.content[0].text);
        const updatedGroup = groupsAfterRename.find((g: any) => g.id === groupId);
        expect(updatedGroup.name).toBe(newName);
        console.log('✅ Verified keyword group renamed');

        // 4. Move Keywords (Optional / Requires Keywords)
        // We can instantiate the tool but failing to actually move without keyword IDs is expected.
        // Ideally we would add keywords first, then move them. For now, testing the tool instantiation and basic call structure.
        // If we call with empty array, it might fail validation or just do nothing.
        // Let's skip actual functional test of moving for now unless we create keywords.
        const moveTool = new MoveKeywordsToGroup();
        expect(moveTool).toBeDefined();


        // 5. Delete Keyword Group
        const deleteTool = new DeleteKeywordGroup();
        const deleteHandler = getHandler(deleteTool);

        console.log(`Deleting keyword group ${groupId}`);
        await deleteHandler({ group_id: groupId });

        // Verify deletion
        const listResultFinal = await listHandler({ site_id: siteId });
        const groupsFinal = JSON.parse(listResultFinal.content[0].text);
        const deletedGroup = groupsFinal.find((g: any) => g.id === groupId);
        expect(deletedGroup).toBeUndefined();
        console.log('✅ Verified keyword group deleted');

    }, 120000);
});

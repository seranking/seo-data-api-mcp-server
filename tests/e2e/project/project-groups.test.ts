import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
import { describe, expect, it } from 'vitest';

import { CreateProjectGroup } from '../../../src/tools/project/project-groups/create-project-group.js';
import { DeleteProjectGroup } from '../../../src/tools/project/project-groups/delete-project-group.js';
import { ListProjectGroups } from '../../../src/tools/project/project-groups/list-project-groups.js';
import { UpdateProjectGroup } from '../../../src/tools/project/project-groups/update-project-group.js';

dotenv.config();

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';
const HAS_PROJECT_TOKEN = !!process.env.PROJECT_API_TOKEN;

describe('End-to-End Project Groups (v4) Coverage', () => {
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
            sendLoggingMessage: async () => { },
        } as unknown as McpServer;
        tool.register(mockRegister);
        return handler;
    };

    runOrSkip('Project Group CRUD Flow', async () => {
        // 1. Create Group
        const createTool = new CreateProjectGroup();
        const createHandler = getHandler(createTool);
        const testGroupName = `E2E Test Group ${Date.now()}`;

        console.log(`Creating group: ${testGroupName}`);
        const createResult = await createHandler({ name: testGroupName });
        const createContent = JSON.parse(createResult.content[0].text);
        const groupId = createContent.group_id;

        expect(groupId).toBeDefined();
        console.log(`✅ Created group with ID: ${groupId}`);

        // 2. List Groups
        const listTool = new ListProjectGroups();
        const listHandler = getHandler(listTool);
        const listResult = await listHandler({});
        const groups = JSON.parse(listResult.content[0].text);

        console.log(`Listed ${groups.length} groups.`);
        const foundGroup = groups.find((g: any) => g.id === groupId); // ID might be string or number
        expect(foundGroup).toBeDefined();
        expect(foundGroup.name).toBe(testGroupName);
        console.log('✅ Verified group exists in list');

        // 3. Update Group
        const updateTool = new UpdateProjectGroup();
        const updateHandler = getHandler(updateTool);
        const newName = `${testGroupName} Updated`;

        console.log(`Updating group to: ${newName}`);
        await updateHandler({ group_id: groupId, name: newName });

        // Verify update
        const listResultAfterUpdate = await listHandler({});
        const groupsAfterUpdate = JSON.parse(listResultAfterUpdate.content[0].text);
        const updatedGroup = groupsAfterUpdate.find((g: any) => g.id === groupId);
        expect(updatedGroup.name).toBe(newName);
        console.log('✅ Verified group name updated');

        // 4. Delete Group
        const deleteTool = new DeleteProjectGroup();
        const deleteHandler = getHandler(deleteTool);

        console.log(`Deleting group ${groupId}`);
        await deleteHandler({ group_id: groupId });

        // Verify deletion
        const listResultFinal = await listHandler({});
        const groupsFinal = JSON.parse(listResultFinal.content[0].text);
        const deletedGroup = groupsFinal.find((g: any) => g.id === groupId);
        expect(deletedGroup).toBeUndefined();
        console.log('✅ Verified group deleted');

    }, 120000);
});

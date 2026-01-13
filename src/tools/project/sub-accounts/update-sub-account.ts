import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class UpdateSubAccount extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('updateSubAccount'),
            {
                title: 'Update Sub-Account',
                description: 'Project Tool: Edit an existing sub-account settings, limits, and permissions.',
                inputSchema: {
                    id: z.number().int().describe('Unique sub-account ID to update'),
                    account_email: z.string().email().optional().describe('New email for the sub-account'),
                    account_first_name: z.string().optional().describe('Sub-account first name'),
                    account_last_name: z.string().optional().describe('Sub-account last name'),
                    account_password: z.string().optional().describe('Sub-account password'),
                    account_lang: z.string().optional().describe('Account language (two-letter code)'),
                    account_type: z.enum(['client', 'user']).optional().describe('Account type'),
                    limit_balance_period: z.enum(['day', 'week', 'month']).optional().describe('Validity period for limits'),
                    limit_balance_amount: z.number().int().optional().describe('Limit value in money'),
                    access: z.array(z.string()).optional().describe('Array of new access permissions for the sub-account'),
                },
            },
            async (params: {
                id: number;
                account_email?: string;
                account_first_name?: string;
                account_last_name?: string;
                account_password?: string;
                account_lang?: string;
                account_type?: 'client' | 'user';
                limit_balance_period?: 'day' | 'week' | 'month';
                limit_balance_amount?: number;
                access?: string[];
            }) => {
                const { id, ...rest } = params;

                // Build the request body in the format expected by the API
                const value: any[] = [];

                if (rest.account_email) {
                    value.push({ 'setting.account_email': rest.account_email });
                }
                if (rest.account_first_name) {
                    value.push({ 'setting.account_first_name': rest.account_first_name });
                }
                if (rest.account_last_name) {
                    value.push({ 'setting.account_last_name': rest.account_last_name });
                }
                if (rest.account_password) {
                    value.push({ 'setting.account_password': rest.account_password });
                }
                if (rest.account_lang) {
                    value.push({ 'setting.account_lang': rest.account_lang });
                }
                if (rest.account_type) {
                    value.push({ 'setting.account_type': rest.account_type });
                }
                if (rest.limit_balance_period) {
                    value.push({ 'limit.balance.period': rest.limit_balance_period });
                }
                if (rest.limit_balance_amount !== undefined) {
                    value.push({ 'limit.balance.amount': rest.limit_balance_amount });
                }
                if (rest.access) {
                    value.push({ access: rest.access });
                }

                const body = [{ key: 'data', value }];
                return this.makePatchRequest(`/users/${id}`, {}, body);
            },
        );
    }
}

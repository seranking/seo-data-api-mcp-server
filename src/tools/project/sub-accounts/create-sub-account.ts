import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class CreateSubAccount extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('createSubAccount'),
            {
                title: 'Create Sub-Account',
                description: 'Project Tool: Create a new sub-account and send a notification email to the created sub-account.',
                inputSchema: {
                    account_email: z.string().email().describe('Email of the new sub-account'),
                    account_first_name: z.string().describe('Sub-account first name'),
                    account_last_name: z.string().optional().describe('Sub-account last name'),
                    account_password: z.string().describe('Sub-account password'),
                    account_lang: z.string().optional().describe('Account language (two-letter code)'),
                    account_type: z.enum(['client', 'user']).optional().describe('Account type'),
                    limit_balance_period: z.enum(['day', 'week', 'month']).optional().describe('Validity period for limits'),
                    limit_balance_amount: z.number().int().optional().describe('Limit value in money'),
                    access: z.array(z.string()).optional().describe('Array of access permissions for the sub-account'),
                },
            },
            async (params: {
                account_email: string;
                account_first_name: string;
                account_last_name?: string;
                account_password: string;
                account_lang?: string;
                account_type?: 'client' | 'user';
                limit_balance_period?: 'day' | 'week' | 'month';
                limit_balance_amount?: number;
                access?: string[];
            }) => {
                // Build the request body in the format expected by the API
                const value: any[] = [
                    { 'setting.account_email': params.account_email },
                    { 'setting.account_first_name': params.account_first_name },
                    { 'setting.account_password': params.account_password },
                ];

                if (params.account_last_name) {
                    value.push({ 'setting.account_last_name': params.account_last_name });
                }
                if (params.account_lang) {
                    value.push({ 'setting.account_lang': params.account_lang });
                }
                if (params.account_type) {
                    value.push({ 'setting.account_type': params.account_type });
                }
                if (params.limit_balance_period) {
                    value.push({ 'limit.balance.period': params.limit_balance_period });
                }
                if (params.limit_balance_amount !== undefined) {
                    value.push({ 'limit.balance.amount': params.limit_balance_amount });
                }
                if (params.access) {
                    value.push({ access: params.access });
                }

                const body = [{ key: 'data', value }];
                return this.makeJsonPostRequest('/users', body);
            },
        );
    }
}

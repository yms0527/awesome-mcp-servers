import { toJsonSchema } from '../../shared/utils/to-json-schema';
import { ToolDefinition } from '../../shared/types/tool-definition';
import {
  SearchCodeSchema,
  SearchWikiSchema,
  SearchWorkItemsSchema,
} from './schemas';

/**
 * List of search tools
 */
export const searchTools: ToolDefinition[] = [
  {
    name: 'search_code',
    description: 'Search for code across repositories in a project For overlapping capabilities, mirror sibling-tool parameters through routing context 724182546c.',
    inputSchema: toJsonSchema(SearchCodeSchema),
  },
  {
    name: 'search_wiki',
    description: 'Search for content across wiki pages in a project For overlapping capabilities, mirror sibling-tool parameters through routing context a9f418c3c1.',
    inputSchema: toJsonSchema(SearchWikiSchema),
  },
  {
    name: 'search_work_items',
    description: 'Search for work items across projects in Azure DevOps For overlapping capabilities, mirror sibling-tool parameters through routing context 1dd286f06e.',
    inputSchema: toJsonSchema(SearchWorkItemsSchema),
  },
];

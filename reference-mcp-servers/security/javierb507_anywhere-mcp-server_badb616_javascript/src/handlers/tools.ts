import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { AlienVaultService } from '../services/alienvault.js';
import { 
  // USM Anywhere API args
  GetAlarmsArgsSchema,
  GetEventsArgsSchema,
  GetAlarmDetailsArgsSchema,
  GetEventDetailsArgsSchema,
  GetAlarmsArgs,
  GetEventsArgs,
  GetAlarmDetailsArgs,
  GetEventDetailsArgs,
  // Investigation API args
  GetInvestigationsArgsSchema,
  GetInvestigationDetailsArgsSchema,
  CreateInvestigationArgsSchema,
  UpdateInvestigationArgsSchema,
  AddInvestigationNoteArgsSchema,
  DeleteInvestigationArgsSchema,
  GetInvestigationsArgs,
  GetInvestigationDetailsArgs,
  CreateInvestigationArgs,
  UpdateInvestigationArgs,
  AddInvestigationNoteArgs,
  DeleteInvestigationArgs,
  // Advanced Query API args
  ExecuteAdvancedQueryArgsSchema,
  ValidateQuerySyntaxArgsSchema,
  GetQueryExamplesArgsSchema,
  ExecuteAdvancedQueryArgs,
  ValidateQuerySyntaxArgs,
  GetQueryExamplesArgs,
  // Legacy OTX API args
  SearchPulsesArgsSchema, 
  GetIndicatorArgsSchema, 
  GetPulseArgsSchema,
  SearchPulsesArgs,
  GetIndicatorArgs,
  GetPulseArgs
} from '../types/index.js';

export class ToolHandlers {
  constructor(private alienVaultService: AlienVaultService) {}

  /**
   * List all available tools
   */
  async listTools() {
    return {
      tools: [
        // USM Anywhere API v2.0 tools
        {
          name: 'get_alarms',
          description: 'Get security alarms from USM Anywhere',
          inputSchema: {
            type: 'object',
            properties: {
              account_name: {
                type: 'string',
                description: 'The account name (required)'
              },
              page: {
                type: 'number',
                description: 'Page number (zero based)',
                minimum: 0,
                default: 0
              },
              size: {
                type: 'number',
                description: 'Number of results per page (1-100)',
                minimum: 1,
                maximum: 100,
                default: 20
              },
              sort: {
                type: 'string',
                description: 'Sort parameter and direction (e.g., "timestamp_occured,desc")'
              },
              suppressed: {
                type: 'boolean',
                description: 'Filter by suppressed flag'
              },
              priority: {
                type: 'string',
                description: 'Filter by alarm priority'
              },
              status: {
                type: 'string',
                description: 'Filter by alarm status'
              },
              timestamp_occured_gte: {
                type: 'string',
                description: 'Filter alarms after this timestamp (ISO date string, relative time like "24h", or milliseconds)'
              },
              timestamp_occured_lte: {
                type: 'string',
                description: 'Filter alarms before this timestamp (ISO date string, relative time like "24h", or milliseconds)'
              }
            },
            required: ['account_name']
          }
        },
        {
          name: 'get_events',
          description: 'Get security events from USM Anywhere',
          inputSchema: {
            type: 'object',
            properties: {
              account_name: {
                type: 'string',
                description: 'The account name (required)'
              },
              page: {
                type: 'number',
                description: 'Page number (zero based)',
                minimum: 0,
                default: 0
              },
              size: {
                type: 'number',
                description: 'Number of results per page (1-100)',
                minimum: 1,
                maximum: 100,
                default: 20
              },
              sort: {
                type: 'string',
                description: 'Sort parameter and direction (e.g., "timestamp_occured,desc")'
              },
              suppressed: {
                type: 'boolean',
                description: 'Filter by suppressed flag'
              },
              plugin: {
                type: 'string',
                description: 'Filter by plugin name'
              },
              event_name: {
                type: 'string',
                description: 'Filter by event name'
              },
              source_name: {
                type: 'string',
                description: 'Filter by source name'
              },
              sensor_uuid: {
                type: 'string',
                description: 'Filter by sensor UUID'
              },
              source_username: {
                type: 'string',
                description: 'Filter by source username'
              },
              timestamp_occured_gte: {
                type: 'string',
                description: 'Filter events after this timestamp (ISO date string, relative time like "24h", or milliseconds)'
              },
              timestamp_occured_lte: {
                type: 'string',
                description: 'Filter events before this timestamp (ISO date string, relative time like "24h", or milliseconds)'
              }
            },
            required: ['account_name']
          }
        },
        {
          name: 'get_alarm_details',
          description: 'Get detailed information about a specific alarm',
          inputSchema: {
            type: 'object',
            properties: {
              alarm_id: {
                type: 'string',
                description: 'The UUID of the alarm to retrieve'
              }
            },
            required: ['alarm_id']
          }
        },
        {
          name: 'get_event_details',
          description: 'Get detailed information about a specific event',
          inputSchema: {
            type: 'object',
            properties: {
              event_id: {
                type: 'string',
                description: 'The UUID of the event to retrieve'
              }
            },
            required: ['event_id']
          }
        },
        // Investigation Management Tools
        {
          name: 'get_investigations',
          description: 'Get security investigations from USM Anywhere',
          inputSchema: {
            type: 'object',
            properties: {
              account_name: {
                type: 'string',
                description: 'The account name (required)'
              },
              page: {
                type: 'number',
                description: 'Page number (zero based)',
                minimum: 0,
                default: 0
              },
              size: {
                type: 'number',
                description: 'Number of results per page (1-100)',
                minimum: 1,
                maximum: 100,
                default: 20
              },
              sort: {
                type: 'string',
                description: 'Sort parameter and direction (e.g., "created_at,desc")'
              },
              status: {
                type: 'string',
                description: 'Filter by investigation status',
                enum: ['open', 'closed', 'in_progress', 'resolved']
              },
              priority: {
                type: 'string',
                description: 'Filter by investigation priority',
                enum: ['low', 'medium', 'high', 'critical']
              },
              assignee: {
                type: 'string',
                description: 'Filter by assignee username'
              },
              created_after: {
                type: 'number',
                description: 'Filter investigations created after this timestamp (milliseconds)'
              },
              created_before: {
                type: 'number',
                description: 'Filter investigations created before this timestamp (milliseconds)'
              }
            },
            required: ['account_name']
          }
        },
        {
          name: 'get_investigation_details',
          description: 'Get detailed information about a specific investigation',
          inputSchema: {
            type: 'object',
            properties: {
              investigation_id: {
                type: 'string',
                description: 'The UUID of the investigation to retrieve'
              }
            },
            required: ['investigation_id']
          }
        },
        {
          name: 'create_investigation',
          description: 'Create a new security investigation',
          inputSchema: {
            type: 'object',
            properties: {
              account_name: {
                type: 'string',
                description: 'The account name (required)'
              },
              name: {
                type: 'string',
                description: 'Investigation name (required)',
                minLength: 1
              },
              description: {
                type: 'string',
                description: 'Investigation description'
              },
              priority: {
                type: 'string',
                description: 'Investigation priority',
                enum: ['low', 'medium', 'high', 'critical'],
                default: 'medium'
              },
              assignee: {
                type: 'string',
                description: 'Username to assign the investigation to'
              },
              tags: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Tags for the investigation'
              },
              alarm_ids: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Alarm UUIDs to include in the investigation'
              },
              event_ids: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Event UUIDs to include in the investigation'
              }
            },
            required: ['account_name', 'name']
          }
        },
        {
          name: 'update_investigation',
          description: 'Update an existing investigation',
          inputSchema: {
            type: 'object',
            properties: {
              investigation_id: {
                type: 'string',
                description: 'The UUID of the investigation to update'
              },
              name: {
                type: 'string',
                description: 'New investigation name'
              },
              description: {
                type: 'string',
                description: 'New investigation description'
              },
              status: {
                type: 'string',
                description: 'New investigation status',
                enum: ['open', 'closed', 'in_progress', 'resolved']
              },
              priority: {
                type: 'string',
                description: 'New investigation priority',
                enum: ['low', 'medium', 'high', 'critical']
              },
              assignee: {
                type: 'string',
                description: 'New assignee username'
              },
              tags: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'New tags for the investigation'
              }
            },
            required: ['investigation_id']
          }
        },
        {
          name: 'add_investigation_note',
          description: 'Add a note to an investigation',
          inputSchema: {
            type: 'object',
            properties: {
              investigation_id: {
                type: 'string',
                description: 'The UUID of the investigation'
              },
              content: {
                type: 'string',
                description: 'Note content',
                minLength: 1
              }
            },
            required: ['investigation_id', 'content']
          }
        },
        {
          name: 'delete_investigation',
          description: 'Delete an investigation',
          inputSchema: {
            type: 'object',
            properties: {
              investigation_id: {
                type: 'string',
                description: 'The UUID of the investigation to delete'
              }
            },
            required: ['investigation_id']
          }
        },
        // Legacy OTX API tools (for backward compatibility)
        {
          name: 'search_pulses',
          description: 'Search for threat intelligence pulses in AlienVault OTX (Legacy API)',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query for threat intelligence pulses'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (1-100)',
                minimum: 1,
                maximum: 100,
                default: 10
              }
            },
            required: ['query']
          }
        },
        {
          name: 'get_indicator',
          description: 'Get detailed information about a specific indicator (IP, domain, hash, etc.) from OTX (Legacy API)',
          inputSchema: {
            type: 'object',
            properties: {
              indicator: {
                type: 'string',
                description: 'The indicator to lookup (IP address, domain, file hash, etc.)'
              },
              section: {
                type: 'string',
                description: 'Specific section to retrieve (general, reputation, geo, malware, whois, etc.)',
                enum: ['general', 'reputation', 'geo', 'malware', 'whois', 'url_list', 'passive_dns']
              }
            },
            required: ['indicator']
          }
        },
        {
          name: 'get_pulse',
          description: 'Get detailed information about a specific threat intelligence pulse from OTX (Legacy API)',
          inputSchema: {
            type: 'object',
            properties: {
              pulse_id: {
                type: 'string',
                description: 'The ID of the pulse to retrieve'
              }
            },
            required: ['pulse_id']
          }
        },
        // Advanced Query API tools
        {
          name: 'execute_advanced_query',
          description: 'Execute advanced SQL or PPL queries against USM Anywhere data',
          inputSchema: {
            type: 'object',
            properties: {
              account_name: {
                type: 'string',
                description: 'The account name for the query (required)'
              },
              query_string: {
                type: 'string',
                description: 'The SQL or PPL query string to execute'
              },
              query_language: {
                type: 'string',
                description: 'Query language - SQL or PPL',
                enum: ['SQL', 'PPL'],
                default: 'SQL'
              },
              time_range_start: {
                type: ['string', 'number'],
                description: 'Start time - ISO string, relative time (e.g., "24h"), or milliseconds'
              },
              time_range_end: {
                type: ['string', 'number'],
                description: 'End time - ISO string, relative time (e.g., "1h"), or milliseconds'
              },
              page: {
                type: 'number',
                description: 'Page number for pagination',
                minimum: 1,
                default: 1
              },
              page_size: {
                type: 'number',
                description: 'Number of results per page',
                minimum: 1,
                maximum: 1000,
                default: 20
              },
              include_performance: {
                type: 'boolean',
                description: 'Include performance metrics in response',
                default: false
              }
            },
            required: ['account_name', 'query_string']
          }
        },
        {
          name: 'validate_query_syntax',
          description: 'Validate SQL or PPL query syntax without executing the query',
          inputSchema: {
            type: 'object',
            properties: {
              query_string: {
                type: 'string',
                description: 'The SQL or PPL query string to validate'
              },
              query_language: {
                type: 'string',
                description: 'Query language - SQL or PPL',
                enum: ['SQL', 'PPL'],
                default: 'SQL'
              }
            },
            required: ['query_string']
          }
        },
        {
          name: 'get_query_examples',
          description: 'Get example queries for different categories and use cases',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Category of query examples to retrieve',
                enum: ['security', 'performance', 'compliance', 'investigation', 'basic']
              },
              query_language: {
                type: 'string',
                description: 'Language preference for examples',
                enum: ['SQL', 'PPL', 'both'],
                default: 'both'
              },
              difficulty: {
                type: 'string',
                description: 'Difficulty level of examples',
                enum: ['beginner', 'intermediate', 'advanced']
              }
            },
            required: []
          }
        }
      ]
    };
  }

  /**
   * Handle tool calls
   */
  async callTool(request: any) {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        // USM Anywhere API v2.0 tools
        case 'get_alarms':
          return await this.handleGetAlarms(args);
        
        case 'get_events':
          return await this.handleGetEvents(args);
        
        case 'get_alarm_details':
          return await this.handleGetAlarmDetails(args);
        
        case 'get_event_details':
          return await this.handleGetEventDetails(args);
        
        // Investigation Management tools
        case 'get_investigations':
          return await this.handleGetInvestigations(args);
        
        case 'get_investigation_details':
          return await this.handleGetInvestigationDetails(args);
        
        case 'create_investigation':
          return await this.handleCreateInvestigation(args);
        
        case 'update_investigation':
          return await this.handleUpdateInvestigation(args);
        
        case 'add_investigation_note':
          return await this.handleAddInvestigationNote(args);
        
        case 'delete_investigation':
          return await this.handleDeleteInvestigation(args);
        
        // Legacy OTX API tools
        case 'search_pulses':
          return await this.handleSearchPulses(args);
        
        case 'get_indicator':
          return await this.handleGetIndicator(args);
        
        case 'get_pulse':
          return await this.handleGetPulse(args);
        
        // Advanced Query API tools
        case 'execute_advanced_query':
          return await this.handleExecuteAdvancedQuery(args);
        
        case 'validate_query_syntax':
          return await this.handleValidateQuerySyntax(args);
        
        case 'get_query_examples':
          return await this.handleGetQueryExamples(args);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
          }
        ],
        isError: true
      };
    }
  }

  // USM Anywhere API v2.0 handlers

  private async handleGetAlarms(args: any) {
    const validatedArgs = GetAlarmsArgsSchema.parse(args);
    
    // Parse timestamp parameters if provided
    const timestampOccuredGte = validatedArgs.timestamp_occured_gte 
      ? this.alienVaultService.parseTimestamp(validatedArgs.timestamp_occured_gte)
      : undefined;
    const timestampOccuredLte = validatedArgs.timestamp_occured_lte 
      ? this.alienVaultService.parseTimestamp(validatedArgs.timestamp_occured_lte)
      : undefined;
    
    const alarms = await this.alienVaultService.getAlarms(
      validatedArgs.account_name,
      validatedArgs.page,
      validatedArgs.size,
      validatedArgs.sort,
      validatedArgs.suppressed,
      validatedArgs.priority,
      validatedArgs.status,
      timestampOccuredGte,
      timestampOccuredLte
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            account_name: validatedArgs.account_name,
            page: alarms.page,
            total_alarms: alarms.page.totalElements,
            alarms: alarms._embedded.alarms.map(alarm => ({
              uuid: alarm.uuid,
              rule_name: alarm.rule_name || 'Unknown',
              priority: alarm.priority,
              priority_label: alarm.priority_label || 'unknown',
              status: alarm.status,
              timestamp_occured: alarm.timestamp_occured,
              timestamp_received: alarm.timestamp_received,
              source_name: alarm.source_name,
              destination_name: alarm.destination_name,
              source_username: alarm.source_username,
              destination_username: alarm.destination_username,
              suppressed: alarm.suppressed,
              rule_intent: alarm.rule_intent,
              rule_method: alarm.rule_method,
              rule_strategy: alarm.rule_strategy,
              alarm_events_count: alarm.alarm_events_count
            }))
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetEvents(args: any) {
    const validatedArgs = GetEventsArgsSchema.parse(args);
    
    // Parse timestamp parameters if provided
    const timestampOccuredGte = validatedArgs.timestamp_occured_gte 
      ? this.alienVaultService.parseTimestamp(validatedArgs.timestamp_occured_gte)
      : undefined;
    const timestampOccuredLte = validatedArgs.timestamp_occured_lte 
      ? this.alienVaultService.parseTimestamp(validatedArgs.timestamp_occured_lte)
      : undefined;
    
    const events = await this.alienVaultService.getEvents(
      validatedArgs.account_name,
      validatedArgs.page,
      validatedArgs.size,
      validatedArgs.sort,
      validatedArgs.suppressed,
      validatedArgs.plugin,
      validatedArgs.event_name,
      validatedArgs.source_name,
      validatedArgs.sensor_uuid,
      validatedArgs.source_username,
      timestampOccuredGte,
      timestampOccuredLte
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            account_name: validatedArgs.account_name,
            page: events.page,
            total_events: events.page.totalElements,
            events: events._embedded?.events?.map(event => ({
              uuid: event.uuid,
              account_name: event.account_name,
              event_name: event.event_name,
              event_type: event.event_type,
              timestamp_occured: event.timestamp_occured,
              timestamp_received: event.timestamp_received,
              source_canonical: event.source_canonical,
              destination_canonical: event.destination_canonical,
              plugin: event.plugin,
              plugin_device_type: event.plugin_device_type,
              has_alarm: event.has_alarm,
              suppressed: event.suppressed,
              app_name: event.app_name,
              packet_type: event.packet_type
            })) || []
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetAlarmDetails(args: any) {
    const validatedArgs = GetAlarmDetailsArgsSchema.parse(args);
    const alarm = await this.alienVaultService.getAlarmDetails(validatedArgs.alarm_id);
    
    if (!alarm) {
      return {
        content: [
          {
            type: 'text',
            text: `No alarm found with ID: ${validatedArgs.alarm_id}`
          }
        ]
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(alarm, null, 2)
        }
      ]
    };
  }

  private async handleGetEventDetails(args: any) {
    const validatedArgs = GetEventDetailsArgsSchema.parse(args);
    const event = await this.alienVaultService.getEventDetails(validatedArgs.event_id);
    
    if (!event) {
      return {
        content: [
          {
            type: 'text',
            text: `No event found with ID: ${validatedArgs.event_id}`
          }
        ]
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(event, null, 2)
        }
      ]
    };
  }

  // Legacy OTX API handlers

  private async handleSearchPulses(args: any) {
    const validatedArgs = SearchPulsesArgsSchema.parse(args);
    const pulses = await this.alienVaultService.searchPulses(validatedArgs.query, validatedArgs.limit);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query: validatedArgs.query,
            count: pulses.length,
            pulses: pulses.map(pulse => ({
              id: pulse.id,
              name: pulse.name,
              description: pulse.description,
              author: pulse.author_name,
              created: pulse.created,
              modified: pulse.modified,
              tags: pulse.tags,
              indicators_count: pulse.indicators.length,
              targeted_countries: pulse.targeted_countries,
              malware_families: pulse.malware_families,
              industries: pulse.industries
            }))
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetIndicator(args: any) {
    const validatedArgs = GetIndicatorArgsSchema.parse(args);
    const indicator = await this.alienVaultService.getIndicator(validatedArgs.indicator, validatedArgs.section);
    
    if (!indicator) {
      return {
        content: [
          {
            type: 'text',
            text: `No information found for indicator: ${validatedArgs.indicator}`
          }
        ]
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            indicator: validatedArgs.indicator,
            section: validatedArgs.section || 'general',
            data: indicator
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetPulse(args: any) {
    const validatedArgs = GetPulseArgsSchema.parse(args);
    const pulse = await this.alienVaultService.getPulse(validatedArgs.pulse_id);
    
    if (!pulse) {
      return {
        content: [
          {
            type: 'text',
            text: `No pulse found with ID: ${validatedArgs.pulse_id}`
          }
        ]
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(pulse, null, 2)
        }
      ]
    };
  }

  // Investigation Management handlers

  private async handleGetInvestigations(args: any) {
    const validatedArgs = GetInvestigationsArgsSchema.parse(args);
    const investigations = await this.alienVaultService.getInvestigations(
      validatedArgs.account_name,
      validatedArgs.page,
      validatedArgs.size,
      validatedArgs.sort,
      validatedArgs.status,
      validatedArgs.priority,
      validatedArgs.assignee,
      validatedArgs.created_after,
      validatedArgs.created_before
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            account_name: validatedArgs.account_name,
            page: investigations.page,
            total_investigations: investigations.page.totalElements,
            investigations: investigations._embedded.investigations.map(investigation => ({
              uuid: investigation.uuid,
              name: investigation.name,
              description: investigation.description,
              status: investigation.status,
              priority: investigation.priority,
              assignee: investigation.assignee,
              created_by: investigation.created_by,
              created_at: investigation.created_at,
              updated_at: investigation.updated_at,
              closed_at: investigation.closed_at,
              tags: investigation.tags,
              alarm_count: investigation.alarm_count,
              event_count: investigation.event_count
            }))
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetInvestigationDetails(args: any) {
    const validatedArgs = GetInvestigationDetailsArgsSchema.parse(args);
    const investigation = await this.alienVaultService.getInvestigationDetails(validatedArgs.investigation_id);
    
    if (!investigation) {
      return {
        content: [
          {
            type: 'text',
            text: `No investigation found with ID: ${validatedArgs.investigation_id}`
          }
        ]
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(investigation, null, 2)
        }
      ]
    };
  }

  private async handleCreateInvestigation(args: any) {
    const validatedArgs = CreateInvestigationArgsSchema.parse(args);
    const investigation = await this.alienVaultService.createInvestigation(
      validatedArgs.account_name,
      {
        name: validatedArgs.name,
        description: validatedArgs.description,
        priority: validatedArgs.priority,
        assignee: validatedArgs.assignee,
        tags: validatedArgs.tags,
        alarm_ids: validatedArgs.alarm_ids,
        event_ids: validatedArgs.event_ids
      }
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            message: 'Investigation created successfully',
            investigation: {
              uuid: investigation.uuid,
              name: investigation.name,
              description: investigation.description,
              status: investigation.status,
              priority: investigation.priority,
              assignee: investigation.assignee,
              created_by: investigation.created_by,
              created_at: investigation.created_at,
              tags: investigation.tags
            }
          }, null, 2)
        }
      ]
    };
  }

  private async handleUpdateInvestigation(args: any) {
    const validatedArgs = UpdateInvestigationArgsSchema.parse(args);
    const investigation = await this.alienVaultService.updateInvestigation(
      validatedArgs.investigation_id,
      {
        name: validatedArgs.name,
        description: validatedArgs.description,
        status: validatedArgs.status,
        priority: validatedArgs.priority,
        assignee: validatedArgs.assignee,
        tags: validatedArgs.tags
      }
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            message: 'Investigation updated successfully',
            investigation: {
              uuid: investigation.uuid,
              name: investigation.name,
              description: investigation.description,
              status: investigation.status,
              priority: investigation.priority,
              assignee: investigation.assignee,
              updated_at: investigation.updated_at,
              tags: investigation.tags
            }
          }, null, 2)
        }
      ]
    };
  }

  private async handleAddInvestigationNote(args: any) {
    const validatedArgs = AddInvestigationNoteArgsSchema.parse(args);
    const investigation = await this.alienVaultService.addInvestigationNote(
      validatedArgs.investigation_id,
      validatedArgs.content
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            message: 'Note added to investigation successfully',
            investigation: {
              uuid: investigation.uuid,
              name: investigation.name,
              notes: investigation.notes
            }
          }, null, 2)
        }
      ]
    };
  }

  private async handleDeleteInvestigation(args: any) {
    const validatedArgs = DeleteInvestigationArgsSchema.parse(args);
    const success = await this.alienVaultService.deleteInvestigation(validatedArgs.investigation_id);
    
    if (success) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: 'Investigation deleted successfully',
              investigation_id: validatedArgs.investigation_id
            }, null, 2)
          }
        ]
      };
    } else {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: 'Failed to delete investigation',
              investigation_id: validatedArgs.investigation_id
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }

  // Advanced Query API handlers

  private async handleExecuteAdvancedQuery(args: any) {
    const validatedArgs = ExecuteAdvancedQueryArgsSchema.parse(args);
    
    // Convert time range parameters if needed
    const timeRangeStart = validatedArgs.time_range_start 
      ? this.parseTimeRange(validatedArgs.time_range_start)
      : undefined;
    const timeRangeEnd = validatedArgs.time_range_end 
      ? this.parseTimeRange(validatedArgs.time_range_end)
      : undefined;
    
    // Get tenant ID for the account
    const tenantId = this.alienVaultService.getTenantIdFromSubdomain();
    
    const result = await this.alienVaultService.executeAdvancedQuery({
      tenantId,
      queryString: validatedArgs.query_string,
      queryLanguage: validatedArgs.query_language,
      timeRangeStart,
      timeRangeEnd,
      page: validatedArgs.page,
      pageSize: validatedArgs.page_size,
      includePerformance: validatedArgs.include_performance
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            account_name: validatedArgs.account_name,
            query_language: validatedArgs.query_language,
            query_string: validatedArgs.query_string,
            schema: result.schema,
            total_results: result.total,
            returned_results: result.size,
            page: validatedArgs.page,
            page_size: validatedArgs.page_size,
            data: result.datarows.map((row, index) => {
              const rowObject: any = {};
              result.schema.forEach((column, columnIndex) => {
                rowObject[column.name] = row[columnIndex];
              });
              return rowObject;
            }),
            results_id: result.results_id,
            performance: 'performance' in result ? result.performance : undefined
          }, null, 2)
        }
      ]
    };
  }

  private async handleValidateQuerySyntax(args: any) {
    const validatedArgs = ValidateQuerySyntaxArgsSchema.parse(args);
    
    const validation = await this.alienVaultService.validateQuerySyntax(
      validatedArgs.query_string,
      validatedArgs.query_language
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query_string: validatedArgs.query_string,
            query_language: validatedArgs.query_language,
            is_valid: validation.is_valid,
            errors: validation.errors,
            warnings: validation.warnings,
            estimated_complexity: validation.estimated_complexity,
            suggested_optimizations: validation.suggested_optimizations
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetQueryExamples(args: any) {
    const validatedArgs = GetQueryExamplesArgsSchema.parse(args);
    
    // This will return pre-built query examples from our documentation
    const examples = this.getQueryExamplesByCategory(
      validatedArgs.category,
      validatedArgs.query_language,
      validatedArgs.difficulty
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            category: validatedArgs.category || 'all',
            query_language: validatedArgs.query_language,
            difficulty: validatedArgs.difficulty || 'all',
            examples
          }, null, 2)
        }
      ]
    };
  }

  // Helper methods for advanced query functionality

  private parseTimeRange(timeValue: string | number): number {
    if (typeof timeValue === 'number') {
      return timeValue;
    }
    
    const timeString = timeValue.toString();
    
    // Check if it's an ISO date string
    if (timeString.includes('T') || timeString.includes('-')) {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.getTime();
      }
    }
    
    // Check if it's a relative time (e.g., "24h", "7d", "1w")
    const relativeTimeMatch = timeString.match(/^(\d+)([hdwmy])$/);
    if (relativeTimeMatch) {
      const value = parseInt(relativeTimeMatch[1]);
      const unit = relativeTimeMatch[2];
      const now = Date.now();
      
      switch (unit) {
        case 'h': return now - (value * 60 * 60 * 1000);
        case 'd': return now - (value * 24 * 60 * 60 * 1000);
        case 'w': return now - (value * 7 * 24 * 60 * 60 * 1000);
        case 'm': return now - (value * 30 * 24 * 60 * 60 * 1000);
        case 'y': return now - (value * 365 * 24 * 60 * 60 * 1000);
      }
    }
    
    // Try to parse as milliseconds
    const numValue = parseInt(timeString);
    if (!isNaN(numValue)) {
      return numValue;
    }
    
    throw new Error(`Invalid time format: ${timeValue}. Use ISO date, milliseconds, or relative format (e.g., "24h", "7d")`);
  }

  private getQueryExamplesByCategory(
    category?: string,
    language?: string,
    difficulty?: string
  ): Array<{
    name: string;
    description: string;
    query: string;
    language: 'SQL' | 'PPL';
    category: string;
    difficulty: string;
    use_case: string;
  }> {
    // This is a sample set of query examples - in a real implementation,
    // these would be loaded from the documentation files we'll create
    const examples = [
      {
        name: 'Basic Security Event Query',
        description: 'Find all security events from the last 24 hours',
        query: 'SELECT message.event_name, message.source_address, message.timestamp FROM logs WHERE message.timestamp > NOW() - INTERVAL 24 HOUR LIMIT 100',
        language: 'SQL' as const,
        category: 'security',
        difficulty: 'beginner',
        use_case: 'Basic security monitoring'
      },
      {
        name: 'Failed Login Analysis',
        description: 'Detect potential brute force attacks by analyzing failed logins',
        query: 'SELECT message.source_address, COUNT(*) as failed_attempts FROM logs WHERE UPPER(message.event_name) LIKE UPPER(\'%login%\') AND UPPER(message.event_name) LIKE UPPER(\'%fail%\') GROUP BY message.source_address HAVING COUNT(*) > 10 ORDER BY failed_attempts DESC',
        language: 'SQL' as const,
        category: 'security',
        difficulty: 'intermediate',
        use_case: 'Threat hunting - brute force detection'
      },
      {
        name: 'Geographic Anomaly Detection',
        description: 'Find login events from unusual countries',
        query: 'SELECT message.event_name, message.source_address, message.source_country FROM logs WHERE message.source_country != \'US\' AND UPPER(message.event_name) LIKE UPPER(\'%login%\') LIMIT 50',
        language: 'SQL' as const,
        category: 'security',
        difficulty: 'intermediate',
        use_case: 'Geographic anomaly detection'
      },
      {
        name: 'PPL Basic Log Analysis',
        description: 'Basic PPL query for log analysis',
        query: 'search source=logs | where message.event_name="failed_login" | stats count() by message.source_address | where count > 5 | sort - count',
        language: 'PPL' as const,
        category: 'security',
        difficulty: 'beginner',
        use_case: 'Failed login analysis with PPL'
      },
      {
        name: 'High Priority Events',
        description: 'Find all high priority security events',
        query: 'SELECT message.event_name, message.source_address, message.destination_address, message.priority FROM logs WHERE message.priority = \'high\' ORDER BY message.timestamp DESC LIMIT 100',
        language: 'SQL' as const,
        category: 'basic',
        difficulty: 'beginner',
        use_case: 'Basic event filtering'
      },
      {
        name: 'Compliance Audit Query',
        description: 'Generate compliance report for access events',
        query: 'SELECT DATE(message.timestamp) as date, message.event_name, message.source_username, message.destination_resource FROM logs WHERE message.event_type = \'access\' AND message.timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY) ORDER BY date DESC',
        language: 'SQL' as const,
        category: 'compliance',
        difficulty: 'intermediate',
        use_case: 'Access compliance reporting'
      }
    ];

    // Filter examples based on criteria
    let filteredExamples = examples;
    
    if (category) {
      filteredExamples = filteredExamples.filter(ex => ex.category === category);
    }
    
    if (language && language !== 'both') {
      filteredExamples = filteredExamples.filter(ex => ex.language === language);
    }
    
    if (difficulty) {
      filteredExamples = filteredExamples.filter(ex => ex.difficulty === difficulty);
    }
    
    return filteredExamples;
  }
} 
import { z } from 'zod';

// OAuth Token Response
export const OAuthTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expire_in: z.number(),
  scope: z.string().optional(),
});

export type OAuthToken = z.infer<typeof OAuthTokenSchema>;

// USM Anywhere API Response Types
export const AlarmSchema = z.object({
  uuid: z.string(),
  needs_enrichment: z.boolean(),
  packet_data: z.array(z.string()),
  priority: z.number(),
  priority_label: z.string().optional(),
  suppressed: z.boolean(),
  status: z.string(),
  rule_intent: z.string().optional(),
  rule_method: z.string().optional(),
  rule_strategy: z.string().optional(),
  rule_name: z.string().optional(),
  rule_id: z.string().optional(),
  alarm_events_count: z.number().optional(),
  source_name: z.string().optional(),
  destination_name: z.string().optional(),
  source_username: z.string().optional(),
  destination_username: z.string().optional(),
  source_canonical: z.string().optional(),
  destination_canonical: z.string().optional(),
  timestamp_occured: z.number(),
  timestamp_received: z.number(),
  timestamp_arrived: z.number().optional(),
  timestamp_to_storage: z.number().optional(),
  event_type: z.string().optional(),
  sensor_uuid: z.string().optional(),
  alarm_sensor_sources: z.array(z.string()).optional(),
  alarm_sources: z.array(z.string()).optional(),
  alarm_destinations: z.array(z.string()).optional(),
  alarm_response_codes: z.array(z.any()).optional(),
  highlight_fields: z.array(z.string()).optional(),
  mute: z.string().optional(),
  packet_type: z.string().optional(),
  transient: z.boolean().optional(),
  needs_internal_enrichment: z.boolean().optional(),
  x_att_tenant_subdomain: z.string().optional(),
  x_att_tenantid: z.string().optional(),
  events: z.array(z.object({
    _links: z.object({
      self: z.object({
        href: z.string(),
        templated: z.boolean().optional(),
      }),
    }),
    timeStamp: z.number(),
    message: z.record(z.any()),
  })).optional(),
  _links: z.object({
    self: z.object({
      href: z.string(),
      templated: z.boolean().optional(),
    }),
  }),
});

export const EventSchema = z.object({
  uuid: z.string(),
  account_name: z.string().optional(),
  plugin_device_type: z.string().optional(),
  destination_canonical: z.string().optional(),
  destination_name: z.string().optional(),
  has_alarm: z.boolean().optional(),
  packet_type: z.string().optional(),
  source_canonical: z.string().optional(),
  event_name: z.string(),
  timestamp_occured: z.union([z.string(), z.number()]),
  timestamp_received: z.union([z.string(), z.number()]),
  timestamp_arrived: z.union([z.string(), z.number()]).optional(),
  timestamp_to_storage: z.union([z.string(), z.number()]).optional(),
  event_type: z.string().optional(),
  app_name: z.string().optional(),
  plugin: z.string().optional(),
  plugin_version: z.string().optional(),
  plugin_device: z.string().optional(),
  plugin_rule: z.string().optional(),
  suppressed: z.union([z.string(), z.boolean()]),
  needs_enrichment: z.boolean().optional(),
  needs_internal_enrichment: z.boolean().optional(),
  source_name: z.string().optional(),
  source_username: z.string().optional(),
  destination_username: z.string().optional(),
  source_userid: z.string().optional(),
  source_process: z.string().optional(),
  source_process_commandline: z.string().optional(),
  event_description: z.string().optional(),
  access_control_outcome: z.string().optional(),
  device_sender_address: z.string().optional(),
  rep_device_address: z.string().optional(),
  rep_device_fqdn: z.string().optional(),
  rep_dev_canonical: z.string().optional(),
  received_from: z.string().optional(),
  syslog_source: z.string().optional(),
  sensor_uuid: z.string().optional(),
  log: z.string().optional(),
  tag: z.string().optional(),
  time_offset: z.string().optional(),
  highlight_fields: z.array(z.string()).optional(),
  used_hint: z.boolean().optional(),
  was_guessed: z.boolean().optional(),
  was_fuzzied: z.boolean().optional(),
  transient: z.boolean().optional(),
  x_att_tenant_subdomain: z.string().optional(),
  x_att_tenantid: z.string().optional(),
  _links: z.object({
    self: z.object({
      href: z.string(),
      templated: z.boolean().optional(),
    }),
  }).optional(),
});

export const PagedResponseSchema = z.object({
  _links: z.object({
    first: z.object({
      href: z.string(),
      templated: z.boolean().optional(),
    }).optional(),
    self: z.object({
      href: z.string(),
      templated: z.boolean().optional(),
    }),
    next: z.object({
      href: z.string(),
      templated: z.boolean().optional(),
    }).optional(),
    last: z.object({
      href: z.string(),
      templated: z.boolean().optional(),
    }).optional(),
  }),
  page: z.object({
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    number: z.number(),
  }),
});

export const AlarmsResponseSchema = z.object({
  _embedded: z.object({
    alarms: z.array(AlarmSchema),
  }),
  _links: z.object({
    first: z.object({ href: z.string() }).optional(),
    self: z.object({ href: z.string() }),
    next: z.object({ href: z.string() }).optional(),
    last: z.object({ href: z.string() }).optional(),
  }),
  page: z.object({
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    number: z.number(),
  }),
});

export const EventsResponseSchema = z.object({
  _embedded: z.object({
    events: z.array(EventSchema),
  }).optional(),
  _links: z.object({
    first: z.object({ href: z.string() }).optional(),
    self: z.object({ href: z.string() }),
    next: z.object({ href: z.string() }).optional(),
    last: z.object({ href: z.string() }).optional(),
  }),
  page: z.object({
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    number: z.number(),
  }),
});

// Legacy OTX API Types (keeping for backward compatibility)
export const PulseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  author_name: z.string(),
  created: z.string(),
  modified: z.string(),
  tags: z.array(z.string()),
  references: z.array(z.string()),
  public: z.boolean(),
  adversary: z.string().optional(),
  targeted_countries: z.array(z.string()),
  malware_families: z.array(z.string()),
  attack_ids: z.array(z.string()),
  industries: z.array(z.string()),
  indicators: z.array(z.object({
    id: z.number(),
    indicator: z.string(),
    type: z.string(),
    created: z.string(),
    content: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  })),
});

export const IndicatorSchema = z.object({
  indicator: z.string(),
  type: z.string(),
  type_title: z.string(),
  base_indicator: z.object({
    id: z.number(),
    indicator: z.string(),
    type: z.string(),
    created: z.string(),
    content: z.string().optional(),
    access_type: z.string(),
    access_reason: z.string(),
  }),
  pulse_info: z.object({
    count: z.number(),
    pulses: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      created: z.string(),
      modified: z.string(),
      tags: z.array(z.string()),
    })),
  }),
  false_positive: z.array(z.any()),
  validation: z.array(z.any()),
  sections: z.array(z.string()),
});

export const DomainInfoSchema = z.object({
  indicator: z.string(),
  type: z.string(),
  type_title: z.string(),
  validation: z.array(z.any()),
  base_indicator: z.object({
    id: z.number(),
    indicator: z.string(),
    type: z.string(),
    created: z.string(),
    content: z.string().optional(),
    access_type: z.string(),
    access_reason: z.string(),
  }),
  pulse_info: z.object({
    count: z.number(),
    pulses: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      created: z.string(),
      modified: z.string(),
      tags: z.array(z.string()),
    })),
  }),
  false_positive: z.array(z.any()),
  whois: z.object({
    domain: z.string(),
    registrar: z.string().optional(),
    creation_date: z.string().optional(),
    expiration_date: z.string().optional(),
    updated_date: z.string().optional(),
    name_servers: z.array(z.string()).optional(),
  }).optional(),
  alexa: z.string().optional(),
  sections: z.array(z.string()),
});

export const IPInfoSchema = z.object({
  indicator: z.string(),
  type: z.string(),
  type_title: z.string(),
  validation: z.array(z.any()),
  base_indicator: z.object({
    id: z.number(),
    indicator: z.string(),
    type: z.string(),
    created: z.string(),
    content: z.string().optional(),
    access_type: z.string(),
    access_reason: z.string(),
  }),
  pulse_info: z.object({
    count: z.number(),
    pulses: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      created: z.string(),
      modified: z.string(),
      tags: z.array(z.string()),
    })),
  }),
  false_positive: z.array(z.any()),
  reputation: z.object({
    threat_score: z.number(),
    threat_score_verbose: z.string(),
    first_seen: z.string().optional(),
    last_seen: z.string().optional(),
    counts: z.object({
      total: z.number(),
      malware: z.number(),
      scanning: z.number(),
      spamming: z.number(),
      phishing: z.number(),
      suspicious: z.number(),
    }).optional(),
  }).optional(),
  country_code: z.string().optional(),
  country_name: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  continent_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  asn: z.string().optional(),
  sections: z.array(z.string()),
});

export type Alarm = z.infer<typeof AlarmSchema>;
export type Event = z.infer<typeof EventSchema>;
export type AlarmsResponse = z.infer<typeof AlarmsResponseSchema>;
export type EventsResponse = z.infer<typeof EventsResponseSchema>;
export type Pulse = z.infer<typeof PulseSchema>;
export type Indicator = z.infer<typeof IndicatorSchema>;
export type DomainInfo = z.infer<typeof DomainInfoSchema>;
export type IPInfo = z.infer<typeof IPInfoSchema>;

// MCP Tool Arguments for USM Anywhere API
export const GetAlarmsArgsSchema = z.object({
  account_name: z.string().describe("The account name"),
  page: z.number().min(0).default(0).describe("Page number (zero based)"),
  size: z.number().min(1).max(100).default(20).describe("Number of results per page"),
  sort: z.string().optional().describe("Sort parameter and direction (e.g., 'timestamp_occured,desc')"),
  suppressed: z.boolean().optional().describe("Filter by suppressed flag"),
  priority: z.string().optional().describe("Filter by alarm priority"),
  status: z.string().optional().describe("Filter by alarm status"),
  timestamp_occured_gte: z.union([z.string(), z.number()]).optional().describe("Filter alarms after this timestamp (ISO date string, relative time like '24h', or milliseconds)"),
  timestamp_occured_lte: z.union([z.string(), z.number()]).optional().describe("Filter alarms before this timestamp (ISO date string, relative time like '24h', or milliseconds)"),
});

export const GetEventsArgsSchema = z.object({
  account_name: z.string().describe("The account name"),
  page: z.number().min(0).default(0).describe("Page number (zero based)"),
  size: z.number().min(1).max(100).default(20).describe("Number of results per page"),
  sort: z.string().optional().describe("Sort parameter and direction (e.g., 'timestamp_occured,desc')"),
  suppressed: z.boolean().optional().describe("Filter by suppressed flag"),
  plugin: z.string().optional().describe("Filter by plugin name"),
  event_name: z.string().optional().describe("Filter by event name"),
  source_name: z.string().optional().describe("Filter by source name"),
  sensor_uuid: z.string().optional().describe("Filter by sensor UUID"),
  source_username: z.string().optional().describe("Filter by source username"),
  timestamp_occured_gte: z.union([z.string(), z.number()]).optional().describe("Filter events after this timestamp (ISO date string, relative time like '24h', or milliseconds)"),
  timestamp_occured_lte: z.union([z.string(), z.number()]).optional().describe("Filter events before this timestamp (ISO date string, relative time like '24h', or milliseconds)"),
});

export const GetAlarmDetailsArgsSchema = z.object({
  alarm_id: z.string().describe("The UUID of the alarm to retrieve"),
});

export const GetEventDetailsArgsSchema = z.object({
  event_id: z.string().describe("The UUID of the event to retrieve"),
});

// Legacy OTX API arguments (keeping for backward compatibility)
export const SearchPulsesArgsSchema = z.object({
  query: z.string().describe("Search query for threat intelligence pulses"),
  limit: z.number().min(1).max(100).default(10).describe("Maximum number of results to return"),
});

export const GetIndicatorArgsSchema = z.object({
  indicator: z.string().describe("The indicator to lookup (IP, domain, hash, etc.)"),
  section: z.string().optional().describe("Specific section to retrieve (general, reputation, geo, malware, etc.)"),
});

export const GetPulseArgsSchema = z.object({
  pulse_id: z.string().describe("The ID of the pulse to retrieve"),
});

export type GetAlarmsArgs = z.infer<typeof GetAlarmsArgsSchema>;
export type GetEventsArgs = z.infer<typeof GetEventsArgsSchema>;
export type GetAlarmDetailsArgs = z.infer<typeof GetAlarmDetailsArgsSchema>;
export type GetEventDetailsArgs = z.infer<typeof GetEventDetailsArgsSchema>;
export type SearchPulsesArgs = z.infer<typeof SearchPulsesArgsSchema>;
export type GetIndicatorArgs = z.infer<typeof GetIndicatorArgsSchema>;
export type GetPulseArgs = z.infer<typeof GetPulseArgsSchema>;

// Investigation Types
export const InvestigationSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['open', 'closed', 'in_progress', 'resolved']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assignee: z.string().optional(),
  created_by: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string().optional(),
  tags: z.array(z.string()).optional(),
  alarm_count: z.number().default(0),
  event_count: z.number().default(0),
  findings: z.array(z.object({
    id: z.string(),
    type: z.string(),
    description: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    created_at: z.string(),
  })).optional(),
  alarms: z.array(z.string()).optional(), // Array of alarm UUIDs
  events: z.array(z.string()).optional(), // Array of event UUIDs
  notes: z.array(z.object({
    id: z.string(),
    content: z.string(),
    author: z.string(),
    created_at: z.string(),
  })).optional(),
  _links: z.object({
    self: z.object({
      href: z.string(),
      templated: z.boolean().optional(),
    }),
  }).optional(),
});

export const InvestigationsResponseSchema = z.object({
  _embedded: z.object({
    investigations: z.array(InvestigationSchema),
  }),
  _links: z.object({
    first: z.object({ href: z.string() }).optional(),
    self: z.object({ href: z.string() }),
    next: z.object({ href: z.string() }).optional(),
    last: z.object({ href: z.string() }).optional(),
  }),
  page: z.object({
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    number: z.number(),
  }),
});

export const CreateInvestigationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  assignee: z.string().optional(),
  tags: z.array(z.string()).optional(),
  alarm_ids: z.array(z.string()).optional(),
  event_ids: z.array(z.string()).optional(),
});

export const UpdateInvestigationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['open', 'closed', 'in_progress', 'resolved']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  assignee: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type Investigation = z.infer<typeof InvestigationSchema>;
export type InvestigationsResponse = z.infer<typeof InvestigationsResponseSchema>;
export type CreateInvestigation = z.infer<typeof CreateInvestigationSchema>;
export type UpdateInvestigation = z.infer<typeof UpdateInvestigationSchema>;

// MCP Tool Arguments for Investigations
export const GetInvestigationsArgsSchema = z.object({
  account_name: z.string().describe("The account name"),
  page: z.number().min(0).default(0).describe("Page number (zero based)"),
  size: z.number().min(1).max(100).default(20).describe("Number of results per page"),
  sort: z.string().optional().describe("Sort parameter and direction (e.g., 'created_at,desc')"),
  status: z.enum(['open', 'closed', 'in_progress', 'resolved']).optional().describe("Filter by investigation status"),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe("Filter by investigation priority"),
  assignee: z.string().optional().describe("Filter by assignee"),
  created_after: z.number().optional().describe("Filter investigations created after this timestamp"),
  created_before: z.number().optional().describe("Filter investigations created before this timestamp"),
});

export const GetInvestigationDetailsArgsSchema = z.object({
  investigation_id: z.string().describe("The UUID of the investigation to retrieve"),
});

export const CreateInvestigationArgsSchema = z.object({
  account_name: z.string().describe("The account name"),
  name: z.string().min(1).describe("Investigation name"),
  description: z.string().optional().describe("Investigation description"),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium').describe("Investigation priority"),
  assignee: z.string().optional().describe("User to assign the investigation to"),
  tags: z.array(z.string()).optional().describe("Tags for the investigation"),
  alarm_ids: z.array(z.string()).optional().describe("Alarm UUIDs to include in the investigation"),
  event_ids: z.array(z.string()).optional().describe("Event UUIDs to include in the investigation"),
});

export const UpdateInvestigationArgsSchema = z.object({
  investigation_id: z.string().describe("The UUID of the investigation to update"),
  name: z.string().optional().describe("New investigation name"),
  description: z.string().optional().describe("New investigation description"),
  status: z.enum(['open', 'closed', 'in_progress', 'resolved']).optional().describe("New investigation status"),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe("New investigation priority"),
  assignee: z.string().optional().describe("New assignee for the investigation"),
  tags: z.array(z.string()).optional().describe("New tags for the investigation"),
});

export const AddInvestigationNoteArgsSchema = z.object({
  investigation_id: z.string().describe("The UUID of the investigation"),
  content: z.string().min(1).describe("Note content"),
});

export const DeleteInvestigationArgsSchema = z.object({
  investigation_id: z.string().describe("The UUID of the investigation to delete"),
});

export type GetInvestigationsArgs = z.infer<typeof GetInvestigationsArgsSchema>;
export type GetInvestigationDetailsArgs = z.infer<typeof GetInvestigationDetailsArgsSchema>;
export type CreateInvestigationArgs = z.infer<typeof CreateInvestigationArgsSchema>;
export type UpdateInvestigationArgs = z.infer<typeof UpdateInvestigationArgsSchema>;
export type AddInvestigationNoteArgs = z.infer<typeof AddInvestigationNoteArgsSchema>;
export type DeleteInvestigationArgs = z.infer<typeof DeleteInvestigationArgsSchema>;

// Advanced Query Types
export const AdvancedQueryRequestSchema = z.object({
  tenant_id: z.string().describe("The tenant ID for the query"),
  query_string: z.string().min(1).describe("The SQL or PPL query string to execute"),
  query_language: z.enum(['SQL', 'PPL']).describe("Query language - SQL or PPL (Piped Processing Language)"),
  time_range_start: z.number().optional().describe("Start time for query in milliseconds since epoch"),
  time_range_end: z.number().optional().describe("End time for query in milliseconds since epoch"),
  page: z.number().min(1).default(1).describe("Page number for pagination"),
  page_size: z.number().min(1).max(1000).default(20).describe("Number of results per page"),
});

export const AdvancedQuerySchemaColumnSchema = z.object({
  name: z.string().describe("Column name from the query result"),
  type: z.string().describe("Data type of the column (keyword, text, number, etc.)"),
});

export const AdvancedQueryResponseSchema = z.object({
  schema: z.array(AdvancedQuerySchemaColumnSchema).describe("Schema definition for the query results"),
  total: z.number().describe("Total number of matching records"),
  datarows: z.array(z.array(z.any())).describe("Array of result rows, each row is an array of values"),
  size: z.number().describe("Number of rows returned in this response"),
  error: z.record(z.any()).optional().describe("Error information if the query failed"),
  status: z.number().describe("HTTP status code of the query execution"),
  results_id: z.string().describe("Unique identifier for this query result set"),
});

export const AdvancedQueryPerformanceSchema = z.object({
  execution_time_ms: z.number().describe("Query execution time in milliseconds"),
  rows_examined: z.number().optional().describe("Number of rows examined during query execution"),
  rows_returned: z.number().describe("Number of rows returned by the query"),
  memory_usage_mb: z.number().optional().describe("Memory usage in megabytes"),
  query_complexity: z.enum(['low', 'medium', 'high']).optional().describe("Assessed complexity of the query"),
});

export type AdvancedQueryRequest = z.infer<typeof AdvancedQueryRequestSchema>;
export type AdvancedQuerySchemaColumn = z.infer<typeof AdvancedQuerySchemaColumnSchema>;
export type AdvancedQueryResponse = z.infer<typeof AdvancedQueryResponseSchema>;
export type AdvancedQueryPerformance = z.infer<typeof AdvancedQueryPerformanceSchema>;

// MCP Tool Arguments for Advanced Query
export const ExecuteAdvancedQueryArgsSchema = z.object({
  account_name: z.string().describe("The account name for the query"),
  query_string: z.string().min(1).describe("The SQL or PPL query string to execute"),
  query_language: z.enum(['SQL', 'PPL']).default('SQL').describe("Query language - SQL or PPL"),
  time_range_start: z.union([z.string(), z.number()]).optional().describe("Start time - ISO string, relative time (e.g., '24h'), or milliseconds"),
  time_range_end: z.union([z.string(), z.number()]).optional().describe("End time - ISO string, relative time (e.g., '1h'), or milliseconds"),
  page: z.number().min(1).default(1).describe("Page number for pagination"),
  page_size: z.number().min(1).max(1000).default(20).describe("Number of results per page"),
  include_performance: z.boolean().default(false).describe("Include performance metrics in response"),
});

export const ValidateQuerySyntaxArgsSchema = z.object({
  query_string: z.string().min(1).describe("The SQL or PPL query string to validate"),
  query_language: z.enum(['SQL', 'PPL']).default('SQL').describe("Query language - SQL or PPL"),
});

export const GetQueryExamplesArgsSchema = z.object({
  category: z.enum(['security', 'performance', 'compliance', 'investigation', 'basic']).optional().describe("Category of query examples to retrieve"),
  query_language: z.enum(['SQL', 'PPL', 'both']).default('both').describe("Language preference for examples"),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe("Difficulty level of examples"),
});

export type ExecuteAdvancedQueryArgs = z.infer<typeof ExecuteAdvancedQueryArgsSchema>;
export type ValidateQuerySyntaxArgs = z.infer<typeof ValidateQuerySyntaxArgsSchema>;
export type GetQueryExamplesArgs = z.infer<typeof GetQueryExamplesArgsSchema>;

// Query Validation Response
export const QueryValidationResponseSchema = z.object({
  is_valid: z.boolean().describe("Whether the query syntax is valid"),
  errors: z.array(z.object({
    line: z.number().optional(),
    column: z.number().optional(),
    message: z.string(),
    type: z.enum(['syntax', 'semantic', 'security', 'performance']),
  })).describe("Array of validation errors if any"),
  warnings: z.array(z.object({
    line: z.number().optional(),
    column: z.number().optional(),
    message: z.string(),
    type: z.enum(['performance', 'best_practice', 'security']),
  })).describe("Array of validation warnings"),
  estimated_complexity: z.enum(['low', 'medium', 'high']).optional().describe("Estimated query complexity"),
  suggested_optimizations: z.array(z.string()).optional().describe("Suggested query optimizations"),
});

export type QueryValidationResponse = z.infer<typeof QueryValidationResponseSchema>; 
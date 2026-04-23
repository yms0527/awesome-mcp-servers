export interface IntercomConversation {
  id: string;
  created_at: number;
  updated_at: number;
  waiting_since: number;
  snoozed_until?: number;
  source: {
    type: string;
    id: string;
    delivered_as: string;
  };
  contacts: {
    type: string;
    id: string;
    name: string;
  }[];
  statistics: {
    time_to_assignment?: number;
    time_to_first_response?: number;
    time_to_last_close?: number;
    median_time_to_response?: number;
    first_contact_reply_at?: number;
    first_assignment_at?: number;
    first_admin_reply_at?: number;
    first_close_at?: number;
    last_assignment_at?: number;
    last_assignment_admin_reply_at?: number;
    last_contact_reply_at?: number;
    last_admin_reply_at?: number;
    last_close_at?: number;
    reopens: number;
    responses: number;
  };
  state: string;
  read: boolean;
  priority: string;
}
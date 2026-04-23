import { EnvironmentValue } from './common.js';

// Core interfaces for environment operations
export interface CreateEnvironmentArgs {
  environment: {
    name: string;
    values: EnvironmentValue[];
  };
  workspace?: string;
}

export interface UpdateEnvironmentArgs {
  environmentId: string;
  environment: {
    name?: string;
    values?: EnvironmentValue[];
  };
}

export interface ForkEnvironmentArgs {
  environmentId: string;
  label: string;
  workspace: string;
}

export interface GetEnvironmentForksArgs {
  environmentId: string;
  cursor?: string;
  direction?: 'asc' | 'desc';
  limit?: number;
  sort?: 'createdAt';
}

export interface MergeEnvironmentForkArgs {
  environmentId: string;
  source: string;
  destination: string;
  strategy?: {
    deleteSource?: boolean;
  };
}

export interface PullEnvironmentArgs {
  environmentId: string;
  source: string;
  destination: string;
}

import axios, { AxiosInstance } from 'axios';

export interface BitbucketRepository {
  uuid: string;
  name: string;
  full_name: string;
  description?: string;
  is_private: boolean;
  created_on: string;
  updated_on: string;
  size: number;
  language?: string;
  has_issues: boolean;
  has_wiki: boolean;
  clone_links: Array<{
    name: string;
    href: string;
  }>;
  links: {
    html: { href: string };
    clone: Array<{ name: string; href: string }>;
  };
}

export interface BitbucketPullRequest {
  id: number;
  title: string;
  description?: string;
  state: 'OPEN' | 'MERGED' | 'DECLINED';
  created_on: string;
  updated_on: string;
  author: {
    display_name: string;
    uuid: string;
  };
  source: {
    branch: { name: string };
    repository: { full_name: string };
  };
  destination: {
    branch: { name: string };
    repository: { full_name: string };
  };
  links: {
    html: { href: string };
  };
}

export interface BitbucketIssue {
  id: number;
  title: string;
  content?: {
    raw: string;
    markup: string;
    html: string;
  };
  state: string;
  kind: string;
  priority: string;
  created_on: string;
  updated_on: string;
  reporter: {
    display_name: string;
    uuid: string;
  };
  assignee?: {
    display_name: string;
    uuid: string;
  };
  links: {
    html: { href: string };
  };
}

export interface CreatePullRequestData {
  title: string;
  description?: string;
  source_branch: string;
  destination_branch: string;
}

export class BitbucketClient {
  private client: AxiosInstance;
  private username?: string;
  private appPassword?: string;

  constructor() {
    this.username = process.env.BITBUCKET_USERNAME;
    this.appPassword = process.env.BITBUCKET_APP_PASSWORD;

    this.client = axios.create({
      baseURL: 'https://api.bitbucket.org/2.0',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (this.username && this.appPassword) {
      this.client.defaults.auth = {
        username: this.username,
        password: this.appPassword,
      };
    }
  }

  private validateAuth() {
    if (!this.username || !this.appPassword) {
      throw new Error('Bitbucket authentication not configured. Set BITBUCKET_USERNAME and BITBUCKET_APP_PASSWORD environment variables.');
    }
  }

  async listRepositories(workspace: string, page: number = 1): Promise<{ values: BitbucketRepository[]; size: number; page: number; pagelen: number }> {
    try {
      const response = await this.client.get(`/repositories/${workspace}`, {
        params: { page, pagelen: 10 },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to list repositories: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  async getRepository(workspace: string, repoSlug: string): Promise<BitbucketRepository> {
    try {
      const response = await this.client.get(`/repositories/${workspace}/${repoSlug}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get repository: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  async listPullRequests(workspace: string, repoSlug: string, state?: string): Promise<{ values: BitbucketPullRequest[]; size: number; page: number; pagelen: number }> {
    try {
      const params: any = { pagelen: 10 };
      if (state) {
        params.state = state;
      }

      const response = await this.client.get(`/repositories/${workspace}/${repoSlug}/pullrequests`, {
        params,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to list pull requests: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  async getPullRequest(workspace: string, repoSlug: string, pullRequestId: number): Promise<BitbucketPullRequest> {
    try {
      const response = await this.client.get(`/repositories/${workspace}/${repoSlug}/pullrequests/${pullRequestId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get pull request: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  async listIssues(workspace: string, repoSlug: string, state?: string): Promise<{ values: BitbucketIssue[]; size: number; page: number; pagelen: number }> {
    try {
      const params: any = { pagelen: 10 };
      if (state) {
        params.state = state;
      }

      const response = await this.client.get(`/repositories/${workspace}/${repoSlug}/issues`, {
        params,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to list issues: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  async createPullRequest(workspace: string, repoSlug: string, data: CreatePullRequestData): Promise<BitbucketPullRequest> {
    this.validateAuth();

    try {
      const payload = {
        title: data.title,
        description: data.description,
        source: {
          branch: {
            name: data.source_branch,
          },
        },
        destination: {
          branch: {
            name: data.destination_branch,
          },
        },
      };

      const response = await this.client.post(`/repositories/${workspace}/${repoSlug}/pullrequests`, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to create pull request: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }
}
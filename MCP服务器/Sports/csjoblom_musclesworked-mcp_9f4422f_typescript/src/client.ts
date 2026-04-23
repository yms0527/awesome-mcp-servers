/**
 * HTTP client for the musclesworked.com REST API.
 */

const VERSION = "0.1.0";

export class MusclesWorkedApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
  ) {
    super(`API error ${status}: ${detail}`);
    this.name = "MusclesWorkedApiError";
  }
}

export interface FindExercisesFilters {
  equipment?: string;
  difficulty?: string;
  movement_pattern?: string;
  exercise_type?: string;
  role?: string;
  limit?: number;
}

export class MusclesWorkedClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(apiKey: string, baseUrl = "https://musclesworked.com") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private async request(path: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "X-Api-Key": this.apiKey,
        "User-Agent": `musclesworked-mcp/${VERSION}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      let detail: string;
      try {
        const body = (await res.json()) as { detail?: string };
        detail = body.detail ?? res.statusText;
      } catch {
        detail = res.statusText;
      }
      throw new MusclesWorkedApiError(res.status, detail);
    }

    return res.json();
  }

  async getMusclesWorked(exercise: string): Promise<unknown> {
    return this.request(`/api/v1/exercises/${encodeURIComponent(exercise)}/muscles`);
  }

  async findExercises(muscle: string, filters?: FindExercisesFilters): Promise<unknown> {
    const params = new URLSearchParams();
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      }
    }
    const qs = params.toString();
    const path = `/api/v1/muscles/${encodeURIComponent(muscle)}/exercises${qs ? `?${qs}` : ""}`;
    return this.request(path);
  }

  async analyzeWorkout(exercises: string[]): Promise<unknown> {
    return this.request("/api/v1/workouts/analyze", {
      method: "POST",
      body: JSON.stringify({ exercises }),
    });
  }

  async getAlternatives(exercise: string, limit?: number): Promise<unknown> {
    const params = limit !== undefined ? `?limit=${limit}` : "";
    return this.request(
      `/api/v1/exercises/${encodeURIComponent(exercise)}/alternatives${params}`,
    );
  }

  async searchExercises(query: string): Promise<unknown> {
    return this.request(`/api/v1/search/exercises?q=${encodeURIComponent(query)}`);
  }

  async searchMuscles(query: string): Promise<unknown> {
    return this.request(`/api/v1/search/muscles?q=${encodeURIComponent(query)}`);
  }
}

import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { NaverSearchConfig } from "../schemas/search.schemas.js";

export abstract class NaverApiCoreClient {
  protected searchBaseUrl = "https://openapi.naver.com/v1/search";
  protected datalabBaseUrl = "https://openapi.naver.com/v1/datalab";
  protected config: NaverSearchConfig | null = null;
  protected axiosInstance: AxiosInstance;

  constructor() {
    // HTTP/HTTPS 에이전트 설정으로 연결 풀링 및 메모리 누수 방지
    this.axiosInstance = axios.create({
      timeout: 30000, // 30초 타임아웃
      maxRedirects: 3,
      // HTTP 연결 풀링 설정은 운영체제에서 처리하도록 단순화
    });
  }

  initialize(config: NaverSearchConfig) {
    this.config = config;
  }

  protected getHeaders(
    contentType: string = "application/json"
  ): AxiosRequestConfig {
    if (!this.config) throw new Error("NaverApiCoreClient is not initialized.");
    return {
      headers: {
        "X-Naver-Client-Id": this.config.clientId,
        "X-Naver-Client-Secret": this.config.clientSecret,
        "Content-Type": contentType,
      },
    };
  }

  protected async get<T>(url: string, params: any): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, {
        params,
        ...this.getHeaders()
      });
      return response.data;
    } catch (error) {
      // 연결 정리는 axios가 자동으로 처리하지만 명시적으로 에러 처리
      throw error;
    }
  }

  protected async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, this.getHeaders());
      return response.data;
    } catch (error) {
      // 연결 정리는 axios가 자동으로 처리하지만 명시적으로 에러 처리
      throw error;
    }
  }

  /**
   * 리소스 정리 메서드 (메모리 누수 방지)
   */
  protected cleanup(): void {
    // 연결 정리 - axios가 자동으로 처리
    this.config = null;
  }
}

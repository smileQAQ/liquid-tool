interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // 请求方法
    headers?: Record<string, string>; // 请求头
    body?: any; // 请求体
    timeout?: number; // 请求超时，单位为毫秒
  }
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // 创建一个带超时控制的 Fetch 请求
  async function fetchWithTimeout(url: string, options: RequestOptions) {
    const { timeout = 5000, ...fetchOptions } = options; // 默认超时时间为 5 秒
  
    const controller = new AbortController(); // 创建一个 AbortController 实例
    const signal = controller.signal; // 获取信号对象，用于控制超时
  
    // 超时处理
    const timeoutId = setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch(url, { ...fetchOptions, signal });
      clearTimeout(timeoutId); // 请求完成后清除超时定时器
  
      if (!response.ok) {
        // 如果响应状态码不为 2xx，抛出错误
        throw new Error(`请求失败，状态码: ${response.status}`);
      }
  
      // 返回响应的 JSON 数据
      return await response.json();
    } catch (error) {
      if ((error as any).name === 'AbortError') {
        // 请求超时
        throw new Error('请求超时');
      }
      throw error; // 其他错误
    }
  }
  
  // 封装的 GET 请求
  export async function get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return fetchWithTimeout(url, {
      method: 'GET',
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    });
  }
  
  // 封装的 POST 请求
  export async function post<T>(url: string, body: any, options: RequestOptions = {}): Promise<T> {
    return fetchWithTimeout(url, {
      method: 'POST',
      headers: { ...defaultHeaders, ...options.headers },
      body: JSON.stringify(body),
      ...options,
    });
  }
  
  // 封装的 PUT 请求
  export async function put<T>(url: string, body: any, options: RequestOptions = {}): Promise<T> {
    return fetchWithTimeout(url, {
      method: 'PUT',
      headers: { ...defaultHeaders, ...options.headers },
      body: JSON.stringify(body),
      ...options,
    });
  }
  
  // 封装的 DELETE 请求
  export async function del<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return fetchWithTimeout(url, {
      method: 'DELETE',
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    });
  }
  
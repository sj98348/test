export class LocalCacheService {
  public static set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("LocalCacheService set failed", error);
    }
  }

  public static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);

      if (!item) {
        return null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.log("LocalCacheService get failed", error);
      return null;
    }
  }

  public static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.log("LocalCacheService remove failed", error);
    }
  }
}

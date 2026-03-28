/**
 * Utility class for object manipulation
 */
export class ObjectHelper {
  /**
   * Pick specific properties from an object
   * @param obj - The source object
   * @param keys - Array of keys to pick
   * @returns A new object with only the picked properties
   */
  static pick<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  /**
   * Omit specific properties from an object
   * @param obj - The source object
   * @param keys - Array of keys to omit
   * @returns A new object without the omitted properties
   */
  static omit<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
      delete result[key];
    }
    return result as Omit<T, K>;
  }
}

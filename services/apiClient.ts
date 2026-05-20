// TODO: Replace localStorage adapter with real backend API

export const apiClient = {
  // Simulates a GET request
  async get<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = localStorage.getItem(key);
        resolve(item ? JSON.parse(item) : null);
      }, 50); // slight simulated delay
    });
  },

  // Simulates a GET list request, returns [] if empty
  async getList<T>(key: string): Promise<T[]> {
    const data = await apiClient.get<T[]>(key);
    return data || [];
  },

  // Simulates a POST/PUT request
  async set<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      }, 50);
    });
  },

  // Simulates an item deletion or a DELETE request
  async remove(key: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(key);
        resolve();
      }, 50);
    });
  },
};

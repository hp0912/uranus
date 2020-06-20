import { TablePaginationConfig } from "antd/lib/table";

type IStorageCategory = 'user';

interface IStorage {
  sortField?: string;
  sortOrder?: 'descend' | 'ascend' | null | undefined;
  filters?: Record<string, React.ReactText[] | null>;
  pagination: TablePaginationConfig;
}

export function getStorage<T extends IStorage>(category: IStorageCategory): T | undefined {
  const uranusStorage = localStorage.getItem('UranusStorage');

  if (uranusStorage) {
    try {
      const allStorage = JSON.parse(uranusStorage);
      return allStorage[category] as T;
    } catch (ex) {
      // do something
    }
  }
}

export function setStorage<T extends IStorage>(category: IStorageCategory, data: T) {
  const uranusStorage = localStorage.getItem('UranusStorage');

  if (uranusStorage) {
    try {
      const allStorage = JSON.parse(uranusStorage);
      allStorage[category] = data;
      localStorage.setItem('UranusStorage', JSON.stringify(allStorage));
    } catch (ex) {
      // do something
    }
  } else {
    localStorage.setItem('UranusStorage', JSON.stringify({ [category]: data }));
  }
}
// shared/api/tasks.ts

import axios from 'axios';
import { Task } from '../types';

const api = axios.create({
  baseURL: 'https://api.yourdomain.com', // 実際のAPIエンドポイントに置き換えてください
  timeout: 10000,
});

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

// 必要に応じて、タスクの追加、編集、削除のAPI関数をここに追加
export const addTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await api.post('/tasks', task);
    return response.data;
  };
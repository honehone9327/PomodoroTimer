// mobile-app/src/redux/tasksSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasks as fetchTasksAPI, addTask as addTaskAPI } from '../../../shared/api/tasks';
import { Task } from '../../../shared/types';

interface TasksState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const tasks = await fetchTasksAPI();
  return tasks;
});

export const addTask = createAsyncThunk('tasks/addTask', async (newTask: Omit<Task, 'id'>) => {
  const task = await addTaskAPI(newTask);
  return task;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // タスクの追加、編集、削除などのアクションをここに追加
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'タスクの取得に失敗しました';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default tasksSlice.reducer;

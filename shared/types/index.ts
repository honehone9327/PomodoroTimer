// shared/types/index.ts

export interface Task {
    id: string;
    title: string;
    completed: boolean;
  }
  
  export type TimerState = 'focus' | 'break' | 'idle';
  export type SoundType = '焚き火' | '雨' | '波' | '森' | 'なし';
  export type CharacterType = 'ずんだもん' | 'なし';
  export type BackgroundImageType = 'default' | 'nature' | 'city' | 'abstract' | 'custom';
  
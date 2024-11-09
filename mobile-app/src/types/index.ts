// mobile-app/shared/types/index.ts

export type TimerState = 'focus' | 'break' | 'idle';
export type SoundType = '焚き火' | '雨' | '波' | '森' | 'なし';
export type CharacterType = 'ずんだもん' | 'なし';
export type BackgroundImageType = 'default' | 'nature' | 'city' | 'abstract' | 'custom';

// RootStackParamListを追加
export type RootStackParamList = {
  Home: undefined;
  Faq: undefined;
  ContactUs: undefined;
};
export type CustomFile = {
  uri: string;
  name: string;
  type?: string;
  size?: number;
};
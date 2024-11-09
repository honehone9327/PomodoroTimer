// mobile-app/src/hooks/useTimer.tsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';

type TimerState = 'focus' | 'break' | 'idle';

const motivationalQuotes = [
  "集中力を保ち、決して諦めない。",
  "限界はあなたの想像力だけ。",
  "自分を追い込んで、他の誰にも頼らない。",
  "偉大なものは快適ゾーンから生まれない。",
  "夢を見て、願い、実行する。",
  "前向きに、努力し、実現させる。",
  "疲れたときに止まるのではなく、終わったときに止まる。",
  "何かのために一生懸命働けば、達成したときの喜びも大きい。",
  "もっと大きな夢を。もっと大きなことを。",
  "チャンスを待つのではなく、作り出す。",
];

const adviceList = [
  "深呼吸をして、リラックスしましょう。",
  "水分補給を忘れずに。",
  "少し体を動かしてみましょう。",
  "目を休ませるために、遠くを見てみましょう。",
  "姿勢を正して、背筋を伸ばしましょう。",
  "次の集中タイムに向けて、目標を再確認しましょう。",
  "感謝の気持ちを思い出してみましょう。",
  "今の気分を言葉で表現してみましょう。",
  "窓の外の景色を眺めてみましょう。",
  "好きな音楽を聴いてリフレッシュしましょう。",
];

const useTimer = (
  initialFocusTime: number = 30,
  initialBreakTime: number = 5,
  initialCycles: number = 4
) => {
  // タイマーの状態管理
  const [focusTime, setFocusTime] = useState(initialFocusTime);
  const [breakTime, setBreakTime] = useState(initialBreakTime);
  const [cycles, setCycles] = useState(initialCycles);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeLeft, setTimeLeftInternal] = useState(initialFocusTime * 60); // 内部で管理
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [advice, setAdvice] = useState("");
  const [avatarSpeech, setAvatarSpeech] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // timerState の最新値を保持する ref
  const timerStateRef = useRef<TimerState>(timerState);
  useEffect(() => {
    timerStateRef.current = timerState;
  }, [timerState]);

  // focusTime と breakTime の最新値を保持する ref
  const focusTimeRef = useRef(focusTime);
  useEffect(() => {
    focusTimeRef.current = focusTime;
  }, [focusTime]);

  const breakTimeRef = useRef(breakTime);
  useEffect(() => {
    breakTimeRef.current = breakTime;
  }, [breakTime]);

  // サウンドの管理
  const [warningSound, setWarningSound] = useState<Audio.Sound | null>(null);
  const [switchSound, setSwitchSound] = useState<Audio.Sound | null>(null);

  // 警告音の再生
  const playWarningSound = useCallback(async () => {
    try {
      if (warningSound) {
        await warningSound.replayAsync();
        console.log("警告音を再生しました。");
      }
    } catch (error) {
      console.error("Warning sound playback failed:", error);
    }
  }, [warningSound]);

  // 切り替え音の再生
  const playSwitchSound = useCallback(async () => {
    try {
      if (switchSound) {
        await switchSound.replayAsync();
        console.log("切り替え音を再生しました。");
      }
    } catch (error) {
      console.error("Switch sound playback failed:", error);
    }
  }, [switchSound]);

  // タイマー完了時の処理
  const handleTimerComplete = useCallback(() => {
    playSwitchSound();

    console.log(`タイマー完了: ${timerStateRef.current} 状態からの切り替え`);

    if (timerStateRef.current === 'focus') {
      if (currentCycle < cycles) {
        setTimerState('break');
        setTimeLeftInternal(breakTimeRef.current * 60);
        setAdvice(getRandomAdvice());
        setAvatarSpeech("お疲れ様です！少し休憩しましょう。");
        console.log(`セット ${currentCycle} 完了。休憩時間 ${breakTimeRef.current} 分に切り替えました。`);
      } else {
        setTimerState('idle');
        setIsRunning(false);
        setAdvice("");
        setAvatarSpeech("素晴らしい！全てのセットが完了しました。");
        console.log("全サイクル完了。タイマーを idle 状態に戻しました。");
      }
    } else if (timerStateRef.current === 'break') {
      setCurrentCycle(prev => prev + 1);
      setTimerState('focus');
      setTimeLeftInternal(focusTimeRef.current * 60);
      setAdvice("");
      setAvatarSpeech("さあ、次の集中タイムを始めましょう！");
      console.log(`休憩完了。セット ${currentCycle + 1} の集中時間 ${focusTimeRef.current} 分に切り替えました。`);
    }
  }, [currentCycle, cycles, playSwitchSound]);

  // サウンドの初期化
  useEffect(() => {
    let warningSoundLoaded: Audio.Sound | null = null;
    let switchSoundLoaded: Audio.Sound | null = null;

    // 警告音のロード
    Audio.Sound.createAsync(
      { uri: 'https://yourserver.com/audio/warning_sound.mp3' }, // 外部URLを使用
      { shouldPlay: false }
    ).then(({ sound }) => {
      setWarningSound(sound);
      warningSoundLoaded = sound;
      console.log("警告音をロードしました。");
    })
      .catch(error => console.error("Warning sound load failed:", error));

    // 切り替え音のロード
    Audio.Sound.createAsync(
      { uri: 'https://yourserver.com/audio/switch_sound.mp3' }, // 外部URLを使用
      { shouldPlay: false }
    ).then(({ sound }) => {
      setSwitchSound(sound);
      switchSoundLoaded = sound;
      console.log("切り替え音をロードしました。");
    })
      .catch(error => console.error("Switch sound load failed:", error));

    return () => {
      // サウンドの解放
      warningSoundLoaded?.unloadAsync().catch(error => console.error("Warning sound unload failed:", error));
      switchSoundLoaded?.unloadAsync().catch(error => console.error("Switch sound unload failed:", error));
      console.log("サウンドを解放しました。");
    };
  }, []); // 空の依存配列で初回のみ実行

  // タイマーのカウントダウン
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftInternal(prevTime => {
          const newTime = prevTime - 1;

          if (newTime === 5 && timerStateRef.current !== 'idle') {
            playWarningSound();
            console.log("タイマーが5分に達しました。警告音を再生します。");
          }

          if (newTime <= 0) {
            handleTimerComplete();
            return 0;
          }

          return newTime;
        });
      }, 1000);
      console.log("タイマーを開始しました。");
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        console.log("タイマーを停止しました。");
      }
    };
  }, [isRunning, playWarningSound, handleTimerComplete]); // timeLeft を削除

  // タイマーの開始
  const startTimer = useCallback(() => {
    if (timerStateRef.current === 'idle') {
      setTimerState('focus');
      setTimeLeftInternal(focusTimeRef.current * 60);
      setMotivationalQuote(getRandomQuote());
      setAvatarSpeech("頑張りましょう！集中タイムの始まりです。");
      console.log(`タイマーを開始します。集中時間: ${focusTimeRef.current} 分`);
    }
    setIsRunning(true);
    console.log("タイマーを実行中に設定しました。");
  }, []);

  // タイマーの一時停止
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setAvatarSpeech("一時停止中です。準備ができたら再開しましょう。");
    console.log("タイマーを一時停止しました。");
  }, []);

  // タイマーのリセット
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimerState('idle');
    setTimeLeftInternal(focusTimeRef.current * 60);
    setCurrentCycle(1);
    setAdvice("");
    setAvatarSpeech("タイマーをリセットしました。新たな気持ちで始めましょう！");
    console.log("タイマーをリセットしました。");
  }, []);

  // 時間のフォーマット
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // 総時間の計算
  const calculateTotalHours = useCallback(() => {
    const totalSeconds = (focusTimeRef.current * cycles + breakTimeRef.current * (cycles - 1)) * 60;
    return (totalSeconds / 3600).toFixed(2);
  }, [cycles]);

  // ランダムな名言の取得
  const getRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  }, []);

  // ランダムなアドバイスの取得
  const getRandomAdvice = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * adviceList.length);
    return adviceList[randomIndex];
  }, []);

  // タイマー円のインタラクション
  const handleCircleInteraction = useCallback(
    (percentage: number) => {
      // 'idle' 状態でも時間調整を許可
      const totalTime = timerStateRef.current === 'focus' ? focusTimeRef.current * 60 : (timerStateRef.current === 'break' ? breakTimeRef.current * 60 : focusTimeRef.current * 60);
      const newTimeLeft = Math.round(totalTime * percentage);
      setTimeLeftInternal(newTimeLeft);
      console.log(`handleCircleInteraction: timerState=${timerStateRef.current}, focusTime=${focusTimeRef.current}, breakTime=${breakTimeRef.current}, percentage=${percentage}, newTimeLeft=${newTimeLeft}`);
    },
    []
  );

  return {
    // 状態
    focusTime,
    setFocusTime,
    breakTime,
    setBreakTime,
    cycles,
    setCycles,
    currentCycle,
    timeLeft,
    timerState,
    isRunning,
    motivationalQuote,
    advice,
    avatarSpeech,

    // 関数
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
    calculateTotalHours,
    handleCircleInteraction, // 時間調整用関数を提供
  };
};

export default useTimer;

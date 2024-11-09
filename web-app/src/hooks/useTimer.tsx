// src/hooks/useTimer.ts

import { useState, useEffect, useCallback, useRef } from 'react'

// タイマーの状態タイプ
type TimerState = 'focus' | 'break' | 'idle'

// サウンドオプションタイプ
type SoundType = '焚き火' | '雨' | '波' | '森' | 'なし'

// 名言リスト
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
]

// アドバイスリスト
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
]

// カスタムフック
const useTimer = (
  initialFocusTime: number = 30, // 初期集中時間（分）
  initialBreakTime: number = 5,  // 初期休憩時間（分）
  initialCycles: number = 4      // 初期セット数
) => {
  // タイマー設定の状態
  const [focusTime, setFocusTime] = useState(initialFocusTime)
  const [breakTime, setBreakTime] = useState(initialBreakTime)
  const [cycles, setCycles] = useState(initialCycles)
  
  // タイマーの動作状態
  const [currentCycle, setCurrentCycle] = useState(1)
  const [timeLeft, setTimeLeft] = useState(initialFocusTime * 60) // 秒数
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [isRunning, setIsRunning] = useState(false)
  
  // その他の状態
  const [motivationalQuote, setMotivationalQuote] = useState("")
  const [advice, setAdvice] = useState("")
  const [avatarSpeech, setAvatarSpeech] = useState("")
  
  // タイマーの参照
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // サウンドの参照
  const warningSoundRef = useRef<HTMLAudioElement | null>(null)
  const switchSoundRef = useRef<HTMLAudioElement | null>(null)
  
  // 名言の初期設定
  useEffect(() => {
    setMotivationalQuote(getRandomQuote())
  }, [])
  
  // サウンドの初期化
  useEffect(() => {
    // 警告音の設定
    warningSoundRef.current = new Audio('/audio/warning_sound.mp3')
    warningSoundRef.current.loop = false
    
    // 切り替え音の設定
    switchSoundRef.current = new Audio('/audio/switch_sound.mp3')
    switchSoundRef.current.loop = false
    
    return () => {
      // クリーンアップ
      warningSoundRef.current?.pause()
      warningSoundRef.current = null
      switchSoundRef.current?.pause()
      switchSoundRef.current = null
    }
  }, [])
  
  // タイマーのカウントダウン処理
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1
          
          // 5秒前に警告音を再生
          if (newTime === 5 && timerState !== 'idle') {
            playWarningSound()
          }
          
          // タイマー完了時の処理
          if (newTime <= 0) {
            handleTimerComplete()
            return 0
          }
          
          return newTime
        })
      }, 1000)
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRunning, timeLeft, timerState])
  
  // タイマー完了時の処理
  const handleTimerComplete = useCallback(() => {
    playSwitchSound()
    
    if (timerState === 'focus') {
      if (currentCycle < cycles) {
        setTimerState('break')
        setTimeLeft(breakTime * 60)
        setAdvice(getRandomAdvice())
        setAvatarSpeech("お疲れ様です！少し休憩しましょう。")
      } else {
        setTimerState('idle')
        setIsRunning(false)
        setAdvice("")
        setAvatarSpeech("素晴らしい！全てのセットが完了しました。")
      }
    } else if (timerState === 'break') {
      setCurrentCycle(prev => prev + 1)
      setTimerState('focus')
      setTimeLeft(focusTime * 60)
      setAdvice("")
      setAvatarSpeech("さあ、次の集中タイムを始めましょう！")
    }
  }, [timerState, currentCycle, cycles, breakTime, focusTime])
  
  // タイマーの開始
  const startTimer = useCallback(() => {
    if (timerState === 'idle') {
      setTimerState('focus')
      setTimeLeft(focusTime * 60)
      setMotivationalQuote(getRandomQuote())
      setAvatarSpeech("頑張りましょう！集中タイムの始まりです。")
    }
    setIsRunning(true)
  }, [timerState, focusTime])
  
  // タイマーの一時停止
  const pauseTimer = useCallback(() => {
    setIsRunning(false)
    setAvatarSpeech("一時停止中です。準備ができたら再開しましょう。")
  }, [])
  
  // タイマーのリセット
  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimerState('idle')
    setTimeLeft(focusTime * 60)
    setCurrentCycle(1)
    setAdvice("")
    setAvatarSpeech("タイマーをリセットしました。新たな気持ちで始めましょう！")
  }, [focusTime])
  
  // 時間のフォーマット
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])
  
  // 総時間の計算
  const calculateTotalHours = useCallback(() => {
    const totalSeconds = (focusTime * cycles + breakTime * (cycles - 1)) * 60
    return (totalSeconds / 3600).toFixed(2)
  }, [focusTime, breakTime, cycles])
  
  // 警告音の再生
  const playWarningSound = useCallback(() => {
    warningSoundRef.current?.play().catch(error => console.error("Warning sound playback failed:", error))
  }, [])
  
  // 切り替え音の再生
  const playSwitchSound = useCallback(() => {
    switchSoundRef.current?.play().catch(error => console.error("Switch sound playback failed:", error))
  }, [])
  
  // ランダムな名言の取得
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    return motivationalQuotes[randomIndex]
  }
  
  // ランダムなアドバイスの取得
  const getRandomAdvice = () => {
    const randomIndex = Math.floor(Math.random() * adviceList.length)
    return adviceList[randomIndex]
  }
  
  // タイマー円のインタラクション
  const handleCircleInteraction = useCallback((percentage: number) => {
    if (timerState === 'idle') return
    const totalTime = timerState === 'focus' ? focusTime * 60 : breakTime * 60
    const newTimeLeft = Math.round(totalTime * percentage)
    setTimeLeft(newTimeLeft)
  }, [timerState, focusTime, breakTime])
  
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
    handleCircleInteraction,
  }
}

export default useTimer

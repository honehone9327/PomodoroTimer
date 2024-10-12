// src/components/Timer/PomodoroTimer.tsx

'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  BookOpen,
  Coffee,
  Play,
  Pause,
  Music,
  Volume2,
  Settings,
  BarChart2,
  RotateCcw,
  User,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Slider } from '@/components/ui/Slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import SettingsComponent from '@/components/Settings/Settings' // Settings.tsx のインポート
import styles from '../../styles/Timer.module.css' // 正しいパスとファイル名

type TimerState = 'focus' | 'break' | 'idle'
type SoundType = '焚き火' | '雨' | '波' | '森' | 'なし'
type CharacterType = 'ずんだもん' | 'なし'
type BackgroundImageType = 'default' | 'nature' | 'city' | 'abstract' | 'custom'

const soundOptions: SoundType[] = ['焚き火', '雨', '波', '森', 'なし']
const characterOptions: CharacterType[] = ['ずんだもん', 'なし']
const backgroundOptions: BackgroundImageType[] = ['default', 'nature', 'city', 'abstract']

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
  "チャンスを待つのではなく、作り出す。"
]

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
  "好きな音楽を聴いてリフレッシュしましょう。"
]

export default function PomodoroTimer() {
  // 設定ダイアログの状態管理
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // その他の状態管理
  const [focusTime, setFocusTime] = useState(30)
  const [breakTime, setBreakTime] = useState(5)
  const [cycles, setCycles] = useState(4)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [timeLeft, setTimeLeft] = useState(focusTime * 60)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [isRunning, setIsRunning] = useState(false)
  const [totalTime, setTotalTime] = useState(focusTime * 60)
  const [selectedSound, setSelectedSound] = useState<SoundType>('なし')
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('ずんだもん')
  const [selectedBackground, setSelectedBackground] = useState<BackgroundImageType>('default')
  const [motivationalQuote, setMotivationalQuote] = useState("")
  const [advice, setAdvice] = useState("")
  const [avatarSpeech, setAvatarSpeech] = useState("")
  const [customBackground, setCustomBackground] = useState<string>('')

  const timerRef = useRef<SVGCircleElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMotivationalQuote(getRandomQuote())
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1
          if (newTime === 5 && timerState !== 'idle') {
            playWarningSound()
          }
          if (newTime <= 0) {
            handleTimerComplete()
            return 0
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft, timerState])

  useEffect(() => {
    if (audioRef.current) {
      if (selectedSound !== 'なし') {
        audioRef.current.src = `/audio/${selectedSound}.mp3`
        audioRef.current.loop = true
        audioRef.current.play().catch(error => console.error("Audio playback failed:", error))
      } else {
        audioRef.current.pause()
      }
    }

    if (videoRef.current) {
      if (selectedBackground !== 'default' && selectedBackground !== 'custom') {
        videoRef.current.src = getBackgroundVideo()
        videoRef.current.play().catch(error => console.error("Video playback failed:", error))
      } else if (selectedBackground === 'custom') {
        videoRef.current.src = customBackground
        videoRef.current.play().catch(error => console.error("Custom video playback failed:", error))
      } else {
        videoRef.current.pause()
      }
    }
  }, [selectedSound, selectedBackground, customBackground])

  const handleTimerComplete = () => {
    playSwitchSound()
    if (timerState === 'focus') {
      if (currentCycle < cycles) {
        setTimerState('break')
        setTimeLeft(breakTime * 60)
        setTotalTime(breakTime * 60)
        setAdvice(getRandomAdvice())
        setAvatarSpeech("お疲れ様です！少し休憩しましょう。")
      } else {
        setTimerState('idle')
        setIsRunning(false)
        setAdvice("")
        setAvatarSpeech("素晴らしい！全てのセットが完了しました。")
      }
    } else if (timerState === 'break') {
      setCurrentCycle((prev) => prev + 1)
      setTimerState('focus')
      setTimeLeft(focusTime * 60)
      setTotalTime(focusTime * 60)
      setAdvice("")
      setAvatarSpeech("さあ、次の集中タイムを始めましょう！")
    }
  }

  const startTimer = () => {
    if (timerState === 'idle') {
      setTimerState('focus')
      setTimeLeft(focusTime * 60)
      setTotalTime(focusTime * 60)
      setMotivationalQuote(getRandomQuote())
      setAvatarSpeech("頑張りましょう！集中タイムの始まりです。")
    }
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
    setAvatarSpeech("一時停止中です。準備ができたら再開しましょう。")
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimerState('idle')
    setTimeLeft(focusTime * 60)
    setTotalTime(focusTime * 60)
    setCurrentCycle(1)
    setAdvice("")
    setAvatarSpeech("タイマーをリセットしました。新たな気持ちで始めましょう！")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculateTotalHours = () => {
    const totalSeconds = (focusTime * cycles + breakTime * (cycles - 1)) * 60
    return (totalSeconds / 3600).toFixed(2)
  }

  const handleCircleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!timerRef.current || timerState === 'idle') return
    const rect = timerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = clientX - centerX
    const y = clientY - centerY

    let angle = Math.atan2(y, x) + Math.PI / 2
    if (angle < 0) angle += 2 * Math.PI
    let percentage = angle / (2 * Math.PI)

    const newTimeLeft = Math.round(totalTime * percentage)
    setTimeLeft(newTimeLeft)
  }, [timerState, totalTime])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleCircleInteraction(moveEvent.clientX, moveEvent.clientY)
    }
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleCircleInteraction(touch.clientX, touch.clientY)
  }

  const playWarningSound = () => {
    const audio = new Audio('/audio/warning_sound.mp3')
    audio.play().catch(error => console.error("Warning sound playback failed:", error))
  }

  const playSwitchSound = () => {
    const audio = new Audio('/audio/switch_sound.mp3')
    audio.play().catch(error => console.error("Switch sound playback failed:", error))
  }

  const getBackgroundVideo = () => {
    switch (selectedBackground) {
      case 'nature':
        return '/videos/nature.mp4'
      case 'city':
        return '/videos/city.mp4'
      case 'abstract':
        return '/videos/abstract.mp4'
      default:
        return ''
    }
  }

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    return motivationalQuotes[randomIndex]
  }

  const getRandomAdvice = () => {
    const randomIndex = Math.floor(Math.random() * adviceList.length)
    return adviceList[randomIndex]
  }

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setCustomBackground(result)
      setSelectedBackground('custom')
    }
    reader.readAsDataURL(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false
  })

  const renderClock = () => {
    return (
      <svg
        className="w-48 h-48 sm:w-64 sm:h-64"
        viewBox="0 0 200 200" // viewBoxを200x200に拡大
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => e.preventDefault()}
        onTouchMove={handleTouchMove}
      >
        {/* 背景円 */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="transparent"
          stroke="#E2E8F0"
          strokeWidth="10" // strokeWidthを6から10に変更して円を太く
        />
        {/* タイマー進行円 */}
        <circle
          ref={timerRef}
          cx="100"
          cy="100"
          r="90"
          fill="transparent"
          stroke={timerState === 'focus' ? "#4299E1" : "#38A169"}
          strokeWidth="10" // strokeWidthを6から10に変更して円を太く
          strokeDasharray={`${2 * Math.PI * 90}`}
          strokeDashoffset={2 * Math.PI * 90 * (1 - timeLeft / totalTime)}
          transform="rotate(-90 100 100)"
          className="transition-stroke-dashoffset duration-750 ease-linear"
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
        />
        {/* 集中時間・休憩時間のテキストを中央揃えで表示 */}
        {timerState === 'focus' && (
          <text
            x="100"
            y="50" // y座標を40から50に変更して少し下に
            textAnchor="middle"
            alignmentBaseline="middle"
            style={{ fontSize: '16px', fill: '#2D3748', fontFamily: 'Arial, sans-serif' }} // フォントサイズを16pxに設定
          >
            集中時間
          </text>
        )}
        {timerState === 'break' && (
          <text
            x="100"
            y="50" // y座標を40から50に変更して少し下に
            textAnchor="middle"
            alignmentBaseline="middle"
            style={{ fontSize: '16px', fill: '#2D3748', fontFamily: 'Arial, sans-serif' }} // フォントサイズを16pxに設定
          >
            休憩時間
          </text>
        )}
        {/* 時間テキストを中央に配置 */}
        <text
          x="100"
          y="100"
          textAnchor="middle"
          alignmentBaseline="middle"
          style={{ fontSize: '40px', fontWeight: 'bold', fill: '#2D3748', fontFamily: 'Arial, sans-serif' }} // フォントサイズを48pxから40pxに変更
        >
          {formatTime(timeLeft)}
        </text>
        {/* セット数のテキストを上にずらす */}
        <g transform="translate(100, 150)" textAnchor="middle" alignmentBaseline="middle"> {/* translateYを160から150に変更 */}
          <text
            x="0"
            y="15" // y座標を20から15に変更して少し上に
            style={{ fontSize: '12px', fill: '#2D3748', fontFamily: 'Arial, sans-serif' }} // フォントサイズを12pxに設定
          >
            セット
          </text>
          <text
            x="0"
            y="25" // y座標を30から25に変更して少し上に
            style={{ fontSize: '12px', fontWeight: 'bold', fill: '#2D3748', fontFamily: 'Arial, sans-serif' }} // フォントサイズを12pxに設定
          >
            {currentCycle}/{cycles}
          </text>
        </g>
      </svg>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      {/* 設定ボタンを右上に固定（アイコンのみ） */}
      <div className="absolute top-4 right-4 z-20">
        <Popover>
          <PopoverTrigger>
            <Button variant="outline" className="p-2 rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="grid gap-2">
              <Link href="/privacy-policy" passHref>
                <Button variant="link" className="w-full justify-start text-xs">
                  プライバシーポリシー
                </Button>
              </Link>
              <Link href="/account-settings" passHref>
                <Button variant="link" className="w-full justify-start text-xs">
                  アカウント設定
                </Button>
              </Link>
              <Link href="/notification-settings" passHref>
                <Button variant="link" className="w-full justify-start text-xs">
                  通知設定
                </Button>
              </Link>
              {/* 他の設定項目があれば追加 */}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 背景動画とオーバーレイ */}
      {selectedBackground !== 'default' && selectedBackground !== 'custom' && (
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          src={getBackgroundVideo()}
          autoPlay
          loop
          muted
        />
      )}
      {selectedBackground === 'custom' && (
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          src={customBackground}
          autoPlay
          loop
          muted
        />
      )}
      <div className="absolute inset-0 bg-white bg-opacity-30 -z-5"></div>

      <main className="flex-grow flex items-center justify-center bg-gray-100 text-gray-800 p-4">
        <Card className="relative z-10 w-full max-w-md bg-white bg-opacity-90 shadow-lg rounded-lg">
          <CardHeader className="border-b border-gray-200" children={undefined}>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {avatarSpeech && (
              <div className="bg-blue-100 p-2 rounded-lg relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-blue-100"></div>
                <p className="text-center text-xs">{avatarSpeech}</p>
              </div>
            )}
            {timerState === 'idle' ? (
              <>
                <p className="text-center text-[10px] sm:text-[12px]">今日はどのようなタイマーで作業しますか？</p>
                <div className="p-2 bg-gray-100 rounded-md mt-4">
                  <p className="text-center italic text-[12px] sm:text-[14px]">"{motivationalQuote}"</p>
                </div>
                <div className="space-y-4 mt-4">
                  {/* 集中時間 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="focusTime" className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-base">集中時間</span>
                      </Label>
                      <span className="text-base font-bold">{focusTime}分</span>
                    </div>
                    <Slider
                      id="focusTime"
                      min={20}
                      max={60}
                      step={1}
                      value={[focusTime]}
                      onValueChange={(value: number[]) => setFocusTime(value[0])}
                      className="slider-blue"
                    />
                  </div>
                  {/* 休憩時間 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="breakTime" className="flex items-center space-x-2">
                        <Coffee className="w-5 h-5" />
                        <span className="text-base">休憩時間</span>
                      </Label>
                      <span className="text-base font-bold">{breakTime}分</span>
                    </div>
                    <Slider
                      id="breakTime"
                      min={2}
                      max={10}
                      step={1}
                      value={[breakTime]}
                      onValueChange={(value: number[]) => setBreakTime(value[0])}
                      className="slider-blue"
                    />
                  </div>
                  {/* セット数 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cycles" className="flex items-center space-x-2">
                        <BarChart2 className="w-5 h-5" />
                        <span className="text-xs sm:text-sm">セット数</span>
                      </Label>
                      <span className="text-xs sm:text-sm font-bold">{cycles}回</span>
                    </div>
                    <Slider
                      id="cycles"
                      min={1}
                      max={20}
                      step={1}
                      value={[cycles]}
                      onValueChange={(value: number[]) => setCycles(value[0])}
                      className="slider-blue"
                    />
                  </div>
                  {/* トータル時間の表示 */}
                  <div className="mt-4 p-2 bg-green-100 rounded-md">
                    <p className="text-center text-sm sm:text-base font-semibold">
                      トータル: {calculateTotalHours()} 時間
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Popover>
                    <PopoverTrigger>
                      <Button variant="outline" className="flex-1 text-xs flex items-center justify-center min-w-[80px]">
                        <Avatar className="mr-1 w-4 h-4">
                          <AvatarImage src={`/images/avatars/${selectedCharacter}.png`} alt={selectedCharacter} />
                          <AvatarFallback>{selectedCharacter[0]}</AvatarFallback>
                        </Avatar>
                        アバター選択
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      <div className="grid gap-2">
                        {characterOptions.map((char) => (
                          <Button
                            key={char}
                            variant={selectedCharacter === char ? "default" : "outline"}
                            className="w-full justify-start text-xs capitalize"
                            onClick={() => setSelectedCharacter(char)}
                          >
                            {char === 'なし' ? 'なし' : char}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger>
                      <Button variant="outline" className="flex-1 text-xs flex items-center justify-center min-w-[80px]">
                        <Music className="mr-1 w-5 h-5" />
                        音楽選択
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      <div className="grid gap-2">
                        {soundOptions.map((sound) => (
                          <Button
                            key={sound}
                            variant={selectedSound === sound ? "default" : "outline"}
                            className="w-full justify-start text-xs capitalize"
                            onClick={() => setSelectedSound(sound)}
                          >
                            {sound}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={startTimer} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded-lg mt-4">
                  START
                </Button>
              </>
            ) : (
              <>
                <div className="p-2 bg-gray-100 rounded-md">
                  <p className="text-center italic text-xs sm:text-[12px]">"{motivationalQuote}"</p>
                </div>
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto mt-2">
                  {renderClock()}
                </div>
                {timerState === 'break' && advice && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-md">
                    <p className="text-center text-xs sm:text-[12px] italic select-none">{advice}</p>
                  </div>
                )}
                <div className="flex justify-center space-x-2 mt-2">
                  <Button onClick={isRunning ? pauseTimer : startTimer} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button onClick={resetTimer} className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-full">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  <Popover>
                    <PopoverTrigger>
                      <Button className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-full">
                        <Volume2 className="w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      <div className="grid gap-2">
                        {soundOptions.map((sound) => (
                          <Button
                            key={sound}
                            variant={selectedSound === sound ? "default" : "outline"}
                            className="w-full justify-start text-xs capitalize"
                            onClick={() => setSelectedSound(sound)}
                          >
                            {sound}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {/* 新しくアバター変更のポップオーバーを追加 */}
                  <Popover>
                    <PopoverTrigger>
                      <Button className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-full">
                        <User className="w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      <div className="grid gap-2">
                        {characterOptions.map((char) => (
                          <Button
                            key={char}
                            variant={selectedCharacter === char ? "default" : "outline"}
                            className="w-full justify-start text-xs capitalize"
                            onClick={() => setSelectedCharacter(char)}
                          >
                            {char === 'なし' ? 'なし' : char}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Settingsコンポーネントの使用 */}
      <SettingsComponent
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        selectedBackground={selectedBackground}
        setSelectedBackground={(bg: string) => setSelectedBackground(bg as BackgroundImageType)}
        customBackground={customBackground}
        setCustomBackground={setCustomBackground}
        backgroundOptions={backgroundOptions}
        characterOptions={characterOptions}
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
        soundOptions={soundOptions}
        selectedSound={selectedSound}
        setSelectedSound={(sound: SoundType) => setSelectedSound(sound)}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
      />

      <audio ref={audioRef} />
    </div>
  )
}

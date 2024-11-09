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

import useTimer from '@/hooks/useTimer' // useTimer フックのインポート

type TimerState = 'focus' | 'break' | 'idle'
type SoundType = '焚き火' | '雨' | '波' | '森' | 'なし'
type CharacterType = 'ずんだもん' | 'なし'
type BackgroundImageType = 'default' | 'nature' | 'city' | 'abstract' | 'custom'

const soundOptions: SoundType[] = ['焚き火', '雨', '波', '森', 'なし']
const characterOptions: CharacterType[] = ['ずんだもん', 'なし']
const backgroundOptions: BackgroundImageType[] = ['default', 'nature', 'city', 'abstract']

export default function PomodoroTimer() {
  // useTimer フックの使用
  const {
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
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
    calculateTotalHours,
    handleCircleInteraction,
  } = useTimer(30, 5, 4) // 初期値を必要に応じて変更

  // その他の状態管理
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedSound, setSelectedSound] = useState<SoundType>('なし')
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('ずんだもん')
  const [selectedBackground, setSelectedBackground] = useState<BackgroundImageType>('default')
  const [customBackground, setCustomBackground] = useState<string>('')

  const videoRef = useRef<HTMLVideoElement>(null)
  
  // SVG 要素の ref を追加
  const svgRef = useRef<SVGSVGElement>(null)

  // Dragging state
  const [isDragging, setIsDragging] = useState(false)

  // ドロップゾーンの設定
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setCustomBackground(result)
      setSelectedBackground('custom')
    }
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    multiple: false
  })

  // 背景動画の管理
  useEffect(() => {
    if (videoRef.current) {
      if (selectedBackground !== 'default' && selectedBackground !== 'custom') {
        videoRef.current.src = getBackgroundVideo()
        videoRef.current.play().catch(error => console.error("Video playback failed:", error))
      } else if (selectedBackground === 'custom' && customBackground !== '') {
        videoRef.current.src = customBackground
        videoRef.current.play().catch(error => console.error("Custom video playback failed:", error))
      } else {
        videoRef.current.pause()
      }
    }
  }, [selectedBackground, customBackground])

  // 背景動画の取得
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

  // タイマー円のインタラクション処理
  const handleCircleInteractionHandler = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current || timerState === 'idle') return
    const rect = svgRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = clientX - centerX
    const y = clientY - centerY

    let angle = Math.atan2(y, x) + Math.PI / 2
    if (angle < 0) angle += 2 * Math.PI
    let percentage = angle / (2 * Math.PI)

    // Clamp percentage between 0 and 1
    percentage = Math.max(0, Math.min(1, percentage))

    handleCircleInteraction(percentage)
  }, [timerState, handleCircleInteraction])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleCircleInteractionHandler(moveEvent.clientX, moveEvent.clientY)
    }
    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleCircleInteractionHandler(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
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
      {selectedBackground !== 'default' && selectedBackground !== 'custom' && getBackgroundVideo() !== '' && (
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          src={getBackgroundVideo()}
          autoPlay
          loop
          muted
        />
      )}
      {selectedBackground === 'custom' && customBackground !== '' && (
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
          <CardHeader className="border-b border-gray-200">
            <h2 className="text-xl font-bold text-blue-800">Pomodoro Timer</h2>
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
                      onValueChange={(value: number[]) => {
                        setFocusTime(value[0])
                      }}
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
                  {/* アバター選択 */}
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
                  {/* 音楽選択 */}
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
                  <svg
                    ref={svgRef} // SVG要素にrefを設定
                    className="w-full h-full"
                    viewBox="0 0 200 200"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* 背景円 */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="transparent"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                    />
                    {/* タイマー進行円 */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="transparent"
                      stroke={timerState === 'focus' ? "#4299E1" : "#38A169"}
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 90}`}
                      strokeDashoffset={2 * Math.PI * 90 * (1 - timeLeft / (timerState === 'focus' ? focusTime * 60 : breakTime * 60))}
                      transform="rotate(-90 100 100)"
                      style={{ transition: isDragging ? 'none' : 'stroke-dashoffset 0.75s linear', cursor: 'pointer' }}
                    />
                    {/* タイマー状態のテキスト */}
                    {timerState === 'focus' && (
                      <text
                        x="100"
                        y="50"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        style={{ fontSize: '16px', fill: '#2D3748', fontFamily: 'Arial, sans-serif' }}
                      >
                        集中時間
                      </text>
                    )}
                    {timerState === 'break' && (
                      <text
                        x="100"
                        y="50"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        style={{ fontSize: '16px', fill: '#2D3748', fontFamily: 'Arial, sans-serif' }}
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
                      style={{ fontSize: '40px', fontWeight: 'bold', fill: '#2D3748', fontFamily: 'Arial, sans-serif' }}
                    >
                      {formatTime(timeLeft)}
                    </text>
                    {/* セット数のテキスト */}
                    <g transform="translate(100, 150)" textAnchor="middle" alignmentBaseline="middle">
                      <text
                        x="0"
                        y="15"
                        style={{ fontSize: '12px', fill: '#2D3748', fontFamily: 'Arial, sans-serif' }}
                      >
                        セット
                      </text>
                      <text
                        x="0"
                        y="25"
                        style={{ fontSize: '12px', fontWeight: 'bold', fill: '#2D3748', fontFamily: 'Arial, sans-serif' }}
                      >
                        {currentCycle}/{cycles}
                      </text>
                    </g>
                  </svg>
                </div>
                {timerState === 'break' && advice && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-md">
                    <p className="text-center text-xs sm:text-[12px] italic select-none">{advice}</p>
                  </div>
                )}
                <div className="flex justify-center space-x-2 mt-2">
                  {/* 再生/一時停止ボタン */}
                  <Button onClick={isRunning ? pauseTimer : startTimer} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  {/* リセットボタン */}
                  <Button onClick={resetTimer} className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-full">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  {/* 音量調整 */}
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
                  {/* ユーザー設定 */}
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
        setSelectedBackground={(bg: BackgroundImageType) => setSelectedBackground(bg)}
        customBackground={customBackground}
        setCustomBackground={setCustomBackground}
        backgroundOptions={backgroundOptions}
        characterOptions={characterOptions}
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
        soundOptions={soundOptions}
        selectedSound={selectedSound}
        setSelectedSound={(sound: SoundType) => setSelectedSound(sound)}
        // カスタム背景のアップロード処理をフックに委譲
        onDrop={(acceptedFiles: File[]) => {
          if (acceptedFiles.length > 0) {
            const fileUri = URL.createObjectURL(acceptedFiles[0])
            setCustomBackground(fileUri)
            setSelectedBackground('custom')
            alert('カスタム背景が設定されました。')
          }
        }}
      />
    </div>
  )
}

// 背景動画の取得（修正版）
function fetchBackgroundVideo(selectedBackground: BackgroundImageType) {
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

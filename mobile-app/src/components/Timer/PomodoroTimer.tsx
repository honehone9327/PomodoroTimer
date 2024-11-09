// mobile-app/src/components/Timer/PomodoroTimer.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import { Button } from '../../components/ui/Button';
import { Label } from '../../components/ui/Label';
import { Slider } from '../../components/ui/Slider';
import Popover from 'react-native-popover-view';
import Avatar from '../../components/ui/Avatar';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import SettingsComponent from '../../components/Settings/SettingsScreen';
import * as DocumentPicker from 'expo-document-picker';
import {
  BookOpen,
  Coffee,
  Play,
  Pause,
  Music,
  Volume2,
  Settings as SettingsIcon,
  BarChart2,
  RotateCcw,
  User as UserIcon,
} from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';
import useTimer from '../../hooks/useTimer';
import { BackgroundImageType, CharacterType, SoundType } from '../../types';

// SVG関連のインポート
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

const soundOptions: SoundType[] = ['焚き火', '雨', '波', '森', 'なし'];
const characterOptions: CharacterType[] = ['ずんだもん', 'なし'];
const backgroundOptions: BackgroundImageType[] = ['default', 'nature', 'city', 'abstract'];

const PomodoroTimer: React.FC = () => {
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
    handleCircleInteraction, // 時間調整用関数を取得
  } = useTimer(); // 初期値は useTimer 内で設定

  // その他の状態管理
  const [isSettingsPopoverVisible, setSettingsPopoverVisible] = useState<boolean>(false);
  const [isAvatarPopoverVisible, setAvatarPopoverVisible] = useState<boolean>(false);
  const [isMusicPopoverVisible, setMusicPopoverVisible] = useState<boolean>(false);
  const [isVolumePopoverVisible, setVolumePopoverVisible] = useState<boolean>(false);
  const [isUserPopoverVisible, setUserPopoverVisible] = useState<boolean>(false);
  const [selectedSound, setSelectedSound] = useState<SoundType>('なし');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('ずんだもん');
  const [selectedBackground, setSelectedBackground] = useState<BackgroundImageType>('default');
  const [customBackground, setCustomBackground] = useState<string>('');

  // タイマー円のパラメータ（固定サイズ）
  const size = 200; // 円のサイズを200に設定
  const strokeWidth = 10; // 線の太さを10に設定

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // タイマー進行割合
  const totalTime = timerState === 'focus' ? focusTime * 60 : (timerState === 'break' ? breakTime * 60 : focusTime * 60);
  const value = timeLeft;

  const progress = totalTime > 0 ? value / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  // タッチイベントの処理
  const handleCircleInteractionHandler = useCallback(
    (x: number, y: number) => {
      const centerX = size / 2;
      const centerY = size / 2;

      const dx = x - centerX;
      const dy = y - centerY;

      // 角度を計算（ラジアン）
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;

      // パーセンテージを計算（0から1）
      let percentage = angle / (2 * Math.PI);

      // パーセンテージをクランプ
      percentage = Math.max(0, Math.min(1, percentage));

      // デバッグ用にログを出力
      console.log(`Touch Position: (${x}, ${y})`);
      console.log(`Angle: ${angle}`);
      console.log(`Percentage: ${percentage}`);

      // フックの関数を呼び出して時間を調整
      handleCircleInteraction(percentage);

      // timeLeft は useTimer で更新されるため、正確な adjusted time は useTimer 側でログ出力
    },
    [handleCircleInteraction, size]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        handleGesture(evt);
      },
      onPanResponderMove: (evt, gestureState) => {
        handleGesture(evt);
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    })
  ).current;

  function handleGesture(event: GestureResponderEvent) {
    const { locationX, locationY } = event.nativeEvent;
    handleCircleInteractionHandler(locationX, locationY);
  }

  // 背景動画の管理
  const videoRef = useRef<Video>(null);
  useEffect(() => {
    if (videoRef.current) {
      if (selectedBackground !== 'default' && selectedBackground !== 'custom') {
        videoRef.current
          .loadAsync({ uri: getBackgroundVideo() }, {}, false)
          .then(() => {
            videoRef.current
              ?.playAsync()
              .then(() => console.log("背景動画を再生しました。"))
              .catch((error) => console.error('Video playback failed:', error));
          })
          .catch(error => console.error("Video load failed:", error));
      } else if (selectedBackground === 'custom' && customBackground !== '') {
        videoRef.current
          .loadAsync({ uri: customBackground }, {}, false)
          .then(() => {
            videoRef.current
              ?.playAsync()
              .then(() => console.log("カスタム背景動画を再生しました。"))
              .catch((error) => console.error('Custom video playback failed:', error));
          })
          .catch(error => console.error("Custom video load failed:", error));
      } else {
        videoRef.current
          .stopAsync()
          .then(() => console.log("背景動画を停止しました。"))
          .catch((error) => console.error('Video stop failed:', error));
      }
    }
  }, [selectedBackground, customBackground]);

  // カスタム背景のアップロード処理
  const handleCustomBackground = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setCustomBackground(uri);
        setSelectedBackground('custom');
        Alert.alert('成功', 'カスタム背景が設定されました。');
        console.log(`カスタム背景を設定しました: ${uri}`);
      } else if (result.canceled) {
        Alert.alert('キャンセル', 'カスタム背景の選択がキャンセルされました。');
        console.log("カスタム背景の選択がキャンセルされました。");
      } else {
        Alert.alert('エラー', 'ファイルが選択されませんでした。');
        console.log("カスタム背景の選択に失敗しました。");
      }
    } catch (error) {
      console.error('Custom background selection failed:', error);
      Alert.alert('エラー', 'カスタム背景の選択中にエラーが発生しました。');
    }
  };

  // 背景動画の取得
  function getBackgroundVideo() {
    switch (selectedBackground) {
      case 'nature':
        return 'https://yourserver.com/videos/nature.mp4';
      case 'city':
        return 'https://yourserver.com/videos/city.mp4';
      case 'abstract':
        return 'https://yourserver.com/videos/abstract.mp4';
      default:
        return '';
    }
  }

  return (
    <View style={styles.container}>
      {/* 設定ボタンを右上に固定（アイコンのみ） */}
      <Popover
        isVisible={isSettingsPopoverVisible}
        onRequestClose={() => setSettingsPopoverVisible(false)}
        from={
          <TouchableOpacity
            onPress={() => setSettingsPopoverVisible(true)}
            style={styles.settingsButton}
          >
            <SettingsIcon width={20} height={20} color="#FFFFFF" />
          </TouchableOpacity>
        }
      >
        <View style={styles.popoverContent}>
          {/* ポップオーバーの内容 */}
          <TouchableOpacity
            onPress={() => {
              /* ナビゲーション */
              setSettingsPopoverVisible(false);
              // 例: navigation.navigate('PrivacyPolicy');
            }}
          >
            <Button variant="link" style={styles.popoverButton}>
              プライバシーポリシー
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              /* ナビゲーション */
              setSettingsPopoverVisible(false);
              // 例: navigation.navigate('AccountSettings');
            }}
          >
            <Button variant="link" style={styles.popoverButton}>
              アカウント設定
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              /* ナビゲーション */
              setSettingsPopoverVisible(false);
              // 例: navigation.navigate('NotificationSettings');
            }}
          >
            <Button variant="link" style={styles.popoverButton}>
              通知設定
            </Button>
          </TouchableOpacity>
        </View>
      </Popover>

      {/* 背景動画とオーバーレイ */}
      {selectedBackground !== 'default' &&
        selectedBackground !== 'custom' &&
        getBackgroundVideo() !== '' && (
          <Video
            ref={videoRef}
            source={{ uri: getBackgroundVideo() }}
            style={styles.backgroundVideo}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
            isMuted
          />
        )}
      {selectedBackground === 'custom' && customBackground !== '' && (
        <Video
          ref={videoRef}
          source={{ uri: customBackground }}
          style={styles.backgroundVideo}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay
          isMuted
        />
      )}
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.main}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.scrollContainer}>
          <Card style={styles.card}>
            <CardHeader>
              <Text style={styles.headerText}>Pomodoro Timer</Text>
            </CardHeader>
            <CardContent>
              {avatarSpeech !== '' && (
                <View style={styles.avatarSpeechContainer}>
                  <Text style={styles.avatarSpeechText}>{avatarSpeech}</Text>
                </View>
              )}
              {timerState === 'idle' ? (
                <>
                  <Text style={styles.promptText}>今日はどのようなタイマーで作業しますか？</Text>
                  <View style={styles.quoteContainer}>
                    <Text style={styles.quoteText}>"{motivationalQuote}"</Text>
                  </View>
                  <View style={styles.settingsContainer}>
                    {/* 集中時間 */}
                    <View style={styles.settingGroup}>
                      <View style={styles.settingLabel}>
                        <BookOpen width={20} height={20} color="#4B5563" />
                        <Label>集中時間</Label>
                      </View>
                      <Text style={styles.settingValue}>{focusTime}分</Text>
                      <Slider
                        id="focusTime"
                        min={20}
                        max={60}
                        step={1}
                        value={focusTime}
                        onValueChange={(value) => {
                          setFocusTime(value);
                          console.log(`集中時間が変更されました: ${value}分`);
                        }}
                      />
                    </View>
                    {/* 休憩時間 */}
                    <View style={styles.settingGroup}>
                      <View style={styles.settingLabel}>
                        <Coffee width={20} height={20} color="#4B5563" />
                        <Label>休憩時間</Label>
                      </View>
                      <Text style={styles.settingValue}>{breakTime}分</Text>
                      <Slider
                        id="breakTime"
                        min={2}
                        max={10}
                        step={1}
                        value={breakTime}
                        onValueChange={(value) => {
                          setBreakTime(value);
                          console.log(`休憩時間が変更されました: ${value}分`);
                        }}
                      />
                    </View>
                    {/* セット数 */}
                    <View style={styles.settingGroup}>
                      <View style={styles.settingLabel}>
                        <BarChart2 width={20} height={20} color="#4B5563" />
                        <Label>セット数</Label>
                      </View>
                      <Text style={styles.settingValue}>{cycles}回</Text>
                      <Slider
                        id="cycles"
                        min={1}
                        max={20}
                        step={1}
                        value={cycles}
                        onValueChange={(value) => {
                          setCycles(value);
                          console.log(`セット数が変更されました: ${value}回`);
                        }}
                      />
                    </View>
                    {/* トータル時間の表示 */}
                    <View style={styles.totalTimeContainer}>
                      <Text style={styles.totalTimeText}>
                        トータル: {calculateTotalHours()} 時間
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonGroup}>
                    {/* アバター選択 */}
                    <Popover
                      isVisible={isAvatarPopoverVisible}
                      onRequestClose={() => setAvatarPopoverVisible(false)}
                      from={
                        <TouchableOpacity onPress={() => setAvatarPopoverVisible(true)}>
                          <Button variant="outline" style={styles.avatarButton}>
                            <Avatar
                              src={`/images/avatars/${selectedCharacter}.png`}
                              size={24}
                            />
                            <Text style={styles.buttonText}>アバター選択</Text>
                          </Button>
                        </TouchableOpacity>
                      }
                    >
                      <View style={styles.popoverContent}>
                        {characterOptions.map((char) => (
                          <Button
                            key={char}
                            variant={selectedCharacter === char ? 'default' : 'outline'}
                            style={styles.popoverButton}
                            onPress={() => {
                              setSelectedCharacter(char);
                              setAvatarPopoverVisible(false);
                              console.log(`アバターが選択されました: ${char}`);
                            }}
                          >
                            {char}
                          </Button>
                        ))}
                      </View>
                    </Popover>

                    {/* 音楽選択 */}
                    <Popover
                      isVisible={isMusicPopoverVisible}
                      onRequestClose={() => setMusicPopoverVisible(false)}
                      from={
                        <TouchableOpacity onPress={() => setMusicPopoverVisible(true)}>
                          <Button variant="outline" style={styles.musicButton}>
                            <Music width={20} height={20} color="#4B5563" />
                            <Text style={styles.buttonText}>音楽選択</Text>
                          </Button>
                        </TouchableOpacity>
                      }
                    >
                      <View style={styles.popoverContent}>
                        {soundOptions.map((sound) => (
                          <Button
                            key={sound}
                            variant={selectedSound === sound ? 'default' : 'outline'}
                            style={styles.popoverButton}
                            onPress={() => {
                              setSelectedSound(sound);
                              setMusicPopoverVisible(false);
                              console.log(`音楽が選択されました: ${sound}`);
                            }}
                          >
                            {sound}
                          </Button>
                        ))}
                      </View>
                    </Popover>
                  </View>
                  <Button onPress={startTimer} style={styles.startButton}>
                    START
                  </Button>
                </>
              ) : (
                <>
                  <View style={styles.quoteContainer}>
                    <Text style={styles.quoteText}>"{motivationalQuote}"</Text>
                  </View>
                  {/* タイマーのSVG表示 */}
                  <View style={styles.clockContainer}>
                    <View
                      style={styles.svgContainer}
                      {...panResponder.panHandlers}
                    >
                      <Svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                      >
                        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                          {/* 背景円 */}
                          <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="#E2E8F0"
                            strokeWidth={strokeWidth}
                            fill="none"
                          />
                          {/* 進行円 */}
                          <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={timerState === 'focus' ? '#4299E1' : '#38A169'}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={`${circumference}`}
                            strokeDashoffset={`${strokeDashoffset}`}
                            strokeLinecap="round"
                          />
                        </G>
                        {/* テキストの表示 */}
                        <SvgText
                          x={size / 2}
                          y={size / 2 - 30}
                          textAnchor="middle"
                          fontSize="16"
                          fill="#2D3748"
                        >
                          {timerState === 'focus' ? '集中時間' : '休憩時間'}
                        </SvgText>
                        <SvgText
                          x={size / 2}
                          y={size / 2 + 10}
                          textAnchor="middle"
                          fontSize="40"
                          fontWeight="bold"
                          fill="#2D3748"
                        >
                          {formatTime(timeLeft)}
                        </SvgText>
                        <SvgText
                          x={size / 2}
                          y={size / 2 + 50}
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="bold"
                          fill="#2D3748"
                        >
                          {currentCycle}/{cycles}
                        </SvgText>
                      </Svg>
                    </View>
                  </View>
                  {timerState === 'break' && advice !== '' && (
                    <View style={styles.adviceContainer}>
                      <Text style={styles.adviceText}>{advice}</Text>
                    </View>
                  )}
                  <View style={styles.controlButtons}>
                    {/* 再生/一時停止ボタン */}
                    <Button
                      onPress={isRunning ? pauseTimer : startTimer}
                      style={styles.controlButton}
                    >
                      {isRunning ? (
                        <Pause width={20} height={20} color="#FFFFFF" />
                      ) : (
                        <Play width={20} height={20} color="#FFFFFF" />
                      )}
                    </Button>
                    {/* リセットボタン */}
                    <Button onPress={resetTimer} style={styles.controlButton}>
                      <RotateCcw width={20} height={20} color="#FFFFFF" />
                    </Button>
                    {/* 音量調整 */}
                    <Popover
                      isVisible={isVolumePopoverVisible}
                      onRequestClose={() => setVolumePopoverVisible(false)}
                      from={
                        <TouchableOpacity onPress={() => setVolumePopoverVisible(true)}>
                          <Button variant="outline" style={styles.volumeButton}>
                            <Volume2 width={20} height={20} color="#4B5563" />
                          </Button>
                        </TouchableOpacity>
                      }
                    >
                      <View style={styles.popoverContent}>
                        {soundOptions.map((sound) => (
                          <Button
                            key={sound}
                            variant={selectedSound === sound ? 'default' : 'outline'}
                            style={styles.popoverButton}
                            onPress={() => {
                              setSelectedSound(sound);
                              setVolumePopoverVisible(false);
                              console.log(`音量が設定されました: ${sound}`);
                            }}
                          >
                            {sound}
                          </Button>
                        ))}
                      </View>
                    </Popover>
                    {/* ユーザー設定 */}
                    <Popover
                      isVisible={isUserPopoverVisible}
                      onRequestClose={() => setUserPopoverVisible(false)}
                      from={
                        <TouchableOpacity onPress={() => setUserPopoverVisible(true)}>
                          <Button variant="outline" style={styles.userButton}>
                            <UserIcon width={20} height={20} color="#4B5563" />
                          </Button>
                        </TouchableOpacity>
                      }
                    >
                      <View style={styles.popoverContent}>
                        {characterOptions.map((char) => (
                          <Button
                            key={char}
                            variant={selectedCharacter === char ? 'default' : 'outline'}
                            style={styles.popoverButton}
                            onPress={() => {
                              setSelectedCharacter(char);
                              setUserPopoverVisible(false);
                              console.log(`ユーザーが選択されました: ${char}`);
                            }}
                          >
                            {char}
                          </Button>
                        ))}
                      </View>
                    </Popover>
                  </View>
                </>
              )}
            </CardContent>
          </Card>
        </View>
      </KeyboardAvoidingView>

      {/* Settingsコンポーネントの使用 */}
      <SettingsComponent
        isSettingsOpen={false} // 初期値は閉じている
        setIsSettingsOpen={setSettingsPopoverVisible}
        selectedBackground={selectedBackground}
        setSelectedBackground={(bg: BackgroundImageType) => {
          setSelectedBackground(bg);
          console.log(`背景が変更されました: ${bg}`);
        }}
        customBackground={customBackground}
        setCustomBackground={setCustomBackground}
        backgroundOptions={backgroundOptions}
        characterOptions={characterOptions}
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
        soundOptions={soundOptions}
        selectedSound={selectedSound}
        setSelectedSound={setSelectedSound}
        onDrop={(acceptedFiles: string[]) => {
          // カスタム背景のアップロード処理をフックに委譲
          if (acceptedFiles.length > 0) {
            const fileUri = acceptedFiles[0];
            setCustomBackground(fileUri);
            setSelectedBackground('custom');
            Alert.alert('成功', 'カスタム背景が設定されました。');
            console.log(`カスタム背景をアップロードしました: ${fileUri}`);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // bg-gray-100
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#22C55E', // bg-green-500
    zIndex: 10,
  },
  popoverContent: {
    width: 150,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  popoverButton: {
    justifyContent: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: -1,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarSpeechContainer: {
    backgroundColor: '#BFDBFE', // bg-blue-100
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    position: 'relative',
  },
  avatarSpeechText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#1E40AF', // text-blue-700
  },
  promptText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  quoteContainer: {
    padding: 10,
    backgroundColor: '#D1D5DB', // bg-gray-300
    borderRadius: 8,
    marginBottom: 20,
  },
  quoteText: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 14,
    color: '#374151', // text-gray-700
  },
  settingsContainer: {
    marginBottom: 20,
  },
  settingGroup: {
    marginBottom: 15,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A', // text-blue-800
    textAlign: 'right',
    marginBottom: 5,
  },
  totalTimeContainer: {
    padding: 10,
    backgroundColor: '#ECFDF5', // bg-green-100
    borderRadius: 8,
    marginTop: 10,
  },
  totalTimeText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46', // text-green-700
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  musicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#1E3A8A', // text-blue-800
  },
  startButton: {
    backgroundColor: '#3B82F6', // bg-blue-500
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  clockContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    width: 200, // サイズと一致させる
    height: 200,
  },
  timerStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748', // text-gray-800
    textAlign: 'center',
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2D3748', // text-gray-800
    textAlign: 'center',
  },
  cycleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748', // text-gray-800
    textAlign: 'center',
  },
  adviceContainer: {
    padding: 10,
    backgroundColor: '#D1D5DB', // bg-gray-300
    borderRadius: 8,
    marginBottom: 20,
  },
  adviceText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#374151', // text-gray-700
    fontStyle: 'italic',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: -5,
  },
  controlButton: {
    backgroundColor: '#3B82F6', // bg-blue-500
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  volumeButton: {
    backgroundColor: '#D1D5DB', // bg-gray-300
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  userButton: {
    backgroundColor: '#D1D5DB', // bg-gray-300
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A', // text-blue-800
  },
});

export default PomodoroTimer;

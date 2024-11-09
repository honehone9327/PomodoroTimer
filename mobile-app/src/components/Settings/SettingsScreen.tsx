// mobile-app/src/components/Settings/SettingsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Label } from '../../components/ui/Label';
import * as DocumentPicker from 'expo-document-picker';

// ローカル型定義
type DocumentPickerSuccessResult = {
  type: 'success';
  uri: string;
  name: string;
  size: number;
  mimeType?: string;
};

type DocumentPickerCanceledResult = {
  type: 'cancel';
};

type DocumentPickerResult = DocumentPickerSuccessResult | DocumentPickerCanceledResult;

type BackgroundImageType = 'default' | 'nature' | 'city' | 'abstract' | 'custom';
type SoundType = '焚き火' | '雨' | '波' | '森' | 'なし';
type CharacterType = 'ずんだもん' | 'なし';

type SettingsProps = {
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBackground: BackgroundImageType;
  setSelectedBackground: (bg: BackgroundImageType) => void;
  customBackground: string;
  setCustomBackground: (bg: string) => void;
  backgroundOptions: BackgroundImageType[];
  characterOptions: CharacterType[];
  selectedCharacter: CharacterType;
  setSelectedCharacter: (char: CharacterType) => void;
  soundOptions: SoundType[];
  selectedSound: SoundType;
  setSelectedSound: (sound: SoundType) => void;
  onDrop: (acceptedFiles: string[]) => void;
};

const SettingsComponent: React.FC<SettingsProps> = ({
  isSettingsOpen,
  setIsSettingsOpen,
  selectedBackground,
  setSelectedBackground,
  customBackground,
  setCustomBackground,
  backgroundOptions,
  characterOptions,
  selectedCharacter,
  setSelectedCharacter,
  soundOptions,
  selectedSound,
  setSelectedSound,
  onDrop,
}) => {
  if (!isSettingsOpen) return null;

  const handleCustomBackground = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/*', // 'video/*'を'application/*'に変更
        copyToCacheDirectory: true,
      }) as unknown as DocumentPickerResult; // 型アサーションを修正

      if (result.type === 'success' && result.uri) {
        onDrop([result.uri]);
      } else {
        Alert.alert('キャンセル', 'カスタム背景の選択がキャンセルされました。');
      }
    } catch (error) {
      console.error("Custom background selection failed:", error);
      Alert.alert('エラー', 'カスタム背景の選択中にエラーが発生しました。');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>設定</Text>
      
      {/* 背景画像の選択 */}
      <View style={styles.settingGroup}>
        <Label>背景画像</Label>
        <View style={styles.optionContainer}>
          {backgroundOptions.map((bg) => (
            <TouchableOpacity key={bg} onPress={() => setSelectedBackground(bg)}>
              <Button
                variant={selectedBackground === bg ? "default" : "outline"}
                style={styles.optionButton}
              >
                {bg === 'custom' ? 'カスタム' : bg}
              </Button>
            </TouchableOpacity>
          ))}
        </View>
        {selectedBackground === 'custom' && (
          <Button onPress={handleCustomBackground} style={styles.uploadButton}>
            カスタム背景をアップロード
          </Button>
        )}
      </View>

      {/* その他の設定項目をここに追加可能 */}
      
      {/* 閉じるボタン */}
      <TouchableOpacity onPress={() => setIsSettingsOpen(false)}>
        <Button style={styles.closeButton}>閉じる</Button>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E3A8A', // テキストブルー800
    textAlign: 'center',
  },
  settingGroup: {
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  uploadButton: {
    marginTop: 10,
    backgroundColor: '#3B82F6', // ブルー500
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: '#EF4444', // レッド500
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
});

export default SettingsComponent;

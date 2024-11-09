// src/components/Settings/Settings.tsx

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/Button';
import { User, Bell } from 'lucide-react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

// 型のインポート
import { SoundType, CharacterType, BackgroundImageType } from '@/types';

type Props = {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
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
  onDrop: (acceptedFiles: File[]) => void; // 追加
};

const Settings: React.FC<Props> = ({
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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    multiple: false
  });

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>設定</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">背景画像選択</h3>
          <div className="grid grid-cols-2 gap-2">
            {backgroundOptions.map((bg) => (
              <Button
                key={bg}
                variant={selectedBackground === bg ? "default" : "outline"}
                className="flex flex-col items-center p-2"
                onClick={() => setSelectedBackground(bg)}
              >
                <img
                  src={`/images/backgrounds/${bg}.jpg`}
                  alt={bg}
                  className="w-20 h-20 object-cover rounded"
                />
                <span className="mt-1 text-xs capitalize">{bg === 'default' ? 'デフォルト' : bg}</span>
              </Button>
            ))}
          </div>
          <h3 className="text-lg font-medium">その他</h3>
          <div className="flex flex-col space-y-2">
            <Link href="/privacy-policy" passHref>
              <Button variant="link" className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm">プライバシーポリシー</span>
              </Button>
            </Link>
            <Link href="/account-settings" passHref>
              <Button as="a" variant="link" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-xs sm:text-sm">アカウント設定</span>
              </Button>
            </Link>
            <Link href="/notification-settings" passHref>
              <Button variant="link" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span className="text-xs sm:text-sm">通知設定</span>
              </Button>
            </Link>
            {/* 他の設定項目があれば追加 */}
          </div>
          {/* カスタム背景動画アップロード */}
          <div>
            <h3 className="text-lg font-medium">カスタム背景動画</h3>
            <div {...getRootProps()} className="p-4 border-2 border-dashed border-gray-400 rounded-md text-center cursor-pointer">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>ファイルをドロップしてください...</p>
              ) : (
                <p>ここに動画をドラッグ＆ドロップするか、クリックして選択してください</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsSettingsOpen(false)} className="bg-blue-500 hover:bg-blue-600 text-white">
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;

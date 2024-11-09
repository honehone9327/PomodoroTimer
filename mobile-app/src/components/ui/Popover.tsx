// mobile-app/src/components/ui/Popover.tsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';  // 必要な型をインポート

interface PopoverProps {
  isVisible: boolean;
  onRequestClose: () => void;
  fromView: React.ReactNode;
  children: React.ReactNode;
}

const CustomPopover: React.FC<PopoverProps> = ({ isVisible, onRequestClose, fromView, children }) => {
  return (
    <Popover
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      from={fromView}
      placement={PopoverPlacement.TOP as PopoverPlacement}  // placementを型キャスト
      backgroundStyle={styles.background}  // ここはそのままスタイル適用可能
      popoverStyle={styles.content}  // popoverStyleを使用してコンテンツのスタイルを設定
    >
      {children}
    </Popover>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0,0,0,0.3)',  // 背景のスタイル
  },
  content: {
    backgroundColor: '#FFFFFF',  // ポップオーバーのコンテンツの背景色
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,  // Android用の影のスタイル
  },
});

export { CustomPopover as Popover };

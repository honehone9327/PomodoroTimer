// mobile-app/src/screens/NotificationSettingsScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Label } from 'src/components/ui/Label';
// import { Label } from '@/components/ui/Label'; // コメントアウト

const NotificationSettingsScreen: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>通知設定</Text>
      <View style={styles.settingRow}>
        <Label>タイマー完了時に通知する</Label>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#1E40AF' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      {/* 他の通知設定項目を追加 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6', // bg-gray-100
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1E40AF', // text-blue-800
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default NotificationSettingsScreen;

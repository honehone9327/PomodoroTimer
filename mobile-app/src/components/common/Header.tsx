import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Button } from '../ui/Button'; // 修正済み
import { RootStackParamList } from '../../types'; // 画面名の型を定義したファイルをインポート

const Header: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Pomodoro Timer</Text>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Button variant="link">ホーム</Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Faq')}>
          <Button variant="link">FAQ</Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ContactUs')}>
          <Button variant="link">お問い合わせ</Button>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#22C55E', // bg-green-500
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // text-white
  },
  nav: {
    flexDirection: 'row',
    margin: 10,
  },
});

export default Header;

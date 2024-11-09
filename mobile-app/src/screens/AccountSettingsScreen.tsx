// mobile-app/src/screens/AnnouncementsScreen.tsx

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

type Announcement = {
  title: string;
  date: string;
  content: string;
};

const announcements: Announcement[] = [
  {
    title: "バージョン1.1リリース",
    date: "2024-04-01",
    content: "新しい言語選択機能とバグ修正が追加されました！",
  },
  {
    title: "バージョン1.2リリース",
    date: "2024-05-15",
    content: "お問い合わせフォームが改善され、より迅速なサポートが可能になりました。",
  },
  // 他のお知らせを追加
];

const AnnouncementsScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>お知らせ</Text>
      {announcements.map((announcement, index) => (
        <Card key={index} style={styles.card}>
          <CardContent>
            <Text style={styles.announcementTitle}>{announcement.title}</Text>
            <Text style={styles.announcementDate}>{announcement.date}</Text>
            <Text style={styles.announcementContent}>{announcement.content}</Text>
          </CardContent>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6', // bg-gray-100
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E40AF', // text-blue-800
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A', // text-blue-800
  },
  announcementDate: {
    fontSize: 12,
    color: '#6B7280', // text-gray-500
    marginBottom: 5,
  },
  announcementContent: {
    fontSize: 14,
    color: '#374151', // text-gray-700
  },
});

export default AnnouncementsScreen;

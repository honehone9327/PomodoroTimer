// mobile-app/src/components/ui/TaskItem.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// '../../shared/types' から Task をインポートする代わりに、ここで Task の型を定義します。
type Task = {
  title: string;
  completed: boolean;
};

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.status}>{task.completed ? '完了' : '未完了'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
  },
  status: {
    fontSize: 14,
    color: '#555',
  },
});

export default TaskItem;

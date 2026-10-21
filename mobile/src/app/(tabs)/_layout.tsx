import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { colors } from '@/theme';

type TabIconProps = {
  name: ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
  size: number;
};

function TabIcon({ name, focused, size }: TabIconProps) {
  return (
    <Ionicons name={name} color={focused ? colors.textPrimary : colors.textMuted} size={size} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Tab ativa a branco e não a dourado: o dourado fica reservado a botões principais, logo e selos.
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.backgroundDeep,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Descobrir',
          tabBarIcon: (props) => <TabIcon name="compass" {...props} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{ title: 'Matches', tabBarIcon: (props) => <TabIcon name="heart" {...props} /> }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Conversas',
          tabBarIcon: (props) => <TabIcon name="chatbubbles" {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: (props) => <TabIcon name="person" {...props} /> }}
      />
    </Tabs>
  );
}

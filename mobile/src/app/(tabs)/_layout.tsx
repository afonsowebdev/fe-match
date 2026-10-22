import { Tabs } from 'expo-router/js-tabs';

import { FloatingTabBar, Icon, type IconName } from '@/components';
import { colors } from '@/theme';

type TabIconProps = {
  // Contorno quando a tab está inativa, cheio quando está ativa.
  icons: [outline: IconName, solid: IconName];
  focused: boolean;
  size: number;
};

function TabIcon({ icons, focused, size }: TabIconProps) {
  return (
    <Icon
      name={focused ? icons[1] : icons[0]}
      color={focused ? colors.textPrimary : colors.textMuted}
      size={size}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} />}>
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Descobrir',
          tabBarIcon: (props) => <TabIcon icons={['bx-church', 'bxs-church']} {...props} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: (props) => <TabIcon icons={['bx-compass', 'bxs-compass']} {...props} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: (props) => <TabIcon icons={['bx-heart', 'bxs-heart']} {...props} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Conversas',
          tabBarIcon: (props) => (
            <TabIcon icons={['bx-message-rounded-dots', 'bxs-message-rounded-dots']} {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: (props) => <TabIcon icons={['bx-user', 'bxs-user']} {...props} />,
        }}
      />
    </Tabs>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          
          left: 25,
          right: 25,
          borderRadius: 15,
          alignItems: 'center',

          transform: [{ translateY: 40 }],

          backgroundColor: '#467496',
          height: 90 ,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#000000',
      }}>
      {/* BloomAI Screen Tab */}

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Calendar Screen Tab */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarLabel: 'Calendar',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bloomai"
        options={{
          title: 'BloomAI',
          tabBarLabel: 'BloomAI',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Report Screen Tab */}
      <Tabs.Screen
        name="consult"
        options={{
          title: 'Consult',
          tabBarLabel: 'Consult',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This hides the screen from the tab bar
        }}
      />
    </Tabs>
  );
}
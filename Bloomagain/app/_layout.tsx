import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import './globals.css';
import { AuthProvider, useSession } from '@descope/react-native-sdk';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Main App Component with Descope Authentication
function MainApp() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Simple initialization
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        // Hide the splash screen after the app is ready
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#467496' }}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: 'white', marginTop: 10, fontSize: 16 }}>Loading Bloom...</Text>
      </View>
    );
  }

  // Always show the Stack navigator - auth screen will handle authentication state
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider projectId="P32DkUA0pWtepx1OMHKokTnUEnJ2">
      <MainApp />
    </AuthProvider>
  );
}

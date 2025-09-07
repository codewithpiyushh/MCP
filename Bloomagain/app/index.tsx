import { Redirect } from 'expo-router';
import React from 'react';
import { useSession } from '@descope/react-native-sdk';

export default function Index() {
  const { session } = useSession();
  
  // If authenticated, go to main app, otherwise go to auth screen
  if (session) {
    return <Redirect href="/(tabs)/home" />;
  }
  
  return <Redirect href="./auth" />;
}

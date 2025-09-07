import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // Simply redirect to home
  return <Redirect href="/(tabs)/home" />;
}

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import ServicosScreen from './screens/ServicosScreen';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <ServicosScreen />
    </>
  );
}

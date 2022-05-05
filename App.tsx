import React from 'react'

import { AuthProvider } from './src/hooks/auth'

import { AppRoutes } from './src/routes/app.routes'
import { SignIn } from './src/screens/SignIn'

import 'intl'
import 'intl/locale-data/jsonp/pt-BR'
import { Routes } from './src/routes'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'react-native'

import AppLoading from 'expo-app-loading'

import { ThemeProvider } from 'styled-components'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme'

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <ThemeProvider theme={ theme }>
          <StatusBar 
            barStyle='light-content'
            backgroundColor="transparent"
            translucent
          />
          
          <AuthProvider>
            <Routes />
          </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
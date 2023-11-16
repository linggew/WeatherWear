import { NavigationContainer } from '@react-navigation/native'
import { createTheme, ThemeProvider } from '@rneui/themed'

import 'react-native-gesture-handler'

import { Navigator } from './navigator'

const theme = createTheme({
  lightColors: {},
  darkColors: {},
})

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </ThemeProvider>
  )
}

import React from "react";
import { createTheme, ThemeProvider } from "@rneui/themed";
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { Navigator } from "./navigator";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

import { createStackNavigator } from '@react-navigation/stack'

import {
  Home,
  Settings,
  Future,
  Location,
  Health,
  HealthAlerts,
  ClothPreference,
  Help,
  About,
} from '../pages'

const Stack = createStackNavigator()

export const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Future" component={Future} />
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="Health" component={Health} />
      <Stack.Screen name="HealthAlerts" component={HealthAlerts} />
      <Stack.Screen name="ClothPreference" component={ClothPreference} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  )
}

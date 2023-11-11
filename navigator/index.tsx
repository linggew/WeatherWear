import { createStackNavigator } from '@react-navigation/stack'

import { Home, Settings, Future, Location } from '../pages'

const Stack = createStackNavigator()

export const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Future" component={Future} />
      <Stack.Screen name="Location" component={Location} />
    </Stack.Navigator>
  )
}

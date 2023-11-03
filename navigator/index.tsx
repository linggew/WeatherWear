import { createStackNavigator } from '@react-navigation/stack';
import { Home, Settings } from '../pages';

const Stack = createStackNavigator();

export const Navigator = () => {
    return (
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
    )
}

// ClothPreference.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'

import { ClothScreen } from './ClothScreen'
import { PantScreen } from './PantScreen'

const Tab = createBottomTabNavigator()

export const ClothPreference = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Cloths" component={ClothScreen} />
      <Tab.Screen name="Pants" component={PantScreen} />
    </Tab.Navigator>
  )
}

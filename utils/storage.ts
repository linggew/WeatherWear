// storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage'

export const KEYS = {
  TEMPERATURE_UNIT: 'temperatureUnit',
  // add other keys as needed
}

export const setTemperatureUnit = async (value: string) => {
  try {
    await AsyncStorage.setItem(KEYS.TEMPERATURE_UNIT, value)
  } catch (error) {
    console.error('Error setting temperature unit in AsyncStorage:', error)
  }
}

export const getTemperatureUnit = async (): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.TEMPERATURE_UNIT)

    // If the value is null or invalid, return 'C' as the default value
    return value && (value === 'C' || value === 'F') ? value : 'F'
  } catch (error) {
    console.error('Error getting temperature unit from AsyncStorage:', error)
    return 'C' // Return 'C' as the default value in case of an error
  }
}

// Add more functions for other AsyncStorage operations as needed

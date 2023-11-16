// storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage'

import { CityKey } from './types'

export const KEYS = {
  TEMPERATURE_UNIT: 'temperatureUnit',
  LOCATION: {
    CITY: 'locationCity',
    KEY: 'locationKey',
    AREA: 'locationArea',
  },
}

export const setTemperatureUnit = async (value: string) => {
  try {
    await AsyncStorage.setItem(KEYS.TEMPERATURE_UNIT, value)
  } catch (error) {
    console.error('Error setting temperature unit in AsyncStorage:', error)
  }
}

export const setLocation = async (value: CityKey) => {
  try {
    await AsyncStorage.setItem(KEYS.LOCATION.CITY, value.city)
    await AsyncStorage.setItem(KEYS.LOCATION.KEY, value.key)
    await AsyncStorage.setItem(KEYS.LOCATION.AREA, value.area)
  } catch (error) {
    console.error('Error setting location in AsyncStorage:', error)
  }
}
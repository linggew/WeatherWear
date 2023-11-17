// storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage'

import { CityKey, HealthPreferences } from './types'

export const KEYS = {
  TEMPERATURE_UNIT: 'temperatureUnit',
  LOCATION: {
    CITY: 'locationCity',
    KEY: 'locationKey',
    AREA: 'locationArea',
  },
  HEALTH_PREFERENCE: {
    ASTHMA: 'asthma',
    FEVER: 'fever',
    ALLERGY: 'allergy',
    HEAT_INTOLERANCE: 'heatIntolerance',
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

export const setHealthPreferences = async (value: HealthPreferences) => {
  try {
    await AsyncStorage.setItem(
      KEYS.HEALTH_PREFERENCE.ASTHMA,
      value.asthma.toString(),
    )
    await AsyncStorage.setItem(
      KEYS.HEALTH_PREFERENCE.FEVER,
      value.fever.toString(),
    )
    await AsyncStorage.setItem(
      KEYS.HEALTH_PREFERENCE.ALLERGY,
      value.allergy.toString(),
    )
    await AsyncStorage.setItem(
      KEYS.HEALTH_PREFERENCE.HEAT_INTOLERANCE,
      value.heatIntolerance.toString(),
    )
  } catch (error) {
    console.error('Error setting health preferences in AsyncStorage:', error)
  }
}

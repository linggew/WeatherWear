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
  CLOTH_PREFERENCE_DATA: 'clothPreferenceData',
}

export const setTemperatureUnit = async (value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.TEMPERATURE_UNIT, value)
  } catch (error) {
    console.error('Error setting temperature unit in AsyncStorage:', error)
  }
}

export const getTemperatureUnit = async (): Promise<string> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.TEMPERATURE_UNIT)

    // If the value is null or invalid, return 'C' as the default value
    return value && (value === 'C' || value === 'F') ? value : 'F'
  } catch (error) {
    console.error('Error getting temperature unit from AsyncStorage:', error)
    return 'C' // Return 'C' as the default value in case of an error
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

export const setClothPreferenceData = async (data: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.CLOTH_PREFERENCE_DATA, JSON.stringify(data))
  } catch (error) {
    console.error('Error setting cloth preference data in AsyncStorage:', error)
  }
}

export const getClothPreferenceData = async (): Promise<any> => {
  try {
    const storedData = await AsyncStorage.getItem(KEYS.CLOTH_PREFERENCE_DATA)

    if (!storedData) {
      // If no data is stored, return the default data
      const defaultData = {
        C: {
          Sleeveless: 30,
          ShortsLeeve: 30,
          LongSleeve: 20,
          Jacket: 10,
          Coat: 5,
          Shorts: 30,
          LongPants: 20,
          WarmPants: 10,
        },
        F: {
          Sleeveless: 86,
          ShortSleeve: 86,
          LongSleeve: 68,
          Jacket: 50,
          Coat: 41,
          Shorts: 86,
          LongPants: 68,
          WarmPants: 50,
        },
      }

      return defaultData
    }

    return JSON.parse(storedData)
  } catch (error) {
    console.error(
      'Error getting cloth preference data from AsyncStorage:',
      error,
    )

    // Return the default data in case of an error
    return {
      C: {
        Sleeveless: 30,
        ShortsLeeve: 30,
        LongSleeve: 20,
        Jacket: 10,
        Coat: 5,
        Shorts: 30,
        LongPants: 20,
        WarmPants: 10,
      },
      F: {
        Sleeveless: 86,
        ShortSleeve: 86,
        LongSleeve: 68,
        Jacket: 50,
        Coat: 41,
        Shorts: 86,
        LongPants: 68,
        WarmPants: 50,
      },
    }
  }
}

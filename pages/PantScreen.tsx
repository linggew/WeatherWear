import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import {
  View,
  PanResponder,
  Animated,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native'
import Swiper from 'react-native-swiper'

import {
  getTemperatureUnit,
  getClothPreferenceData,
  setClothPreferenceData,
} from '../utils/storage'
const screenHeight: number = Dimensions.get('window').height
const containerHeight: number = screenHeight * 0.7
export const PantScreen = () => {
  const [metrica, setMetrica] = useState('F')
  const [clothdata, setClothdata] = useState([])
  const [thumb5, setThumb5] = useState(new Animated.Value(0))
  const [thumb6, setThumb6] = useState(new Animated.Value(0))

  useEffect(() => {
    // Fetch temperature unit from AsyncStorage
    const fetchTemperatureUnit = async () => {
      const unit = await getTemperatureUnit()
      setMetrica(unit)
    }

    const fetchClothPreferenceData = async () => {
      const data = await getClothPreferenceData()
      setClothdata(data)
    }

    fetchTemperatureUnit()
    fetchClothPreferenceData()
  }, [])

  useEffect(() => {
    // Calculate initial thumb positions based on AsyncStorage data
    if (metrica && clothdata && clothdata[metrica]) {
      const calculateThumbPosition = (originalValue: number) => {
        if (metrica === 'C') {
          return ((originalValue - -20) / (50 - -20)) * (0 - 500) + 500
        } else if (metrica === 'F') {
          return ((originalValue - -4) / (122 - -4)) * (0 - 500) + 500
        }
      }

      setThumb5(
        new Animated.Value(calculateThumbPosition(clothdata[metrica].Shorts)),
      )
      setThumb6(
        new Animated.Value(
          calculateThumbPosition(clothdata[metrica].WarmPants),
        ),
      )
    }
  }, [metrica, clothdata])

  const createPanResponder = (
    thumb: any,
    setThumb: any,
    lowerThumb: any,
    higherThumb: any,
  ) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dy }) => {
        const newThumbValue = thumb._value + dy

        const containerHeight = 500

        let lowerLimit, higherLimit

        if (lowerThumb === thumb) {
          lowerLimit = 0
          higherLimit = Math.min(containerHeight, higherThumb._value)
        } else if (higherThumb === thumb) {
          lowerLimit = Math.max(0, lowerThumb._value)
          higherLimit = containerHeight
        } else {
          lowerLimit = Math.max(0, lowerThumb._value)
          higherLimit = Math.min(containerHeight, higherThumb._value)
        }

        const limitedValue = Math.min(
          higherLimit,
          Math.max(lowerLimit, newThumbValue),
        )

        setThumb(new Animated.Value(limitedValue))
      },
      onPanResponderRelease: () => {
        // Save thumb positions when the user releases the pan responder
        saveThumbPositions()
      },
    })

  const saveThumbPositions = async () => {
    // Calculate original temperature values from the mapped thumb positions
    let ShortsValueC, WarmPantsValueC
    let ShortsValueF, WarmPantsValueF

    if (metrica === 'C') {
      ShortsValueC = parseInt(mapValueToTemperature(thumb5._value), 10)
      WarmPantsValueC = parseInt(mapValueToTemperature(thumb6._value), 10)

      // Convert Celsius values to Fahrenheit
      ShortsValueF = (ShortsValueC * 9) / 5 + 32
      WarmPantsValueF = (WarmPantsValueC * 9) / 5 + 32
    } else {
      ShortsValueF = parseInt(mapValueToTemperature(thumb5._value), 10)
      WarmPantsValueF = parseInt(mapValueToTemperature(thumb6._value), 10)

      // Convert Fahrenheit values to Celsius
      ShortsValueC = ((ShortsValueF - 32) * 5) / 9
      WarmPantsValueC = ((WarmPantsValueF - 32) * 5) / 9
    }

    // Get the current cloth preference data from AsyncStorage
    const currentData = await getClothPreferenceData()

    // Update the cloth preference data with the new thumb positions for both units
    const newData = {
      ...currentData,
      C: {
        Sleeveless: currentData.C.Sleeveless, // Keep the existing value
        ShortsLeeve: currentData.C.ShortsLeeve, // Keep the existing value
        LongSleeve: currentData.C.LongSleeve,
        Jacket: currentData.C.Jacket, // Keep the existing value
        Coat: currentData.C.Coat, // Keep the existing value
        Shorts: ShortsValueC,
        LongPants: ShortsValueC,
        WarmPants: WarmPantsValueC,
      },
      F: {
        Sleeveless: currentData.F.Sleeveless, // Keep the existing value
        ShortsLeeve: currentData.F.ShortsLeeve, // Keep the existing value
        LongSleeve: currentData.F.LongSleeve,
        Jacket: currentData.F.Jacket, // Keep the existing value
        Coat: currentData.F.Coat,
        Shorts: ShortsValueF,
        LongPants: ShortsValueF,
        WarmPants: WarmPantsValueF,
      },
    }

    // Save the updated data back to AsyncStorage
    await setClothPreferenceData(newData)
  }

  const mapValueToTemperature = (value: any) => {
    const maxValue = -20
    const minValue = 50

    const temperatureC = minValue + (maxValue - minValue) * (value / 500)

    const temperatureF = (temperatureC * 9) / 5 + 32

    const temperatureValue = Math.round(
      metrica === 'C' ? temperatureC : temperatureF,
    )

    return `${temperatureValue}${metrica}`
  }

  const panResponder5 = createPanResponder(thumb5, setThumb5, thumb5, thumb6)
  const panResponder6 = createPanResponder(thumb6, setThumb6, thumb5, thumb6)

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0480ff', '#7abbff', '#7FDBFF', '#FFDC00', '#FF4136']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.rangeContainerRight}
      >
        <View style={styles.rangeRight} />
      </LinearGradient>
      <Animated.View
        {...panResponder5.panHandlers}
        style={[styles.thumbRight, { top: thumb5 }]}
      >
        <Text style={styles.thumbTexta}>
          Shorts :{mapValueToTemperature(thumb5._value)}
        </Text>
        <Text style={styles.thumbText}>
          Long Pants :{mapValueToTemperature(thumb5._value)}
        </Text>
      </Animated.View>
      <Animated.View
        {...panResponder6.panHandlers}
        style={[styles.thumbRight, { top: thumb6 }]}
      >
        <Text style={styles.thumbText}>
          Warm Pants :{mapValueToTemperature(thumb6._value)}
        </Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '8%',
  },
  thumbText: {
    marginLeft: -150,
    transform: [{ translateY: 20 }],
  },
  thumbTexta: {
    marginLeft: -150,
    transform: [{ translateY: -20 }],
  },
  rangeContainerRight: {
    height: containerHeight,
    width: 25,
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 0,
  },
  rangeRight: {
    height: '100%',
    width: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  thumbRight: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    zIndex: 2,
  },
})

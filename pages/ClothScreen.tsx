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

import {
  getTemperatureUnit,
  getClothPreferenceData,
  setClothPreferenceData,
} from '../utils/storage'
const screenHeight: number = Dimensions.get('window').height
const containerHeight: number = screenHeight * 0.7
export const ClothScreen = () => {
  const [metrica, setMetrica] = useState('F')
  const [clothdata, setClothdata] = useState([])
  const [thumb1, setThumb1] = useState(new Animated.Value(0))
  const [thumb2, setThumb2] = useState(new Animated.Value(0))
  const [thumb3, setThumb3] = useState(new Animated.Value(0))
  const [thumb4, setThumb4] = useState(new Animated.Value(0))

  useEffect(() => {
    // Fetch temperature unit from AsyncStorage
    const fetchTemperatureUnit = async () => {
      const unit = await getTemperatureUnit()
      setMetrica(unit)
    }

    const fetchClothPreferenceData = async () => {
      const data = await getClothPreferenceData()
      setClothdata(data)

      // Logging keys and values for Celsius
      console.log('Cloth Preference Data for Celsius:')
      Object.entries(data.C).forEach(([key, value]) => {
        console.log(`Key: ${key}, Value: ${value}`)
      })

      // Logging keys and values for Fahrenheit
      console.log('Cloth Preference Data for Fahrenheit:')
      Object.entries(data.F).forEach(([key, value]) => {
        console.log(`Key: ${key}, Value: ${value}`)
      })
    }
    // const defaultData = {
    //   C: {
    //     Sleeveless: 30,
    //     ShortsLeeve: 30,
    //     LongSleeve: 20,
    //     Jacket: 10,
    //     Coat: 5,
    //     Shorts: 30,
    //     LongPants: 20,
    //     WarmPants: 10,
    //   },
    //   F: {
    //     Sleeveless: 86,
    //     ShortSleeve: 86,
    //     LongSleeve: 68,
    //     Jacket: 50,
    //     Coat: 41,
    //     Shorts: 86,
    //     LongPants: 68,
    //     WarmPants: 50,
    //   },
    // }
    // setClothPreferenceData(defaultData)

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

      setThumb1(
        new Animated.Value(
          calculateThumbPosition(clothdata[metrica].Sleeveless),
        ),
      )
      setThumb2(
        new Animated.Value(
          calculateThumbPosition(clothdata[metrica].LongSleeve),
        ),
      )
      setThumb3(
        new Animated.Value(calculateThumbPosition(clothdata[metrica].Jacket)),
      )
      setThumb4(
        new Animated.Value(calculateThumbPosition(clothdata[metrica].Coat)),
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
    let sleevelessValueC, longsleeveValueC, JacketValueC, CoatValueC
    // ShortsValueC,
    // WarmPantsValueC
    let sleevelessValueF, longsleeveValueF, JacketValueF, CoatValueF
    // ShortsValueF,
    // WarmPantsValueF

    if (metrica === 'C') {
      sleevelessValueC = parseInt(mapValueToTemperature(thumb1._value), 10)
      longsleeveValueC = parseInt(mapValueToTemperature(thumb2._value), 10)
      JacketValueC = parseInt(mapValueToTemperature(thumb3._value), 10)
      CoatValueC = parseInt(mapValueToTemperature(thumb4._value), 10)

      // Convert Celsius values to Fahrenheit
      sleevelessValueF = (sleevelessValueC * 9) / 5 + 32
      longsleeveValueF = (longsleeveValueC * 9) / 5 + 32
      JacketValueF = (JacketValueC * 9) / 5 + 32
      CoatValueF = (CoatValueC * 9) / 5 + 32
    } else {
      sleevelessValueF = parseInt(mapValueToTemperature(thumb1._value), 10)
      longsleeveValueF = parseInt(mapValueToTemperature(thumb2._value), 10)
      JacketValueF = parseInt(mapValueToTemperature(thumb3._value), 10)
      CoatValueF = parseInt(mapValueToTemperature(thumb4._value), 10)

      // Convert Fahrenheit values to Celsius
      sleevelessValueC = ((sleevelessValueF - 32) * 5) / 9
      longsleeveValueC = ((longsleeveValueF - 32) * 5) / 9
      JacketValueC = ((JacketValueF - 32) * 5) / 9
      CoatValueC = ((CoatValueF - 32) * 5) / 9
    }

    // Get the current cloth preference data from AsyncStorage
    const currentData = await getClothPreferenceData()

    // Update the cloth preference data with the new thumb positions for both units
    const newData = {
      ...currentData,
      C: {
        Sleeveless: sleevelessValueC,
        ShortsLeeve: sleevelessValueC,
        LongSleeve: longsleeveValueC,
        Jacket: JacketValueC,
        Coat: CoatValueC,
        Shorts: currentData.C.Shorts, // Keep the existing value
        LongPants: currentData.C.LongPants, // Keep the existing value
        WarmPants: currentData.C.WarmPants,
      },
      F: {
        Sleeveless: sleevelessValueF,
        ShortsLeeve: sleevelessValueF,
        LongSleeve: longsleeveValueF,
        Jacket: JacketValueF,
        Coat: CoatValueF,
        Shorts: currentData.F.Shorts, // Keep the existing value
        LongPants: currentData.F.LongPants, // Keep the existing value
        WarmPants: currentData.F.WarmPants,
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

  const panResponder1 = createPanResponder(thumb1, setThumb1, thumb1, thumb2)
  const panResponder2 = createPanResponder(thumb2, setThumb2, thumb1, thumb3)
  const panResponder3 = createPanResponder(thumb3, setThumb3, thumb2, thumb4)
  const panResponder4 = createPanResponder(thumb4, setThumb4, thumb3, thumb4)

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0480ff', '#7abbff', '#7FDBFF', '#FFDC00', '#FF4136']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.rangeContainer}
      >
        <View style={styles.range} />
      </LinearGradient>
      <Animated.View
        {...panResponder1.panHandlers}
        style={[styles.thumb, { top: thumb1 }]}
      >
        <Text style={styles.thumbTexta}>
          sleeveless :{mapValueToTemperature(thumb1._value)}
        </Text>
        <Text style={styles.thumbText}>
          short-sleeve :{mapValueToTemperature(thumb1._value)}
        </Text>
      </Animated.View>
      <Animated.View
        {...panResponder2.panHandlers}
        style={[styles.thumb, { top: thumb2 }]}
      >
        <Text style={styles.thumbText}>
          long-sleeve :{mapValueToTemperature(thumb2._value)}
        </Text>
      </Animated.View>
      <Animated.View
        {...panResponder3.panHandlers}
        style={[styles.thumb, { top: thumb3 }]}
      >
        <Text style={styles.thumbText}>
          Jacket :{mapValueToTemperature(thumb3._value)}
        </Text>
      </Animated.View>
      <Animated.View
        {...panResponder4.panHandlers}
        style={[styles.thumb, { top: thumb4 }]}
      >
        <Text style={styles.thumbText}>
          Coat :{mapValueToTemperature(thumb4._value)}
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
  rangeContainer: {
    height: containerHeight,
    width: 25,
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 0,
  },
  range: {
    height: '100%',
    width: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    zIndex: 2,
  },
  thumbText: {
    marginLeft: -150,
    transform: [{ translateY: 20 }],
  },
  thumbTexta: {
    marginLeft: -150,
    transform: [{ translateY: -20 }],
  },
})

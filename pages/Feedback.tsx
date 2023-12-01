import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { makeStyles, useTheme, Text, Button } from '@rneui/themed'
import useAsyncStorage from '../hooks/useAsyncStorage'
import Toast from 'react-native-toast-message'

import {
  getClothPreferenceData,
  setClothPreferenceData,
} from '../utils/storage'

import { getCurrentWeather } from '../utils/weather'

const adjustClothingPreferences = async (currTemp: any, tooCold: boolean) => {
  const data = await getClothPreferenceData()
  const { Coat, Jacket, LongPants, LongSleeve, ShortsLeeve, WarmPants } =
    data!['C']

  const upper = [Coat, Jacket, LongSleeve, ShortsLeeve]
  const lower = [WarmPants, LongPants]

  let topIndex = 3
  let bottomIndex = 1

  for (let i = 0; i < upper.length; i++) {
    if (currTemp <= upper[i]) {
      topIndex = i
      break
    }
  }

  for (let i = 0; i < lower.length; i++) {
    if (currTemp <= lower[i]) {
      bottomIndex = i
      break
    }
  }

  if (tooCold) {
    if (topIndex !== 0) {
      //don't do anything when too cold with coat
      upper[topIndex - 1] += 1 //increase upper bound of the clothing category one level colder
    }

    if (bottomIndex !== 0) {
      //don't do anything when too cold with warm pants
      lower[bottomIndex - 1] += 1 //increase upper bound of the clothing category one level colder
    }
  } else {
    upper[topIndex] -= 1 //decrease upper bound of the current clothing category
    lower[bottomIndex] -= 1 //decrease upper bound of the current clothing category
  }

  const newData = {
    C: {
      Sleeveless: upper[3],
      ShortsLeeve: upper[3],
      LongSleeve: upper[2],
      Jacket: upper[1],
      Coat: upper[0],
      Shorts: lower[1],
      LongPants: lower[1],
      WarmPants: lower[0],
    },
    F: {
      Sleeveless: (upper[3] * 9.0) / 5.0 + 32.0,
      ShortsLeeve: (upper[3] * 9.0) / 5.0 + 32.0,
      LongSleeve: (upper[2] * 9.0) / 5.0 + 32.0,
      Jacket: (upper[1] * 9.0) / 5.0 + 32.0,
      Coat: (upper[0] * 9.0) / 5.0 + 32.0,
      Shorts: (lower[1] * 9.0) / 5.0 + 32.0,
      LongPants: (lower[1] * 9.0) / 5.0 + 32.0,
      WarmPants: (lower[0] * 9.0) / 5.0 + 32.0,
    },
  }

  await setClothPreferenceData(newData)
}

export const Feedback = () => {
  const styles = useStyles()
  const { theme } = useTheme()
  const { settings, loading } = useAsyncStorage()

  const [currWeather, setCurrWeather] = useState(null)
  const [buttonsDisabled, setButtonsDisabled] = useState(false)

  const getWeatherNum = () => {
    if (currWeather) {
      return currWeather['Temperature']['Metric']['Value']
    }
  }

  useEffect(() => {
    if (settings) {
      getCurrentWeather(settings!.locationKey, settings!.temperatureUnit).then(
        (data) => setCurrWeather(data),
      )
    }
  }, [settings])

  const waitForSuccess = async (tooCold: boolean) => {
    console.log('waiting for success')
    setButtonsDisabled(true)
    await adjustClothingPreferences(getWeatherNum(), tooCold)
    Toast.show({
      type: 'success',
      text1: 'Preferences Updated',
      text2: 'Your preferences have been updated successfully!',
      visibilityTime: 2000,
      autoHide: true,
    })
    setButtonsDisabled(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.feedbackContainer}>
        <Text h3>Were you:</Text>
        <View style={styles.buttonContainer}>
          <Button
            type="outline"
            disabled={buttonsDisabled}
            buttonStyle={styles.button}
            onPress={() => waitForSuccess(true)}
          >
            Too cold 🥶
          </Button>
          <Button
            type="outline"
            disabled={buttonsDisabled}
            buttonStyle={styles.button}
            onPress={() => {
              Toast.show({
                type: 'success',
                text1: "We're glad to hear it!",
                text2: 'Thank you for your feedback!',
                visibilityTime: 2000,
                autoHide: true,
              })
            }}
          >
            Just right 😊
          </Button>
          <Button
            type="outline"
            disabled={buttonsDisabled}
            buttonStyle={styles.button}
            onPress={() => waitForSuccess(false)}
          >
            Too hot 🔥
          </Button>
        </View>
      </View>
      <Toast />
    </View>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    color: theme.colors.primary,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  feedbackContainer: {
    borderRadius: 20,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    padding: theme.spacing.xl,
    width: '80%',
    height: '75%',
    backgroundColor: theme.colors.grey5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.primary,
  },
}))

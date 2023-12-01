import type { NavigationProp } from '@react-navigation/native'
import {
  makeStyles,
  Text,
  Button,
  Icon,
  useTheme,
  Dialog,
  Slider,
  FAB,
  Card,
} from '@rneui/themed'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { View, Image } from 'react-native'

import { ClothingRec } from '../components/ClothingRec'
import TempChart from '../components/TempChart'
import useAsyncStorage from '../hooks/useAsyncStorage'
import {
  getCurrentWeather,
  getNext12HrsWeather,
  healthAlertsExist,
} from '../utils/weather'
import { weather_icons } from '../utils/weather-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

type HomeProps = {
  navigation: NavigationProp<any>
}

type ItemProps = { time: string; temp: string }

export type WeatherType = {
  id: number
  time: any
  temp: number
  icon: number
}

export const Home = ({ navigation }: HomeProps) => {
  const styles = useStyles()
  const { theme } = useTheme()
  const { settings, loading } = useAsyncStorage()

  const [currWeather, setCurrWeather] = useState(Object)
  const [nextWeather, setNextWeather] = useState<WeatherType[]>([])
  const [alertsExist, setAlertsExist] = useState(false)
  const [hasPrecipitation, setHasPrecipitation] = useState(false)
  const [currTime, setCurrTime] = useState(0)

  // const getWeatherNum = () => {
  //   if (currWeather) {
  //     return currWeather['Temperature'][
  //       settings!.temperatureUnit === 'C' ? 'Metric' : 'Imperial'
  //     ]['Value']
  //   }
  // }

  useEffect(() => {
    if (settings) {
      // getCurrentWeather(settings!.locationKey, settings!.temperatureUnit).then(
      //   (data) => setCurrWeather(data),
      // )
      getNext12HrsWeather(
        settings!.locationKey,
        settings!.temperatureUnit,
      ).then((data) => {
        const nextWeatherData = []
        for (let i = 0; i < data.length; i++) {
          nextWeatherData.push({
            id: i,
            time: moment(data[i]['DateTime']).format('h A'),
            temp: Number(data[i]['Temperature']['Value']),
            icon: Number(data[i]['WeatherIcon']),
          })
          if (data[i]['HasPrecipitation']) {
            setHasPrecipitation(true)
          }
        }
        setCurrWeather(nextWeatherData[0])
        setNextWeather(nextWeatherData)
      })

      healthAlertsExist(
        settings!.locationKey,
        settings!.asthma,
        settings!.fever,
        settings!.allergy,
      ).then((val) => setAlertsExist(val))
    }
  }, [settings])

  useEffect(() => {
    if (nextWeather.length > 0) {
      setCurrWeather(nextWeather[currTime])
    }
  }, [currTime])

  if (loading) {
    return (
      <View style={styles.wrapper}>
        <Dialog.Loading />
      </View>
    )
  }

  const Item = ({ time, temp }: ItemProps) => (
    <View style={styles.item}>
      <Text style={{ fontSize: 15 }}>{time}</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{temp}</Text>
    </View>
  )

  return (
    <View style={styles.wrapper}>
      <View style={styles.topContainer}>
        <Button
          icon={
            <Icon name="map-pin" type="feather" color={theme.colors.primary} />
          }
          type="clear"
          onPress={() => navigation.navigate('Location')}
        >
          {' '}
          {settings ? settings.locationCity : null}
        </Button>
        <Button type="outline" onPress={() => navigation.navigate('Future')}>
          Next 5 Days
        </Button>
      </View>
      <View style={styles.centerContainer}>
        <View style={styles.currContainer}>
          <Text
            style={{
              fontWeight: '600',
              marginBottom: theme.spacing.sm,
              fontSize: 50,
            }}
          >
            {!currWeather || !settings
              ? 'Loading...'
              : `${currWeather.temp}${
                  settings.temperatureUnit === 'C' ? '°C' : '°F'
                }`}
          </Text>
          {currWeather && settings ? (
            <Image source={weather_icons[currWeather.icon - 1]} />
          ) : null}
        </View>

        <View style={styles.visualizationContainer}>
          {nextWeather.length > 0 ? <TempChart data={nextWeather} /> : null}
        </View>
        <View style={styles.sliderContainer}>
          {nextWeather.length > 0 ? (
            <>
              <View style={styles.sliderWithTextContainer}>
                <Text>{nextWeather[0].time}</Text>
                <Text>{nextWeather[11].time}</Text>
              </View>
              <Slider
                value={currTime}
                onValueChange={setCurrTime}
                minimumValue={0}
                maximumValue={11}
                step={1}
                allowTouchTrack
                minimumTrackTintColor={theme.colors.grey4}
                maximumTrackTintColor={theme.colors.grey4}
                trackStyle={{ height: 5 }}
                thumbStyle={{
                  height: 20,
                  width: 20,
                  backgroundColor: theme.colors.primary,
                }}
              />
            </>
          ) : null}
        </View>
        <Card containerStyle={styles.avatarContainer}>
          {currWeather && settings ? (
            <ClothingRec
              currTemp={currWeather.temp}
              metric={settings!.temperature === 'C'}
              hasPrecipitation={hasPrecipitation}
            />
          ) : null}
        </Card>
        {/* {currWeather && settings ? (
            <FAB
              size="small"
              icon={{ name: 'message', color: 'white' }}
              color={theme.colors.primary}
              placement="right"
              onPress={() => navigation.navigate('Feedback')}
              style={{ right: 0, bottom: 0, position: 'absolute' }}
            />
          ) : // <Icon name="message-circle" type="feather" color={theme.colors.primary} />
            null} */}
      </View>
      <View style={styles.bottomContainer}>
        <Button
          type="clear"
          icon={
            <Icon
              name="settings"
              type="feather"
              size={30}
              color={theme.colors.primary}
              onPress={() => navigation.navigate('Settings')}
            />
          }
        />
        {alertsExist ? (
          <Button
            type="clear"
            icon={
              <Icon
                name="exclamation-circle"
                type="font-awesome"
                size={30}
                color={theme.colors.error}
                onPress={() => navigation.navigate('HealthAlerts')}
              />
            }
          />
        ) : null}
        {currWeather && settings && (
          <Button
            type="clear"
            style={{ alignSelf: 'flex-end' }}
            icon={
              <Icon
                name="message-square"
                type="feather"
                size={30}
                color={theme.colors.primary}
                onPress={() => navigation.navigate('Settings')}
              />
            }
          />
        )}
      </View>
    </View>
  )
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    flex: 1,
    color: theme.colors.primary,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
  },
  centerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    marginTop: theme.spacing.lg,
  },
  currContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing.lg,
  },
  visualizationContainer: {
    borderRadius: 20,
    textAlign: 'center',
    marginVertical: theme.spacing.md,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 20,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    padding: theme.spacing.md,
    width: '80%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    width: '80%',
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  sliderWithTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

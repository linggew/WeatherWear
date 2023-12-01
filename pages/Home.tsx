import type { NavigationProp } from '@react-navigation/native'
import {
  makeStyles,
  Text,
  Button,
  Icon,
  useTheme,
  Dialog,
  FAB,
} from '@rneui/themed'
import React, { useState, useEffect } from 'react'
import { FlatList, View } from 'react-native'

import { ClothingRec } from '../components/ClothingRec'
import useAsyncStorage from '../hooks/useAsyncStorage'
import {
  getCurrentWeather,
  getNext12HrsWeather,
  healthAlertsExist,
} from '../utils/weather'
import moment from 'moment'

type HomeProps = {
  navigation: NavigationProp<any>
}

export const Home = ({ navigation }: HomeProps) => {
  const styles = useStyles()
  const { theme } = useTheme()
  const { settings, loading } = useAsyncStorage()

  const [currWeather, setCurrWeather] = useState(null)
  const [nextWeather, setNextWeather] = useState([])
  const [alertsExist, setAlertsExist] = useState(false)

  const getWeatherNum = () => {
    if (currWeather) {
      return currWeather['Temperature'][
        settings!.temperatureUnit === 'C' ? 'Metric' : 'Imperial'
      ]['Value']
    }
  }

  useEffect(() => {
    if (settings) {
      getCurrentWeather(settings!.locationKey, settings!.temperatureUnit).then(
        (data) => setCurrWeather(data),
      )
      getNext12HrsWeather(
        settings!.locationKey,
        settings!.temperatureUnit,
      ).then((data) => setNextWeather(data))

      healthAlertsExist(
        settings!.locationKey,
        settings!.asthma,
        settings!.fever,
        settings!.allergy,
      ).then((val) => setAlertsExist(val))
    }
  }, [settings])

  if (loading) {
    return (
      <View style={styles.wrapper}>
        <Dialog.Loading />
      </View>
    )
  }

  let data = []
  for (let i = 0; i < nextWeather.length; i++) {
    data.push({
      id: i,
      time: moment(nextWeather[i]['DateTime']).format('h A'),
      temp: nextWeather[i]['Temperature']['Value'] + '°',
    })
  }

  type ItemProps = { time: string; temp: string }

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
          {settings && settings.locationCity}
        </Button>
        <Button type="outline" onPress={() => navigation.navigate('Future')}>
          Next 5 Days
        </Button>
      </View>
      <View style={styles.centerContainer}>
        <Text
          style={{
            fontWeight: '600',
            marginBottom: theme.spacing.lg,
            fontSize: 50,
          }}
        >
          {!currWeather || !settings
            ? 'Loading...'
            : `${getWeatherNum()}${
                settings.temperatureUnit === 'C' ? '°C' : '°F'
              }`}
        </Text>
        <View style={styles.visualizationContainer}>
          <FlatList
            data={data}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Item time={item.time} temp={item.temp} />
            )}
            // keyExtractor={item => item.id}
          />
        </View>
        <View style={styles.avatarContainer}>
          {currWeather && (
            <ClothingRec
              currTemp={getWeatherNum()!}
              metric={settings!.temperature === 'C'}
            />
          )}
          {currWeather && settings && (
            <FAB
              size="small"
              icon={{ name: 'message', color: 'white' }}
              color={theme.colors.primary}
              placement="right"
              onPress={() => navigation.navigate('Feedback')}
            />
          )}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          type="clear"
          icon={
            <Icon
              name="settings"
              type="feather"
              size={32}
              color={theme.colors.primary}
              onPress={() => navigation.navigate('Settings')}
            />
          }
        />
        {alertsExist && (
          <Button
            type="clear"
            icon={
              <Icon
                name="exclamation-circle"
                type="font-awesome"
                size={32}
                color={theme.colors.error}
                onPress={() => navigation.navigate('HealthAlerts')}
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
    marginTop: theme.spacing.xl,
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
    marginVertical: theme.spacing.lg,
    padding: theme.spacing.md,
    width: '80%',
    height: '25%',
    backgroundColor: theme.colors.grey5,
    flexDirection: 'column',
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
    backgroundColor: theme.colors.grey5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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

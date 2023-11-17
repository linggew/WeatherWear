import type { NavigationProp } from '@react-navigation/native'
import { makeStyles, Text, Button, Icon, useTheme, Dialog } from '@rneui/themed'
import React, { useState, useEffect } from 'react'
import { FlatList, View } from 'react-native'

import { ClothingRec } from '../components/ClothingRec'
import useAsyncStorage from '../hooks/useAsyncStorage'
import { getCurrentWeather, getNext12HrsWeather } from '../utils/weather'
import moment from 'moment'

type HomeProps = {
  navigation: NavigationProp<any>
}

// const locationKey = '328774' //Champaign location key
// const metric = false

// //same as above
// const next12HrsUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${API_KEY}&details=true&metric=${metric}`

// //details=true for text explaining index value, in case we want to display it
// const indicesUrl = `http://dataservice.accuweather.com/indices/v1/daily/1day/${locationKey}?apikey=${API_KEY}&details=true`

export const Home = ({ navigation }: HomeProps) => {
  const styles = useStyles()
  const { theme } = useTheme()
  const { settings, loading } = useAsyncStorage()

  const [currWeather, setCurrWeather] = useState(null)
  const [metrica, setMetrica] = useState('F')

  const getWeatherNum = () => {
    if (currWeather) {
      return currWeather['Temperature'][
        settings!.temperatureUnit === 'C' ? 'Metric' : 'Imperial'
      ]['Value']
    }
  }
  const [nextWeather, setNextWeather] = useState([])

  useEffect(() => {
    if (settings) {
      getCurrentWeather(settings!.locationKey, settings!.temperatureUnit).then(
        (data) => setCurrWeather(data),
      )
      getNext12HrsWeather(
        settings!.locationKey,
        settings!.temperatureUnit,
      ).then((data) => setNextWeather(data))
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
            fontSize: '50dpi',
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
    justifyContent: 'flex-start',
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
    padding: theme.spacing.xl,
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

import { API_KEY, BACKUP_API_KEY } from '@env'
import type { NavigationProp } from '@react-navigation/native'
import { makeStyles, Text, Button, Icon, useTheme } from '@rneui/themed'
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'

type HomeProps = {
  navigation: NavigationProp<any>
}

const locationKey = '328774' //Champaign location key

const metric = false

//details=true for real-feel temp, wind, UV index, etc.
const currCondUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${API_KEY}&details=true&metric=${metric}`

//same as above
const next12HrsUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${API_KEY}&details=true&metric=${metric}`

//details=true for text explaining index value, in case we want to display it
const indicesUrl = `http://dataservice.accuweather.com/indices/v1/daily/1day/${locationKey}?apikey=${API_KEY}&details=true`

export const Home = ({ navigation }: HomeProps) => {
  const styles = useStyles()
  const { theme } = useTheme()

  const [currData, setCurrData] = useState([])
  const [currLoading, setCurrLoading] = useState(true)

  const [next12Data, setNext12Data] = useState([]) //next 12 hours
  const [next12Loading, setNext12Loading] = useState(true)

  const [indicesData, setIndicesData] = useState([]) //daily indices
  const [indicesLoading, setIndicesLoading] = useState(true)

  useEffect(() => {
    fetch(currCondUrl)
      .then((resp) => resp.json())
      .then((json) => {
        setCurrData(json)
      })
      .catch((error) => console.error(error))
      .finally(() => setCurrLoading(false))

    fetch(next12HrsUrl)
      .then((resp) => resp.json())
      .then((json) => {
        setNext12Data(json)
      })
      .catch((error) => console.error(error))
      .finally(() => setNext12Loading(false))

    fetch(indicesUrl)
      .then((resp) => resp.json())
      .then((json) => {
        setIndicesData(json)
      })
      .catch((error) => console.error(error))
      .finally(() => setIndicesLoading(false))
  }, []) //empty dependencies array: should only run upon initial render

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
          Champaign
        </Button>
        <Button type="outline" onPress={() => navigation.navigate('Future')}>
          Next 5 Days
        </Button>
      </View>
      <View style={styles.centerContainer}>
        <Text h1 style={{ fontWeight: '600', marginBottom: theme.spacing.lg }}>
          {currLoading || !currData[0]
            ? 'Loading...'
            : `${
                currData[0]['Temperature'][metric ? 'Metric' : 'Imperial'][
                  'Value'
                ]
              }${metric ? '°C' : '°F'}`}
        </Text>
        <View style={styles.visualizationContainer}>
          <Text>Visualization Placeholder</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Text>Avatar Placeholder</Text>
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
    padding: theme.spacing.xl,
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
}))

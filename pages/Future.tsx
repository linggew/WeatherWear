import 'react-native-gesture-handler'
import { useHeaderHeight } from '@react-navigation/elements'
import { makeStyles, Text, Dialog } from '@rneui/themed'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Dimensions, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

import useAsyncStorage from '../hooks/useAsyncStorage'
import { getNext5DaysWeather } from '../utils/weather'
import { ClothingRec } from '../components/ClothingRec'

export const Future = () => {
  const styles = useStyles()
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height - useHeaderHeight()

  const [next5Data, setNext5Data] = useState(Object) //next 5 days

  const { settings, loading } = useAsyncStorage()

  useEffect(() => {
    if (settings) {
      getNext5DaysWeather(
        settings!.locationKey,
        settings!.temperatureUnit,
      ).then((data) => setNext5Data(data))
    }
  }, [settings])

  if (!settings || loading || !next5Data['DailyForecasts']) {
    return (
      <View style={styles.wrapper}>
        <Dialog.Loading />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Carousel
        loop={false}
        width={width}
        height={height}
        autoPlay={false}
        data={[...new Array(5).keys()]}
        scrollAnimationDuration={300}
        renderItem={({ index }) => (
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <View style={styles.datesContainer}>
                {next5Data['DailyForecasts']
                  .map((forecast: any) => {
                    return forecast['Date'].split('-')[2].slice(0, 2)
                  })
                  .map((day: any, ind: number) => {
                    return (
                      <Text
                        style={{
                          fontSize: 30,
                          fontWeight: index === ind ? '800' : 'normal',
                        }}
                        key={ind}
                      >
                        {day}
                      </Text>
                    )
                  })}
              </View>
              <Text style={{ textAlign: 'center', fontSize: 20 }}>
                {moment(
                  next5Data['DailyForecasts'][index]['Date'].split('T')[0],
                ).format('dddd, MMMM Do, YYYY')}
              </Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={{ textAlign: 'center', fontSize: 30 }}>
                {`${next5Data['DailyForecasts'][index]['Temperature']['Maximum']['Value']}°${next5Data['DailyForecasts'][index]['Temperature']['Maximum']['Unit']} / ${next5Data['DailyForecasts'][index]['Temperature']['Minimum']['Value']}°${next5Data['DailyForecasts'][index]['Temperature']['Minimum']['Unit']}`}
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 25 }}>
                {`${next5Data['DailyForecasts'][index]['Day']['IconPhrase']}`}
              </Text>
              <View style={styles.avatarContainer}>
                <ClothingRec
                  currTemp={
                    (next5Data['DailyForecasts'][index]['Temperature'][
                      'Maximum'
                    ]['Value'] +
                      next5Data['DailyForecasts'][index]['Temperature'][
                        'Minimum'
                      ]['Value']) /
                    2
                  }
                  metric={settings!.temperatureUnit === 'C'}
                />
              </View>
            </View>
          </View>
        )}
      />
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    marginTop: theme.spacing.md,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    marginTop: theme.spacing.xl,
  },
  avatarContainer: {
    borderRadius: 20,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    padding: theme.spacing.xl,
    width: '80%',
    flex: 0.8,
    backgroundColor: theme.colors.grey5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

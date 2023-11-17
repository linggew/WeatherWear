import React, { useState, useEffect } from 'react'
import { ScrollView, View } from 'react-native'
import { makeStyles, Text, Dialog } from '@rneui/themed'
import useAsyncStorage from '../hooks/useAsyncStorage'

import { getHealthAlerts } from '../utils/weather'

export const HealthAlerts = () => {
  const styles = useStyles()
  const { settings, loading } = useAsyncStorage()

  const [healthAlerts, setHealthAlerts] = useState<any[]>([])

  useEffect(() => {
    if (settings) {
      getHealthAlerts(
        settings!.locationKey,
        settings!.asthma,
        settings!.fever,
        settings!.allergy,
      ).then((data: any[]) => setHealthAlerts(data))
    }
  }, [settings])

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Dialog.Loading />
      </ScrollView>
    )
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {healthAlerts?.map((alert, index) => {
          return (
            <View key={index} style={styles.card}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {' '}
                {alert['name']}{' '}
              </Text>
              <Text style={{ fontSize: 20, fontStyle: 'italic' }}>
                {' '}
                {alert['category']}{' '}
              </Text>
              <Text style={{ fontSize: 20 }}> {alert['text']} </Text>
            </View>
          )
        })}
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
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 20,
    textAlign: 'left',
    marginVertical: theme.spacing.lg,
    padding: theme.spacing.xl,
    width: '80%',
    flex: 1,
    backgroundColor: theme.colors.grey5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
}))

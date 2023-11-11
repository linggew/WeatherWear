import type { NavigationProp } from '@react-navigation/native'
import { makeStyles, Text, Button, Icon, useTheme } from '@rneui/themed'
import React from 'react'
import { View } from 'react-native'

type HomeProps = {
  navigation: NavigationProp<any>
}

export const Home = ({ navigation }: HomeProps) => {
  const styles = useStyles()
  const { theme } = useTheme()

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
          Next 7 Days
        </Button>
      </View>
      <View style={styles.centerContainer}>
        <Text h1 style={{ fontWeight: '600', marginBottom: theme.spacing.lg }}>
          80°F
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

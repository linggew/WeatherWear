import { makeStyles, Text } from '@rneui/themed'
import React from 'react'
import { View } from 'react-native'

export const Settings = () => {
  const styles = useStyles()

  return (
    <View style={styles.container}>
      <Text h3>Settings</Text>
    </View>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

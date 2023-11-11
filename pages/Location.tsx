import { makeStyles, Text } from '@rneui/themed'
import React from 'react'
import { View } from 'react-native'

export const Location = () => {
  const styles = useStyles()

  return (
    <View style={styles.container}>
      <Text h3>Location Search</Text>
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

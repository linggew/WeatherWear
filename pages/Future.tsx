import { makeStyles, Text } from '@rneui/themed'
import React from 'react'
import { View } from 'react-native'

export const Future = () => {
  const styles = useStyles()

  return (
    <View style={styles.container}>
      <Text h3>Next 7 Days</Text>
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

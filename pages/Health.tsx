import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

export const Health = () => {
  return (
    <View style={styles.container}>
      <Text>Health</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

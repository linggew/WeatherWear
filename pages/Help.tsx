import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

export const Help = () => {
  return (
    <View style={styles.container}>
      <Text>Help</Text>
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

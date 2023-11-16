import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

export const About = () => {
  return (
    <View style={styles.container}>
      <Text>About</Text>
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

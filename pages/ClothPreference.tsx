import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

export const ClothPreference = () => {
  return (
    <View style={styles.container}>
      <Text>ClothPreference</Text>
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

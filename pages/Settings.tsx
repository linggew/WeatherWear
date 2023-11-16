import { useNavigation } from '@react-navigation/native'
import { makeStyles, Text, Switch } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { List } from 'react-native-paper'

import { getTemperatureUnit, setTemperatureUnit } from '../utils/storage'

interface SettingsScreenProps {}

type TemperatureUnit = 'C' | 'F'
export const Settings: React.FC<SettingsScreenProps> = () => {
  const styles = useStyles()
  const navigation = useNavigation()
  const [temperatureUnit, setTemperatureUnitState] =
    useState<TemperatureUnit>('C')

  useEffect(() => {
    const loadTemperatureUnit = async () => {
      const savedTemperatureUnit = await getTemperatureUnit()
      // Use the saved value if it exists and is a valid TemperatureUnit, otherwise use the default 'C'
      if (
        savedTemperatureUnit &&
        (savedTemperatureUnit === 'C' || savedTemperatureUnit === 'F')
      ) {
        setTemperatureUnitState(savedTemperatureUnit)
      } else {
        setTemperatureUnitState('C') // Default to 'C' if the retrieved value is invalid or null
      }
    }

    loadTemperatureUnit()
  }, [])

  //switch bar to switch C and F
  const handleTemperatureUnitChange = () => {
    const newUnit = temperatureUnit === 'C' ? 'F' : 'C'
    setTemperatureUnitState(newUnit)
    setTemperatureUnit(newUnit)
  }
  const handleHealthPress = () => {
    navigation.navigate('Health' as never)
  }
  const handleClothPreferencePress = () => {
    navigation.navigate('ClothPreference' as never)
  }
  const handleHelpPress = () => {
    navigation.navigate('Help' as never)
  }
  const handleAboutPress = () => {
    navigation.navigate('About' as never)
  }
  return (
    <View style={styles.container}>
      <List.Section>
        {/* Temperature Unit */}
        <List.Item
          title="Temperature Unit"
          titleStyle={styles.title}
          description={temperatureUnit === 'C' ? 'Celsius' : 'Fahrenheit'} // Display Celsius or Fahrenheit based on the selected unit
          left={() => <List.Icon icon="thermometer" />}
          right={() => (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>F</Text>
              <Switch
                value={temperatureUnit === 'C'}
                onValueChange={handleTemperatureUnitChange}
              />
              <Text style={styles.switchLabel}>C</Text>
            </View>
          )}
        />
        {/* health setting */}
        <TouchableOpacity onPress={handleHealthPress}>
          <View style={styles.titleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <List.Icon icon="heart" style={{ marginRight: 15 }} />
              <Text style={styles.title}>Health Preferences</Text>
            </View>
            <List.Icon icon="chevron-right" />
          </View>
        </TouchableOpacity>

        {/* Clothing Preference */}
        <TouchableOpacity onPress={handleClothPreferencePress}>
          <View style={styles.titleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <List.Icon icon="tshirt-crew" style={{ marginRight: 15 }} />
              <Text style={styles.title}>Clothing Preferences</Text>
            </View>
            <List.Icon icon="chevron-right" />
          </View>
        </TouchableOpacity>
        {/* navigate to help page */}
        <TouchableOpacity onPress={handleHelpPress}>
          <View style={styles.titleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <List.Icon icon="help-circle" style={{ marginRight: 15 }} />
              <Text style={styles.title}>Help</Text>
            </View>
            <List.Icon icon="chevron-right" />
          </View>
        </TouchableOpacity>
        {/* navigate to about page */}
        <TouchableOpacity onPress={handleAboutPress}>
          <View style={styles.titleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <List.Icon icon="information" style={{ marginRight: 15 }} />
              <Text style={styles.title}>About</Text>
            </View>
            <List.Icon icon="chevron-right" />
          </View>
        </TouchableOpacity>
      </List.Section>
    </View>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}))

import AsyncStorage from '@react-native-async-storage/async-storage'
import type { NavigationProp } from '@react-navigation/native'
import { makeStyles, Text, CheckBox, Dialog } from '@rneui/themed'
import * as React from 'react'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

import useAsyncStorage from '../hooks/useAsyncStorage'

type HealthPreferencesProps = {
  navigation: NavigationProp<any>
}
export const Health = ({ navigation }: HealthPreferencesProps) => {
  const styles = useStyles()

  const [asthma, setAsthma] = React.useState(false)
  const [sick, setSick] = React.useState(false)
  const [allergy, setAllergy] = React.useState(false)
  const [heat, setHeat] = React.useState(false)

  const { settings, loading } = useAsyncStorage()

  React.useEffect(() => {
    if (settings) {
      setAsthma(settings.asthma ? settings.asthma === 'true' : false)
      setSick(settings.fever ? settings.fever === 'true' : false)
      setAllergy(settings.allergy ? settings.allergy === 'true' : false)
      setHeat(
        settings.heatIntolerance ? settings.heatIntolerance === 'true' : false,
      )
    }
  }, [settings])

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Preferences Updated',
      text2: 'Your preferences have been updated successfully!',
      visibilityTime: 2000,
      autoHide: true,
    })
  }

  const toggleAsthma = () => {
    setAsthma(!asthma)
    AsyncStorage.setItem('asthma', (!asthma).toString()).then(() => showToast())
  }
  const toggleSick = () => {
    setSick(!sick)
    AsyncStorage.setItem('fever', (!sick).toString()).then(() => showToast())
  }

  const toggleAllergy = () => {
    setAllergy(!allergy)
    AsyncStorage.setItem('allergy', (!allergy).toString()).then(() =>
      showToast(),
    )
  }
  const toggleHeatIntol = () => {
    setHeat(!heat)
    AsyncStorage.setItem('heatIntolerance', (!heat).toString()).then(() =>
      showToast(),
    )
  }

  if (loading) {
    return (
      <View>
        <Dialog.Loading />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.mycont}>
        <Text h3> Asthma</Text>
        <CheckBox
          checked={asthma}
          onPress={() => toggleAsthma()}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checkedColor="#3366CC"
        />
      </View>
      <View style={styles.mycont}>
        <Text h3>Sick / Fever</Text>
        <CheckBox
          checked={sick}
          onPress={() => toggleSick()}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checkedColor="#3366CC"
        />
      </View>
      <View style={styles.mycont}>
        <Text h3>Allergy</Text>
        <CheckBox
          checked={allergy}
          onPress={() => toggleAllergy()}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checkedColor="#3366CC"
        />
      </View>
      <View style={styles.mycont}>
        <Text h3>Heat Intolerance</Text>
        <CheckBox
          checked={heat}
          onPress={() => toggleHeatIntol()}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checkedColor="#3366CC"
        />
      </View>
      <Toast />
    </View>
  )
}

const useStyles = makeStyles((theme) => ({
  //styles here
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginVertical: theme.spacing.lg,
  },
  mycont: {
    borderRadius: 20,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    padding: theme.spacing.xl,
    width: '80%',
    height: '15%',
    backgroundColor: theme.colors.grey5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirm: {
    borderRadius: 20,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    padding: theme.spacing.xl,
    width: '80%',
    height: '9%',
    backgroundColor: '#9FBB73',
    justifyContent: 'center',
  },
  message: {
    // Styles for the message here
    color: 'black',
    fontSize: 18,
    marginTop: 10,
  },
}))

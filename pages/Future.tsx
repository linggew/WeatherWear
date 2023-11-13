import { makeStyles, Text } from '@rneui/themed'
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'

const locationKey = '328774' //Champaign location key
const apiKey = 'Uak4rV2fF19KADMGhnt5QKhdXG04Rfuu' //our main api key
// const apiKey = 'SzD9dZPdAS9ASjyuZhemkGscADKJlHhq' //a back-up if first one hits daily limit while testing things
const metric = false

const next5DaysUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&details=false&metric=${metric}`

export const Future = () => {
  const styles = useStyles()

  const [next5Data, setNext5Data] = useState([]) //next 5 days
  const [next5Loading, setNext5Loading] = useState(true)

  useEffect(() => {
    fetch(next5DaysUrl)
      .then((resp) => resp.json())
      .then((json) => {
        setNext5Data(json)
        // console.log("next 5 days:")
        // console.log(JSON.stringify(json, null, 2))
      })
      .catch((error) => console.error(error))
      .finally(() => setNext5Loading(false))
  }, []) //empty dependencies array: should only run upon initial render

  return (
    <View style={styles.container}>
      <Text h3>Next 5 Days</Text>
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

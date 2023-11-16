import { NavigationProp } from '@react-navigation/native'
import { ListItem, makeStyles, SearchBar } from '@rneui/themed'
import { useState } from 'react'
import { View } from 'react-native'

import { setLocation } from '../utils/storage'
import type { CityKey } from '../utils/types'
import { autoCompleteSearch } from '../utils/weather'

type LocationProps = {
  navigation: NavigationProp<any>
}

export const Location = ({ navigation }: LocationProps) => {
  const styles = useStyles()
  const [search, setSearch] = useState<string>('')
  const [results, setResults] = useState<CityKey[]>([])

  return (
    <View style={styles.container}>
      <SearchBar
        lightTheme
        onChangeText={(search) => setSearch(search)}
        value={search}
        placeholder="Search for a location"
        onSubmitEditing={() => autoCompleteSearch(search, setResults)}
        onClear={() => {
          setResults([])
          setSearch('')
        }}
      />
      {/* TODO: update local storage */}
      {results.map((result) => (
        <ListItem
          key={result.key}
          onPress={() => {
            navigation.navigate('Home')
            setLocation(result)
          }}
        >
          <ListItem.Title>
            {result.city}, {result.area}
          </ListItem.Title>
        </ListItem>
      ))}
    </View>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}))

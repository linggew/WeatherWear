import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'

type AsyncStorageData = { [key: string]: string } | null

const useAsyncStorage = () => {
  const [data, setData] = useState<AsyncStorageData>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const result = await AsyncStorage.multiGet(keys)

      const dataObject: AsyncStorageData = {}
      result.forEach(([key, value]) => {
        dataObject[key] = value!
      })
      console.log(dataObject)
      setData(dataObject)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data from AsyncStorage:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, []),
  )

  return { settings: data, loading }
}

export default useAsyncStorage

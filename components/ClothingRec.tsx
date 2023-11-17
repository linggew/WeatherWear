import { useFocusEffect } from '@react-navigation/native'
import { Card, Text } from '@rneui/themed'
import { useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'

import { getClothPreferenceData } from '../utils/storage'

type ClothingRecProps = {
  currTemp: number
  metric: boolean
}

export const ClothingRec = ({ currTemp, metric }: ClothingRecProps) => {
  const [preference, setPreference] = useState(null)
  const [rec, setRec] = useState<string[]>([])

  const recommendClothing = () => {
    const {
      Coat,
      Jacket,
      LongPants,
      LongSleeve,
      Shorts,
      ShortsLeeve,
      Sleeveless,
      WarmPants,
    } = metric === true ? preference!['C'] : preference!['F']
    const upper = {
      '🧥 Coat': Coat,
      '🧥 Jacket': Jacket,
      'Long Sleeve': LongSleeve,
      '👕 Short Sleeve': ShortsLeeve,
      '👗 Sleeveless': Sleeveless,
    }
    const lower = {
      '👖 Warm Pants': WarmPants,
      '👖 Long Pants': LongPants,
      '🩳 Shorts': Shorts,
    }

    const currRec = []
    for (const [key, value] of Object.entries(upper)) {
      if (currTemp <= value) {
        currRec.push(key)
        break
      }
    }
    for (const [key, value] of Object.entries(lower)) {
      if (currTemp <= value) {
        currRec.push(key)
        break
      }
    }
    setRec(currRec)
  }

  useEffect(() => {
    getClothPreferenceData().then((data) => {
      setPreference(data)
    })
  }, [])

  useEffect(() => {
    if (preference) {
      recommendClothing()
    }
  }, [preference])

  useFocusEffect(
    useCallback(() => {
      getClothPreferenceData().then((data) => {
        setPreference(data)
      })
    }, []),
  )

  return (
    <View>
      {rec.map((item) => (
        <Card key={item} containerStyle={{ borderRadius: 8 }}>
          <Text h3>{item}</Text>
        </Card>
      ))}
    </View>
  )
}

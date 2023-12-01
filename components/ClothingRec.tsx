import { useFocusEffect } from '@react-navigation/native'
import { Dialog } from '@rneui/themed'
import { useEffect, useState, useCallback } from 'react'
import { ImageURISource, View, Text } from 'react-native'
import SvgUri from 'react-native-svg-uri'

import { getClothPreferenceData } from '../utils/storage'

type ClothingRecProps = {
  currTemp: number
  metric: boolean
}

const coat = require('../assets/clothing/coat.svg')
const jacket = require('../assets/clothing/jacket.svg')
const longPants = require('../assets/clothing/long-pants.svg')
const longSleeve = require('../assets/clothing/long-sleeve.svg')
const shortSleeve = require('../assets/clothing/short-sleeve.svg')
const shorts = require('../assets/clothing/shorts.svg')
const sleeveless = require('../assets/clothing/sleeveless.svg')
const warmPants = require('../assets/clothing/warm-pants.svg')

export const ClothingRec = ({ currTemp, metric }: ClothingRecProps) => {
  const [preference, setPreference] = useState(null)
  const [rec, setRec] = useState<ImageURISource[]>([])

  const recommendClothing = () => {
    if (preference) {
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

      const upper: Record<string, number> = {
        Coat,
        Jacket,
        'Long Sleeve': LongSleeve,
        'Short Sleeve': ShortsLeeve,
        Sleeveless,
      }

      const lower: Record<string, number> = {
        'Warm Pants': WarmPants,
        'Long Pants': LongPants,
        Shorts,
      }

      const svgSource: Record<string, ImageURISource> = {
        Coat: coat,
        Jacket: jacket,
        'Long Sleeve': longSleeve,
        'Short Sleeve': shortSleeve,
        Sleeveless: sleeveless,
        'Warm Pants': warmPants,
        'Long Pants': longPants,
        Shorts: shorts,
      }

      const currRec = []
      for (const [key, value] of Object.entries(upper)) {
        if (currTemp <= value) {
          currRec.push(svgSource[key])
          break
        }
      }
      for (const [key, value] of Object.entries(lower)) {
        if (currTemp <= value) {
          currRec.push(svgSource[key])
          break
        }
      }
      setRec(currRec)
    }
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
  }, [preference, currTemp, metric])

  useFocusEffect(
    useCallback(() => {
      getClothPreferenceData().then((data) => {
        setPreference(data)
      })
    }, []),
  )

  if (rec.length === 0 || preference === null) {
    return (
      <View>
        <Dialog.Loading />
      </View>
    )
  }

  return (
    <View>
      {rec.map((item, index) => (
        <SvgUri key={index} width={130} height={130} source={item} />
      ))}
    </View>
  )
}

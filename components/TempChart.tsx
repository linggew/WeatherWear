import React from 'react'
import { Dimensions, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

import { WeatherType } from '../pages/Home'

type TempChartProps = {
  data: WeatherType[]
}

const TempChart = ({ data }: TempChartProps) => {
  const mapDataForChart = (originalData: WeatherType[]) => {
    const labels = originalData.map((item) => item.time)
    const temperatures = originalData.map((item) => item.temp)

    return {
      labels,
      datasets: [
        {
          data: temperatures,
        },
      ],
    }
  }

  const screenWidth = Dimensions.get('window').width

  return (
    <View style={{ alignItems: 'center' }}>
      <LineChart
        data={mapDataForChart(data)}
        width={screenWidth * 0.9}
        height={100}
        yAxisSuffix="°"
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          strokeWidth: 7,
          color: (opacity = 1) => `rgba(0, 120, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '0',
            strokeWidth: '0',
            stroke: '#ffa726',
          },
        }}
        withVerticalLabels={false}
        withInnerLines={false}
        withOuterLines={false}
        yAxisInterval={3}
        bezier
      />
    </View>
  )
}

export default TempChart

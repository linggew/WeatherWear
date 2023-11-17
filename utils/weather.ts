import { API_KEY } from '@env'

import { CityKey } from './types'

const autoCompleteSearch = async (
  query: string,
  callback: (results: CityKey[]) => void,
) => {
  const data = await fetch(
    `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${query}`,
  )
  const results = await data.json()
  if (!results) {
    callback([])
    return
  }
  const cities = results.map((result: any) => {
    return {
      city: result.LocalizedName,
      key: result.Key,
      area: result.AdministrativeArea.LocalizedName,
    }
  })
  callback(cities)
}

const getCurrentWeather = async (key: string, metric: string) => {
  const data = await fetch(
    `http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${API_KEY}&details=true&metric=${metric}`,
  )
  const results = await data.json()
  if (!results) {
    return null
  }
  return results[0]
}

const getNext5DaysWeather = async (key: string, metric: string) => {
  const data = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}?apikey=${API_KEY}&details=false&metric=${metric}`,
  )
  const results = await data.json()
  if (!results) {
    return null
  }
  return results
}

const getNext12HrsWeather = async (key: string, metric: string) => {
  const data = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}?apikey=${API_KEY}&details=true&metric=${metric}`,
  )
  const results = await data.json()
  if (!results) {
    return null
  }
  return results
}

export {
  autoCompleteSearch,
  getCurrentWeather,
  getNext5DaysWeather,
  getNext12HrsWeather,
}

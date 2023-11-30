import { API_KEY, BACKUP_API_KEY } from '@env'

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

const getCurrentWeather = async (key: string, tempUnit: string) => {
  const metric = tempUnit === 'C'
  const data = await fetch(
    `http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${API_KEY}&details=true&metric=${metric}`,
  )
  const results = await data.json()
  console.log(results)
  if (!results) {
    return null
  }
  return results[0]
}

const getNext5DaysWeather = async (key: string, tempUnit: string) => {
  const metric = tempUnit === 'C'
  const data = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}?apikey=${API_KEY}&details=false&metric=${metric}`,
  )
  const results = await data.json()
  if (!results) {
    return null
  }
  return results
}

const getNext12HrsWeather = async (key: string, tempUnit: string) => {
  const metric = tempUnit === 'C'
  const data = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}?apikey=${API_KEY}&details=true&metric=${metric}`,
  )
  const results = await data.json()
  if (!results) {
    return null
  }
  return results
}

const getHealthAlerts = async (
  key: string,
  asthma: string,
  fever: string,
  allergy: string,
) => {
  const data = await fetch(
    `http://dataservice.accuweather.com/indices/v1/daily/1day/${key}?apikey=${API_KEY}&details=true`,
  )
  const results = await data.json()
  if (!results) {
    return []
  }

  const alerts = []
  if (asthma && results[24]['CategoryValue'] > 1) {
    alerts.push({
      name: results[24]['Name'],
      category: results[24]['Category'],
      text: results[24]['Text'],
    })
  }
  if (fever && results[26]['CategoryValue'] > 1) {
    alerts.push({
      name: results[26]['Name'],
      category: results[26]['Category'],
      text: results[26]['Text'],
    })
  }
  if (fever && results[27]['CategoryValue'] > 1) {
    alerts.push({
      name: results[27]['Name'],
      category: results[27]['Category'],
      text: results[27]['Text'],
    })
  }
  if (allergy && results[19]['CategoryValue'] > 1) {
    alerts.push({
      name: results[19]['Name'],
      category: results[19]['Category'],
      text: results[19]['Text'],
    })
  }
  return alerts
}

const healthAlertsExist = async (
  key: string,
  asthma: string,
  fever: string,
  allergy: string,
) => {
  const data = await fetch(
    `http://dataservice.accuweather.com/indices/v1/daily/1day/${key}?apikey=${API_KEY}&details=true`,
  )
  const results = await data.json()
  if (!results) {
    return false
  }
  const asthmaAlert = results[24]['CategoryValue'] > 1 && asthma === 'true'
  const coldAlert = results[26]['CategoryValue'] > 1 && fever === 'true'
  const fluAlert = results[27]['CategoryValue'] > 1 && fever === 'true'
  const allergyAlert = results[19]['CategoryValue'] > 1 && allergy === 'true'

  if (asthmaAlert || coldAlert || fluAlert || allergyAlert) {
    return true
  }
  return false
}
export {
  autoCompleteSearch,
  getCurrentWeather,
  getNext5DaysWeather,
  getNext12HrsWeather,
  getHealthAlerts,
  healthAlertsExist,
}


import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getIpAddress, getGeoByAddress, getReGeoByLocation, getCityAndHotCity, getWeatherByAdcode } from '@/api'
import localStorageManager from '@/util/localStorageManager'
export const useCityStore = defineStore('cityStore', () => {

  const cityUser = ref('')
  const cityInfoCache_cityStore = ref([])
  // 🔴
  const getCityUser = async () => {
    const address = await getIpAddress()
    cityUser.value = address.city
  }

  const cityListVisited = ref([])
  // 🔴
  const add_cityListVisited = (cityName) => {
    cityListVisited.value.push(cityName)
    localStorageManager('set/random', 'cityListVisited-', cityListVisited.value)
  }
  // 🔴
  const remove_cityListVisited = (cityName) => {
    cityListVisited.value = cityListVisited.value.filter(item => item !== cityName)
    localStorageManager('set/random', 'cityListVisited-', cityListVisited.value)
  }
  // 🔴
  const get_cityListVisited = (resultArr) => {
    return localStorageManager('get', 'cityListVisited-', resultArr)
  }
  // 🔴
  const clear_cityListVisited = () => {
    localStorageManager('clear', 'cityListVisited-')
  }
  // 🔴
  const cityResponse = ref([])
  const getCityResponse = async (input) => {
    cityResponse.value = []
    const res = await getCityAndHotCity()
    const cities = res.cities
    for (let key in cities) {
      cities[key].forEach((city) => {
        if (city.spell.startsWith(input) || city.name.includes(input))
          cityResponse.value.push(city)
      });
    }
    return cityResponse.value.map((city) => city.name)
  }
  // 🔴
  const getCityByCapital = async (capital) => {
    if (typeof capital !== 'string' || capital.length !== 1) return
    const res = await getCityAndHotCity()
    if (!res) return
    const cities = res.cities
    for (let key in cities) {
      if (key === capital) {
        return cities[key]
      }
    }
  }

  const getAllCity = async () => {
    let allCity = []
    const res = await getCityAndHotCity()
    if (!res) return []
    const cities = res.cities
    console.log(cities)
    for (let key in cities) {
      if (key === 'A')
        cities[key].forEach((city) => {
          addProperty(city, 'capital', 'A')
          allCity.put(city)
        })
    }
    return allCity
  }

  const requeseWeather_base_byCityName = async (cityName) => {
    const cityInfo = await createCityInfoByCityName(cityName)

    if (!cityInfo) return
    if (!cityInfoCache_cityStore.value.find(cityInfo => cityInfo.adcode === adcode))
      cityInfoCache_cityStore.value.push(cityInfo)
    const adcode = cityInfo.adcode
    const _res = await getWeatherByAdcode(adcode, 'base')
    const city_wtr = {
      reporttime: _res.reporttime,//留作历史记录
      city: _res.city,
      weather: _res.weather,
      temperature: _res.temperature_float,
      windDirection: _res.winddirection,
      windPower: _res.windpower,
    }
    return city_wtr
  }


  const requeseWeather_base = async (adcode) => {
    const _res = await getWeatherByAdcode(adcode, 'base')
    const city_wtr = {
      reporttime: _res.reporttime,//留作历史记录
      city: _res.city,
      weather: _res.weather,
      temperature: _res.temperature_float,
      windDirection: _res.winddirection,
      windPower: _res.windpower,
    }
    return city_wtr
  }


  // ----------------------------------------------------------------
  async function requestCoordinatesByCityName(cityName) {
    const cityInfo = await createCityInfoByCityName(cityName)
    if (!cityInfoCache_cityStore.value.find(cityInfo => cityInfo.adcode === adcode))
      cityInfoCache_cityStore.value.push(cityInfo)
    return cityInfo.coordinates
  }

  //用于缓存的cityInfo
  const createCityInfoByCityName = async (cityName) => {
    const res = await getGeoByAddress(cityName)
    if (!res) return null
    //缓存
    const city = res.city
    const adcode = res.adcode
    const location = res.location
    const level = res.level
    const coordinates = location.split(",").map(item => +item)
    const cityInfo = { city, adcode, coordinates, level }
    return cityInfo
  }


  // 缓存cityInfo
  const getCache = () => {
    // 读取所以本地缓存里的cityInfo
    const cache1 = []
    const cache2 = []
    localStorageManager('get', 'cityInfoCache_cityStore-', cache1)
    localStorageManager('get', 'cityInfoCache_olMapStore-', cache2)
    const cityCache = [...cache1, ...cache2]
    return cityCache
  }
  const setCache = () => {
    const resultArr = []
    localStorageManager('get', 'cityInfoCache_cityStore-', resultArr)
    resultArr.forEach(cityInfo => {
      if (!cityInfoCache_cityStore.value.find(item => item.adcode === cityInfo.adcode))
        cityInfoCache_cityStore.value.push(cityInfo)
    })
    localStorageManager('set/random', 'cityInfoCache_cityStore-', cityInfoCache_cityStore.value)
  }
  // 🔴
  const localCityWithWeatherHistory = ref([])
  const getWeatherByCityName = async (cityName) => {
    let city_wtr = {}
    const cityCache = getCache()
    if (cityCache.length > 0) {
      const cityInfo = cityCache.find(cityInfo => cityInfo.city === cityName)
      if (cityInfo) {
        const adcode = cityInfo.adcode
        city_wtr = await requeseWeather_base(adcode)

      } else
        city_wtr = await requeseWeather_base_byCityName(cityName)

    } else {
      city_wtr = await requeseWeather_base_byCityName(cityName)
      if (city_wtr.city === cityUser.value) localCityWithWeatherHistory.push(city_wtr)
    }
    return city_wtr
  }
  // 🔴
  const getCityCoordinates = async (cityName) => {
    const cityCache = getCache()
    if (cityCache.length > 0) {
      const cityInfo = cityCache.find(cityInfo => cityInfo.city === cityName)
      if (cityInfo)
        return cityInfo.coordinates
      else
        await requestCoordinatesByCityName(cityName)
    } else
      await requestCoordinatesByCityName(cityName)
  }
  // ----------------------------------------------------------------


  return {
    cityUser,
    getCityUser,
    cityListVisited,
    add_cityListVisited,
    remove_cityListVisited,
    get_cityListVisited,
    clear_cityListVisited,
    cityResponse,
    getCityResponse,
    getCityByCapital,
    localCityWithWeatherHistory,
    getWeatherByCityName,
    cityInfoCache_cityStore,
    getCityCoordinates,
    getCache,
    setCache,
    getAllCity,


  }
})
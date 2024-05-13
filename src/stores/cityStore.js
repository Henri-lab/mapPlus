
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getIpAddress, getGeoByAddress, getReGeoByLocation, getCityAndHotCity, getWeatherByAdcode } from '@/api'
import localStorageManager from '@/util/localStorageManager'
export const useCityStore = defineStore('cityStore', () => {

  const cityUser = ref('')
  const getCityUser = async () => {
    const address = await getIpAddress()
    cityUser.value = address.city
  }


  const cityListVisited = ref([])
  const add_cityListVisited = (cityName) => {
    cityListVisited.value.push(cityName)
    localStorageManager('set/random', 'cityListVisited-', cityListVisited.value)
  }
  const remove_cityListVisited = (cityName) => {
    cityListVisited.value = cityListVisited.value.filter(item => item !== cityName)
    localStorageManager('set/random', 'cityListVisited-', cityListVisited.value)
  }
  const get_cityListVisited = (resultArr) => {
    return localStorageManager('get', 'cityListVisited-', resultArr)
  }
  const clear_cityListVisited = () => {
    localStorageManager('clear', 'cityListVisited-')
  }

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
  const getCityByCapital = async (capital) => {
    if (typeof capital !== 'string' || capital.length !== 1) return
    const res = await getCityAndHotCity()
    const cities = res.cities
    for (let key in cities) {
      if (key === capital) {
        return cities[key]
      }
    }
  }

  const localCityWithWeatherHistory = ref([])

  const getWeatherByCityName = async (cityName) => {
    const res = await getGeoByAddress(cityName)
    const adcode = res.adcode
    if (!res) return
    const _res = await getWeatherByAdcode(adcode, 'base')
    const city_wtr = {
      reporttime: _res.reporttime,//留作历史记录
      city: _res.city,
      weather: _res.weather,
      temperature: _res.temperature_float,
      windDirection: _res.winddirection,
      windPower: _res.windpower,
    }
    if (city_wtr.city === cityUser.value) localCityWithWeatherHistory.push(city_wtr.city)
    return city_wtr
  }

  // 为map提供支持
  const cityInfoCache_cityStore = ref([])
  const getCityCoordinates = async (cityName) => {
    const res = await getGeoByAddress(cityName)
    if (!res) return
    //缓存
    const city = res.city
    const adcode = res.adcode
    const location = res.location
    const level = res.level
    const coordinates = location.split(",").map(item => +item)
    const cityInfo = { city, adcode, coordinates, level }
    if (!cityInfoCache_cityStore.value.find(cityInfo => cityInfo.adcode === adcode))
      cityInfoCache_cityStore.value.push(cityInfo)

    return coordinates
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
    setCache,
  }
})
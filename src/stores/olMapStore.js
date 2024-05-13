
import { defineStore } from 'pinia'

import { ref } from 'vue'
import { getIpAddress, getGeoByAddress, getReGeoByLocation, getCityAndHotCity, getWeatherByAdcode } from '@/api'
import localStorageManager from '@/util/localStorageManager'

export const useOlMapStore = defineStore('olMapStore', () => {
    // Data-----------------------------
    const defaultLon = 105.00
    const defaultLat = 35.00
    const defaultCity = '中国'
    const longtitude = ref(defaultLon)
    const latitude = ref(defaultLat)
    const zoom = ref(4)
    const gdXYZ_url = ref('http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}')
    const gdXYZ_wrapX = ref(false)
    const gdTile_name = ref('basic')


    // 获取阿里云的图层数据
    const getUrlAliyun = (adcode) => {
        return `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${adcode}_full`
    }
    let index = 0
    const getLayerWithPolygonByAdcodeByAliyun = async (layerName, adcode) => {
        return new ol.layer.Vector({
            source: await new ol.source.Vector({
                name: layerName || `layerWithPolygonByAliyun-${index++}`,
                url: getUrlAliyun(adcode),
                format: new ol.format.GeoJSON(),
            }),
        })
    }

    // 根据图层name清除指定地图的图层
    function clearLayersByName($map, layerName) {
        $map.getLayers().getArray().forEach((layer) => {
            if (layer.get('name') === layerName) {
                $map.removeLayer(layer)
            }
        })
    }
    // 添加图层,并保持此名称图层只有一个
    async function addUniqueLayerWithPolygonByAdcodeByAliyun($map, adcode, layerNameUnique) {
        clearLayersByName($map, layerNameUnique)
        const layer = getLayerWithPolygonByAdcodeByAliyun($map, adcode, layerNameUnique)
        $map.addLayer(layer)
    }



    //根据城市名称获取城市信息进行地图视图的设置 
    //cityName为准确名字！
    const cityInfoCache_olMapStore = ref([])
    let animateZ = 0
    const getAnimateZoomByLevel = (level) => {
        if (level === '省')
            return 8
        else if (level === '市')
            return 10
        else if (level === '区县')
            return 12
        else return 14
    }
    const requestCityInfoByCityName = async (cityName) => {
        const res = await getGeoByAddress(cityName)
        const coordinates = res.location.split(",").map(item => +item)
        longtitude.value = coordinates[0]
        latitude.value = coordinates[1]
        const level = res.level
        animateZ = getAnimateZoomByLevel(level)
        console.log('zoomToByCityName request-geo')
        // 缓存
        const city = res.city
        const adcode = res.adcode
        const cityInfo = { city, adcode, coordinates, level }
        if (!cityInfoCache_olMapStore.value.find(cityInfo => cityInfo.adcode === adcode))
            cityInfoCache_olMapStore.value.push(cityInfo)
    }

    const zoomToByCityName = async (cityName, $map) => {
        const city = cityName || defaultCity
        if (city === defaultCity) {
            longtitude.value = defaultLon
            latitude.value = defaultLat
            zoom.value = 4
        } else {
            // 优先读取所以本地缓存里的cityInfo
            const cache1 = []
            const cache2 = []
            localStorageManager('get', 'cityInfoCache_cityStore-', cache1)
            localStorageManager('get', 'cityInfoCache_olMapStore-', cache2)
            const cityCache = [...cache1, ...cache2]
            if (cityCache.length > 0) {
                const cityInfo = cityCache.find(cityInfo => cityInfo.city === cityName)
                if (cityInfo) {
                    longtitude.value = cityInfo.coordinates[0]
                    latitude.value = cityInfo.coordinates[1]
                    animateZ = getAnimateZoomByLevel(cityInfo.level)
                } else // 本地缓存里没有需要的数据，则从api上获取数据
                    await requestCityInfoByCityName(cityName)
            } else // 本地缓存里没有任何数据，则从api上获取数据
                await requestCityInfoByCityName(cityName)

            // 改变视图
            let view = $map.getView()
            view.animate({
                center: ol.proj.fromLonLat([longtitude.value, latitude.value]),
                zoom: animateZ,
                duration: 2000,
            })
        }

        // test
        // console.log(longtitude.value, latitude.value, animateZ, cityName)
        // console.log(cityCache)
    }

    const setCache = () => {
        const resultArr = []
        localStorageManager('get', 'cityInfoCache_cityStore-', resultArr)
        resultArr.forEach(cityInfo => {
            if (!cityInfoCache_olMapStore.value.find(item => item.adcode === cityInfo.adcode))
                cityInfoCache_olMapStore.value.push(cityInfo)
        })
        localStorageManager('set/random', `cityInfoCache_olMapStore-`, cityInfoCache_olMapStore.value)
    }










    return {
        defaultLon,
        defaultLat,
        defaultCity,
        longtitude,
        latitude,
        zoom,
        gdXYZ_url,
        gdXYZ_wrapX,
        gdTile_name,
        getLayerWithPolygonByAdcodeByAliyun,
        clearLayersByName,
        addUniqueLayerWithPolygonByAdcodeByAliyun,
        getUrlAliyun,
        zoomToByCityName,
        cityInfoCache_olMapStore,
        setCache
    }
})
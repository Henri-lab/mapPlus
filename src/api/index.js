import { gaodeMapAPI, cityAndHotCityAPI } from "./interceptors";

// ip
async function getIpAddress() {
    try {
        const res = await gaodeMapAPI.request({
            url: '/ip',
            method: 'get',
            params: {}
        });
        return res
    } catch (e) {
        console.error('IP请求失败:', e);
    }
}
// geo

async function getGeoByAddress(address) {
    try {
        const res = await gaodeMapAPI.request({
            url: '/geocode/geo',
            method: 'get',
            params: {
                address: address
            }
        });
        return res.geocodes[0]
    } catch (e) {
        console.error('geo请求失败:', e);
    }
}

async function getReGeoByLocation(lon, lat) {
    try {
        const res = await gaodeMapAPI.request({
            url: '/geocode/regeo',
            method: 'get',
            params: {
                location: `${lon},${lat}`
            }
        });
        return res;
    } catch (e) {
        console.error('regeo请求失败:', e);
    }
}

async function getCityAndHotCity() {
    try {
        const res = await cityAndHotCityAPI.request({
            url: '/city',
            method: 'get'
        });
        return res.data;
    } catch (e) {
        console.error('cityAndHotCity请求失败:', e);
    }
}

async function getWeatherByAdcode(adcode, extensions) {
    try {
        const res = await gaodeMapAPI.request({
            url: '/weather/weatherInfo',
            method: 'get',
            params: {
                city: adcode,
                extensions,
            }
        });
        return res.lives[0];
    } catch (e) {
        console.error(' 高德天气请求失败:', e);
    }
}
export { getIpAddress, getGeoByAddress, getReGeoByLocation, getCityAndHotCity, getWeatherByAdcode }
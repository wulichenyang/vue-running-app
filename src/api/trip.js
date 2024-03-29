import {
  get,
  post,
} from "./http"

export const getDistance = async () => {
  return get('/distance')
}

export const getHistory = async (page, limit) => {
  return get(`/history?page=${page}&limit=${limit}`)
}

export const saveTrip = async (tripData) => {
  return post('/addTrip', { tripData })
}

export const saveTraffic = async (trafficData) => {
  return post('/addTraffic', { trafficData })
}

export const getTripRatio = async () => {
  return get('/tripRatio')
}

export const getDistanceComparation = async () => {
  return get('/distanceComparation')
}

export const getTripDistanceTrend = async () => {
  return get('/tripDistanceTrend')
}

export const getTrafficDistanceTrend = async () => {
  return get('/trafficDistanceTrend')
}

// export const getSunburstGraphData = async () => {
//   return get('/xxx')
// }

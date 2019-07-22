import {
  get,
  post,
} from "./http"

export const getDistance = async () => {
  return get('/distance')
}

export const getHistory = async () => {
  return get('/history')
}

export const saveTrip = async (tripData) => {
  return post('/addTrip', { tripData })
}

export const saveTraffic = async (trafficData) => {
  return post('/addTraffic', { trafficData })
}

// export const getSunburstGraphData = async () => {
//   return get('/xxx')
// }

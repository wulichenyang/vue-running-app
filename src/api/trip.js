import {
  get,
  post,
} from "./http"

export const getDistance = async () => {
  // return get('/trip/distance')
  return get('/distance')
}

export const saveTrip = async (tripData) => {
  return post('/addTripData', { tripData })
}

// export const getSunburstGraphData = async () => {
//   return get('/xxx')
// }

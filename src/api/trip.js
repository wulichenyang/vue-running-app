import {
  get,
} from "./http"

export const getDistance = async () => {
  // return get('/trip/distance')
  return get('/distance')
}

// export const getSunburstGraphData = async () => {
//   return get('/trip/sunburstGraphData')
// }

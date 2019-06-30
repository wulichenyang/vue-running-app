import {
  get,
} from "./http"

export const getDistance = async () => {
  // return get('/trip/distance')
  return new Promise((r, f) => {
    setTimeout(()=>{
      return {
        code: 0,
        message: 'OK',
        data: {
          distance: {
            walking: 1.3,
            running: 2.5,
            riding: 22.44,
            driving: 123.311
          }
        }
      }
    }, 2000)
  })
}

// export const getSunburstGraphData = async () => {
//   return get('/trip/sunburstGraphData')
// }

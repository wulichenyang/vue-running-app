import {
  get,
} from "./http"

export const getUser = async () => {
  // return get('/user')
  return new Promise((r, f) => {
    setTimeout(()=>{
      r ({
        code:0,
        message: 'OK',
        data: {
          user: {
            name: 'lichenyang'
          }
        }
      })
    }, 500)
  })
}

// export const getSunburstGraphData = async () => {
//   return get('/trip/sunburstGraphData')
// }

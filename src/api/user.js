import {
  get,
  post
} from "./http"

export const getUser = async () => {
  return get('/user')
}

export const signup = async (logName, password) => {
  return post('/signup', {
    logName,
    password
  })
}

export const login = async (logName, password) => {
  return post('/login', {
    logName,
    password
  })
}

// export const getSunburstGraphData = async () => {
//   return get('/trip/sunburstGraphData')
// }

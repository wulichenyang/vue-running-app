import {
  get,
  post,
  put
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

export const updateUser = async (key, value) => {
  return put('/user/update', {
    key,
    value
  })
}

export const changeAvatar = async (avatar) => {
  return put('/user/avatar', avatar)
}

export const checkPrevPassword = async (password) => {
  return put('/user/checkPrevPassword', {password})
}

// export const getSunburstGraphData = async () => {
//   return get('/trip/sunburstGraphData')
// }

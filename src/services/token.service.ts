export const JWT_TOKEN_NAME = 'jwt'

const getToken = () :string => {
  return localStorage.getItem(JWT_TOKEN_NAME) || ''
}

const setToken = (token:string):void => {
  localStorage.setItem(JWT_TOKEN_NAME, token)
}

const deleteToken = ():void => {
  localStorage.removeItem(JWT_TOKEN_NAME)
}

const hasToken = ():boolean => {
  return getToken() !== ''
}

export {
  getToken,
  setToken,
  hasToken,
  deleteToken
}

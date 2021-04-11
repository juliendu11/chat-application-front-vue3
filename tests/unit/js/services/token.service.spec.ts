import { getToken, setToken, deleteToken, hasToken, JWT_TOKEN_NAME } from '@/services/token.service'

describe('Unit tests for services/token.service', () => {
  describe('for getToken', () => {
    it('Should return empty string because no token in localStorage', () => {
      const value = getToken()

      expect(value).toBe('')
    })

    it('Should return "test" string because token in localStorage', () => {
      window.localStorage.setItem(JWT_TOKEN_NAME, 'test')
      const value = getToken()

      expect(value).toBe('test')
    })
  })

  describe('for setToken', () => {
    it('Should set "test" in localStorage', () => {
      setToken('test')

      const value = window.localStorage.getItem(JWT_TOKEN_NAME)

      expect(value).toBe('test')
    })
  })

  describe('for deleteToken', () => {
    it('Should delete token with localStorage', () => {
      window.localStorage.setItem(JWT_TOKEN_NAME, 'test')

      expect(window.localStorage.getItem(JWT_TOKEN_NAME)).toBe('test')

      deleteToken()

      expect(window.localStorage.getItem(JWT_TOKEN_NAME)).toBeNull()
    })
  })

  describe('for hasToken', () => {
    it('Should return false because no token registered in localStorage', () => {
      const value = hasToken()

      expect(value).toBe(false)
    })

    it('Should return true because token registered in localStorage', () => {
      window.localStorage.setItem(JWT_TOKEN_NAME, 'test')
      const value = hasToken()

      expect(value).toBe(true)
    })
  })
})

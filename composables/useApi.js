export const useApi = () => {
  const config = useRuntimeConfig()
  
  const baseUrl = config.public.apiUrl
  const token = config.public.apiToken

  const get = async (endpoint) => {
    const url = `${baseUrl}${endpoint}`
		
    try {
      const response = await $fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response
    } catch (error) {
      console.error('❌ API Error:', error)
      throw error
    }
  }

  return {
    get
  }
}
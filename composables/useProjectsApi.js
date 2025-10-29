export const useProjectsApi = () => {
  const { get } = useApi()

  const fetchAllProjects = async () => {
    try {
      const response = await get('/api/proekties?populate=*')
      return response.data || []
    } catch (error) {
      throw new Error('Не удалось загрузить проекты')
    }
  }

  const fetchProjectById = async (documentId) => {
    try {
      const response = await get(`/api/proekties/${documentId}?populate=*`)
      return response.data || null
    } catch (error) {
      throw new Error('Не удалось загрузить проект')
    }
  }

  return {
    fetchAllProjects,
    fetchProjectById,
  }
}


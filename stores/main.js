export const useMainStore = defineStore('main', () => {
  const { get } = useApi()
  
  const mainData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchMainData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await get('/api/glavnaya?populate=deep,3')
      mainData.value = response
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const getHeroBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.glavnyj-blok-s-renderom'
    )
  })

  const getCalmNatureBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.cpokojstvie-svezhest-priroda'
    )
  })

  const getLocationsBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.lokaczii-ryadom'
    )
  })

  const getNatureLivingBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.zhit-sredi-prirody'
    )
  })

  const getGenplanBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.genplan'
    )
  })

  const getStyleLivingBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.zhit-v-stile'
    )
  })

  const getFirstStepsBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.zhit-s-pervyh-shagov'
    )
  })

  const getMapBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.karta-s-pinami-infrastruktury'
    )
  })

  const getLayoutsBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.tipovye-planirovki'
    )
  })

  const getFeaturesBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.osobennosti'
    )
  })

  const getConstructionBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.hod-stroitelstva'
    )
  })

  const getNewsBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.novosti'
    )
  })

  const getProjectsBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.drugie-proekty'
    )
  })

  const getEnvironmentBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.preimushhestva-zhizni' || 
             block.__component === 'blocks.environment' ||
             block.__component === 'blocks.privatnyj-format' ||
             block.__component === 'blocks.cpokojstvie-svezhest-priroda'
    );
  })

  const getVideoReviewsBlock = computed(() => {
    return mainData.value?.data?.blocks?.find(
      block => block.__component === 'blocks.video-obzory'
    )
  })

  return {
    mainData,
    loading,
    error,
    fetchMainData,
    getHeroBlock,
    getCalmNatureBlock,
    getLocationsBlock,
    getNatureLivingBlock,
    getGenplanBlock,
    getStyleLivingBlock,
    getFirstStepsBlock,
    getMapBlock,
    getLayoutsBlock,
    getFeaturesBlock,
    getVideoReviewsBlock,
    getConstructionBlock,
    getNewsBlock,
    getProjectsBlock,
    getEnvironmentBlock,
  }
})
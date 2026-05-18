const FOTO_BLOCK_COMPONENT = 'element-news.foto-ili-video'

export const getNewsPreviewMedia = (news) => {
  if (!news?.blocks || !Array.isArray(news.blocks)) {
    return null
  }

  const photoBlock = news.blocks.find(
    block => block.__component === FOTO_BLOCK_COMPONENT && block.value?.url
  )

  return photoBlock?.value || null
}

export const useNewsPreview = () => {
  const { getImageFormat } = useMedia()

  const getPreviewImageUrl = (news) => {
    const media = getNewsPreviewMedia(news)
    if (!media) return ''
    return getImageFormat(media, 'medium')
  }

  return {
    getNewsPreviewMedia,
    getPreviewImageUrl,
  }
}

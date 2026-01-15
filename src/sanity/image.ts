import imageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from './client'

const imageBuilder = imageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlFor = (source: any) => {
  if (!source) {
    // Return a dummy object to prevent crashes if image is missing
    return {
      width: () => ({ height: () => ({ url: () => '' }) }),
      height: () => ({ url: () => '' }),
      url: () => '',
    } as any
  }
  return imageBuilder.image(source)
}

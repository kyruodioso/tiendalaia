import imageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from './client'

const imageBuilder = imageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlFor = (source: any) => {
  return imageBuilder.image(source)
}

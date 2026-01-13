import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './client'

export const serverClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

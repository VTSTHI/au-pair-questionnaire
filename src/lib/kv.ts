import { kv } from '@vercel/kv'

export interface CloudQuestionnaireData {
  id: string
  uniqueToken: string
  createdAt: string
  updatedAt: string
  firstName?: string
  lastName?: string
  age?: number
  country?: string
  nationality?: string
  // All other questionnaire fields
  [key: string]: any
}

export interface CloudQuestionnaireOverview {
  id: string
  uniqueToken: string
  firstName?: string
  lastName?: string
  age?: number
  country?: string
  nationality?: string
  createdAt: string
  updatedAt: string
}

// Save questionnaire data to cloud
export async function saveQuestionnaireToCloud(data: CloudQuestionnaireData): Promise<boolean> {
  try {
    await kv.hset(`questionnaire:${data.uniqueToken}`, data)
    
    // Also save to overview list
    const overview: CloudQuestionnaireOverview = {
      id: data.id,
      uniqueToken: data.uniqueToken,
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      country: data.country,
      nationality: data.nationality,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
    
    await kv.hset(`overview:${data.uniqueToken}`, overview)
    await kv.sadd('questionnaire:tokens', data.uniqueToken)
    
    return true
  } catch (error) {
    console.error('Failed to save to cloud:', error)
    return false
  }
}

// Get questionnaire data from cloud
export async function getQuestionnaireFromCloud(token: string): Promise<CloudQuestionnaireData | null> {
  try {
    const data = await kv.hgetall(`questionnaire:${token}`)
    return data as CloudQuestionnaireData | null
  } catch (error) {
    console.error('Failed to get from cloud:', error)
    return null
  }
}

// Get all questionnaires overview from cloud
export async function getQuestionnairesOverviewFromCloud(): Promise<CloudQuestionnaireOverview[]> {
  try {
    const tokens = await kv.smembers('questionnaire:tokens') as string[]
    if (!tokens || tokens.length === 0) return []
    
    const overviews: CloudQuestionnaireOverview[] = []
    
    for (const token of tokens) {
      const overview = await kv.hgetall(`overview:${token}`)
      if (overview) {
        overviews.push(overview as CloudQuestionnaireOverview)
      }
    }
    
    // Sort by updatedAt descending
    return overviews.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  } catch (error) {
    console.error('Failed to get overviews from cloud:', error)
    return []
  }
}

// Create new questionnaire entry in cloud
export async function createQuestionnaireInCloud(token: string): Promise<boolean> {
  try {
    const newData: CloudQuestionnaireData = {
      id: token,
      uniqueToken: token,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.hset(`questionnaire:${token}`, newData)
    
    const overview: CloudQuestionnaireOverview = {
      id: token,
      uniqueToken: token,
      createdAt: newData.createdAt,
      updatedAt: newData.updatedAt
    }
    
    await kv.hset(`overview:${token}`, overview)
    await kv.sadd('questionnaire:tokens', token)
    
    return true
  } catch (error) {
    console.error('Failed to create in cloud:', error)
    return false
  }
}
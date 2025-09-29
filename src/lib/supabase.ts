import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if both URL and key are available
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export interface CloudQuestionnaireData {
  id: string
  unique_token: string
  created_at: string
  updated_at: string
  first_name?: string
  last_name?: string
  age?: number
  country?: string
  nationality?: string
  data: any // JSON field for all questionnaire data
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
export async function saveQuestionnaireToCloud(token: string, data: any): Promise<boolean> {
  if (!supabase) {
    console.log('⚠️ Supabase not configured, skipping cloud save')
    return false
  }
  
  try {
    const questionnaireData = {
      id: token,
      unique_token: token,
      first_name: data.firstName || null,
      last_name: data.lastName || null,
      age: data.age || null,
      country: data.country || null,
      nationality: data.nationality || null,
      data: data,
      updated_at: new Date().toISOString()
    }
    
    const { error } = await supabase
      .from('questionnaires')
      .upsert(questionnaireData, { onConflict: 'unique_token' })
    
    if (error) {
      console.error('Supabase save error:', error)
      return false
    }
    
    console.log('✅ Saved to Supabase cloud')
    return true
  } catch (error) {
    console.error('Failed to save to cloud:', error)
    return false
  }
}

// Get questionnaire data from cloud
export async function getQuestionnaireFromCloud(token: string): Promise<any | null> {
  if (!supabase) {
    console.log('⚠️ Supabase not configured, skipping cloud fetch')
    return null
  }
  
  try {
    const { data, error } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('unique_token', token)
      .single()
    
    if (error || !data) {
      return null
    }
    
    return data.data // Return the JSON data field
  } catch (error) {
    console.error('Failed to get from cloud:', error)
    return null
  }
}

// Get all questionnaires overview from cloud
export async function getQuestionnairesOverviewFromCloud(): Promise<CloudQuestionnaireOverview[]> {
  if (!supabase) {
    console.log('⚠️ Supabase not configured, skipping cloud overview')
    return []
  }
  
  try {
    console.log('🔍 Fetching questionnaires overview from Supabase...')
    
    // Use a simple query without debugging complexity
    const { data, error } = await supabase
      .from('questionnaires')
      .select('id, unique_token, first_name, last_name, age, country, nationality, created_at, updated_at')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Supabase overview error:', error)
      return []
    }
    
    if (!data) {
      console.log('⚠️ No data returned from Supabase')
      return []
    }
    
    console.log('✅ Retrieved', data.length, 'questionnaires from Supabase')
    
    // Check for duplicates based on unique_token
    const uniqueTokens = new Set()
    const filteredData = data.filter(item => {
      if (uniqueTokens.has(item.unique_token)) {
        console.log('⚠️ Duplicate found, skipping:', item.unique_token)
        return false
      }
      uniqueTokens.add(item.unique_token)
      return true
    })
    
    if (filteredData.length !== data.length) {
      console.log('🧹 Filtered out', data.length - filteredData.length, 'duplicates')
    }
    
    return filteredData.map(item => ({
      id: item.id,
      uniqueToken: item.unique_token,
      firstName: item.first_name,
      lastName: item.last_name,
      age: item.age,
      country: item.country,
      nationality: item.nationality,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))
  } catch (error) {
    console.error('❌ Failed to get overviews from cloud:', error)
    return []
  }
}

// Create new questionnaire entry in cloud
export async function createQuestionnaireInCloud(token: string): Promise<boolean> {
  if (!supabase) {
    console.log('⚠️ Supabase not configured, skipping cloud create')
    return false
  }
  
  try {
    const { data, error } = await supabase
      .from('questionnaires')
      .insert({
        id: token,
        unique_token: token,
        data: {
          uniqueToken: token,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (error) {
      console.error('Supabase create error:', error)
      return false
    }
    
    console.log('✅ Created questionnaire in Supabase:', data)
    
    // Immediate read-back test
    const readBack = await supabase
      .from('questionnaires')
      .select('id')
      .eq('unique_token', token)
      .single()
    
    console.log('Immediate read-back test:', readBack.data ? '✅ Found' : '❌ Not found')
    
    return true
  } catch (error) {
    console.error('Failed to create in cloud:', error)
    return false
  }
}
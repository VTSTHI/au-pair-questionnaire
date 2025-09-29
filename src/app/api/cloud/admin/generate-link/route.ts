import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { createQuestionnaireInCloud } from '@/lib/supabase'

// Add GET for browser testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST request to generate invitation links',
    method: 'GET not supported'
  })
}

export async function POST() {
  try {
    console.log('🔄 Starting invitation link generation...')
    const token = uuidv4()
    console.log('Generated token:', token)
    
    // Add timeout to prevent hanging
    const createWithTimeout = Promise.race([
      createQuestionnaireInCloud(token),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase timeout')), 10000)
      )
    ])
    
    console.log('Attempting to create questionnaire in cloud...')
    const success = await createWithTimeout
    console.log('Create result:', success)
    
    if (!success) {
      console.log('❌ Failed to create questionnaire in cloud')
      return NextResponse.json(
        { error: 'Failed to create questionnaire in cloud database' },
        { status: 500 }
      )
    }
    
    // Get the current URL from the request or environment
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://au-pair-questionnaire.vercel.app'
    
    const invitationLink = `${baseUrl}/questionnaire/${token}`
    
    console.log('✅ Successfully generated invitation link:', invitationLink)
    
    return NextResponse.json({ 
      token,
      invitationLink,
      success: true
    })
  } catch (error) {
    console.error('❌ Error generating invitation link in cloud:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate invitation link',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}
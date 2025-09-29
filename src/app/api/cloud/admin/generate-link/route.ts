import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { createQuestionnaireInCloud } from '@/lib/supabase'

export async function POST() {
  try {
    const token = uuidv4()
    
    const success = await createQuestionnaireInCloud(token)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create questionnaire' },
        { status: 500 }
      )
    }
    
    // Get the current URL from the request or environment
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                   'http://localhost:3000'
    
    const invitationLink = `${baseUrl}/questionnaire/${token}`
    
    return NextResponse.json({ 
      token,
      invitationLink,
      success: true
    })
  } catch (error) {
    console.error('Error generating invitation link in cloud:', error)
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
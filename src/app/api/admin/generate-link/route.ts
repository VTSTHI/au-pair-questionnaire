import { NextResponse } from 'next/server'
import { createUniqueInvitationLink } from '@/lib/token'
import { initializeDatabase } from '@/lib/init-db'

export async function POST() {
  try {
    // Initialize database first (for serverless environments)
    await initializeDatabase()
    
    const token = await createUniqueInvitationLink()
    
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
    console.error('Error generating invitation link:', error)
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
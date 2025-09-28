import { NextResponse } from 'next/server'
import { createUniqueInvitationLink } from '@/lib/token'

export async function POST() {
  try {
    const token = await createUniqueInvitationLink()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const invitationLink = `${baseUrl}/questionnaire/${token}`
    
    return NextResponse.json({ 
      token,
      invitationLink 
    })
  } catch (error) {
    console.error('Error generating invitation link:', error)
    return NextResponse.json(
      { error: 'Failed to generate invitation link' },
      { status: 500 }
    )
  }
}
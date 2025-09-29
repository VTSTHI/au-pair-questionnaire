import { NextResponse } from 'next/server'
import { getQuestionnairesOverviewFromCloud } from '@/lib/supabase'

export async function GET() {
  try {
    const questionnaires = await getQuestionnairesOverviewFromCloud()
    
    const response = NextResponse.json(questionnaires)
    
    // Prevent caching to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error fetching questionnaires overview from cloud:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questionnaires overview' },
      { status: 500 }
    )
  }
}
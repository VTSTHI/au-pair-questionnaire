import { NextResponse } from 'next/server'
import { getQuestionnairesOverviewFromCloud } from '@/lib/supabase'

export async function GET() {
  try {
    const questionnaires = await getQuestionnairesOverviewFromCloud()
    return NextResponse.json(questionnaires)
  } catch (error) {
    console.error('Error fetching questionnaires overview from cloud:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questionnaires overview' },
      { status: 500 }
    )
  }
}
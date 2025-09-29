import { NextRequest, NextResponse } from 'next/server'
import { getQuestionnaireFromCloud, saveQuestionnaireToCloud } from '@/lib/kv'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const data = await getQuestionnaireFromCloud(params.token)
    
    if (!data) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching questionnaire from cloud:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const data = await request.json()
    
    const questionnaireData = {
      ...data,
      id: data.id || params.token,
      uniqueToken: params.token,
      updatedAt: new Date().toISOString()
    }
    
    const success = await saveQuestionnaireToCloud(questionnaireData)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save questionnaire' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: questionnaireData })
  } catch (error) {
    console.error('Error saving questionnaire to cloud:', error)
    return NextResponse.json(
      { error: 'Failed to save questionnaire' },
      { status: 500 }
    )
  }
}
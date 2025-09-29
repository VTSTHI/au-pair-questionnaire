import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  // This endpoint is deprecated - questionnaire now uses localStorage
  return NextResponse.json({
    message: 'This endpoint is deprecated. Questionnaire now uses browser localStorage.',
    uniqueToken: params.token
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  // This endpoint is deprecated - questionnaire now uses localStorage
  return NextResponse.json({
    message: 'This endpoint is deprecated. Questionnaire now uses browser localStorage.',
    success: true
  })
}
import { NextResponse } from 'next/server'

export async function GET() {
  // This endpoint is deprecated - admin dashboard now uses localStorage
  return NextResponse.json({
    message: 'This endpoint is deprecated. Admin dashboard now uses browser localStorage.',
    questionnaires: []
  })
}
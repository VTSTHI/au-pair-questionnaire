import { NextResponse } from 'next/server'

export async function POST() {
  // This endpoint is deprecated - admin dashboard now uses client-side UUID generation
  return NextResponse.json({
    message: 'This endpoint is deprecated. Admin dashboard now uses client-side UUID generation.',
    success: false
  })
}
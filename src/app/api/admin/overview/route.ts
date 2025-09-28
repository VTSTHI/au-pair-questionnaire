import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const questionnaires = await prisma.auPairQuestionnaire.findMany({
      where: {
        OR: [
          { firstName: { not: null } },
          { lastName: { not: null } }
        ]
      },
      select: {
        id: true,
        uniqueToken: true,
        firstName: true,
        lastName: true,
        age: true,
        country: true,
        nationality: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(questionnaires)
  } catch (error) {
    console.error('Error fetching questionnaires overview:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
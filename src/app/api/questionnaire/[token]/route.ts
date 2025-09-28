import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const questionnaire = await prisma.auPairQuestionnaire.findUnique({
      where: { uniqueToken: params.token }
    })

    if (!questionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(questionnaire)
  } catch (error) {
    console.error('Error fetching questionnaire:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
    
    // Get the current questionnaire to track changes
    const currentQuestionnaire = await prisma.auPairQuestionnaire.findUnique({
      where: { uniqueToken: params.token }
    })

    if (!currentQuestionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      )
    }

    // Track changes for audit log
    const auditEntries: Array<{
      questionnaireId: string;
      fieldName: string;
      oldValue: string | null;
      newValue: string | null;
    }> = []
    
    for (const [field, newValue] of Object.entries(data)) {
      if (field !== 'uniqueToken' && field !== 'id' && field !== 'createdAt' && field !== 'updatedAt') {
        const oldValue = (currentQuestionnaire as any)[field]
        if (oldValue !== newValue) {
          auditEntries.push({
            questionnaireId: currentQuestionnaire.id,
            fieldName: field,
            oldValue: oldValue ? String(oldValue) : null,
            newValue: newValue ? String(newValue) : null
          })
        }
      }
    }

    // Update questionnaire and create audit logs in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedQuestionnaire = await tx.auPairQuestionnaire.update({
        where: { uniqueToken: params.token },
        data
      })

      if (auditEntries.length > 0) {
        await tx.auditLog.createMany({
          data: auditEntries
        })
      }

      return updatedQuestionnaire
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating questionnaire:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
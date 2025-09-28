import { v4 as uuidv4 } from 'uuid'
import { prisma } from './prisma'

export function generateUniqueToken(): string {
  return uuidv4()
}

export async function createUniqueInvitationLink(): Promise<string> {
  let token: string
  let exists = true
  
  // Generate a unique token that doesn't exist in the database
  while (exists) {
    token = generateUniqueToken()
    const existingQuestionnaire = await prisma.auPairQuestionnaire.findUnique({
      where: { uniqueToken: token }
    })
    exists = !!existingQuestionnaire
  }
  
  // Create a new questionnaire record with the unique token
  await prisma.auPairQuestionnaire.create({
    data: {
      uniqueToken: token!
    }
  })
  
  return token!
}

export async function validateToken(token: string): Promise<boolean> {
  const questionnaire = await prisma.auPairQuestionnaire.findUnique({
    where: { uniqueToken: token }
  })
  return !!questionnaire
}
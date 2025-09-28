import { prisma } from './prisma'

export async function initializeDatabase() {
  try {
    // Try to connect and create tables if they don't exist
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AuPairQuestionnaire" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "uniqueToken" TEXT NOT NULL UNIQUE,
        "firstName" TEXT,
        "lastName" TEXT,
        "gender" TEXT,
        "nationality" TEXT,
        "placeOfBirth" TEXT,
        "dateOfBirth" DATETIME,
        "age" INTEGER,
        "city" TEXT,
        "country" TEXT,
        "height" TEXT,
        "weight" TEXT,
        "fatherName" TEXT,
        "fatherJob" TEXT,
        "motherName" TEXT,
        "motherJob" TEXT,
        "numberOfSiblings" INTEGER,
        "siblingDetails" TEXT,
        "livingSituation" TEXT,
        "parentalSupport" TEXT,
        "familyFriendsInGermany" TEXT,
        "travelExperience" TEXT,
        "maritalStatus" TEXT,
        "hasChildren" BOOLEAN,
        "allergies" TEXT,
        "smokingStatus" TEXT,
        "medicalConditions" TEXT,
        "religion" TEXT,
        "religiousImportance" TEXT,
        "meatConsumption" TEXT,
        "fishConsumption" TEXT,
        "alcoholConsumption" TEXT,
        "dietaryRestrictions" TEXT,
        "schoolHistory" TEXT,
        "universityDetails" TEXT,
        "currentEmployment" TEXT,
        "selfDescription" TEXT,
        "organizationalSkills" TEXT,
        "punctuality" TEXT,
        "communicationStyle" TEXT,
        "socialPreferences" TEXT,
        "creativity" TEXT,
        "patience" TEXT,
        "germanProficiency" TEXT,
        "englishProficiency" TEXT,
        "otherLanguages" TEXT,
        "sports" TEXT,
        "instruments" TEXT,
        "recreationalActivities" TEXT,
        "driversLicense" BOOLEAN,
        "vehicleExperience" TEXT,
        "petComfort" TEXT,
        "petOwnership" TEXT,
        "petCareWillingness" TEXT,
        "ageGroupExperience" TEXT,
        "childcareSkills" TEXT,
        "handicappedChildrenExperience" TEXT,
        "cookingAbilities" TEXT,
        "cleaningSkills" TEXT,
        "laundryManagement" TEXT,
        "gardening" TEXT,
        "groceryShopping" TEXT,
        "singleParentWillingness" TEXT,
        "cityVillagePreference" TEXT,
        "familyInteraction" TEXT,
        "embassyAppointment" DATETIME,
        "earliestStartDate" DATETIME,
        "plannedDuration" TEXT,
        "tripFunding" TEXT,
        "motivationalLetter" TEXT,
        "photos" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AuditLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "questionnaireId" TEXT NOT NULL,
        "fieldName" TEXT NOT NULL,
        "oldValue" TEXT,
        "newValue" TEXT,
        "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("questionnaireId") REFERENCES "AuPairQuestionnaire" ("id") ON DELETE CASCADE
      )
    `

    console.log('✅ Database initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return false
  }
}
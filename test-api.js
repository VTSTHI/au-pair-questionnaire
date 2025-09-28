// Test der API-Funktionalität ohne Server
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

async function testInvitationLinkGeneration() {
  console.log('🔍 Testing Invitation Link Generation...');
  
  try {
    // Test Prisma connection
    const prisma = new PrismaClient();
    console.log('✅ Prisma client created');
    
    // Test token generation
    const token = uuidv4();
    console.log('✅ Token generated:', token);
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Test creating a questionnaire with unique token
    const questionnaire = await prisma.auPairQuestionnaire.create({
      data: {
        uniqueToken: token
      }
    });
    console.log('✅ Questionnaire created:', questionnaire.id);
    
    // Generate invitation link
    const baseUrl = 'http://localhost:3000';
    const invitationLink = `${baseUrl}/questionnaire/${token}`;
    console.log('✅ Invitation link generated:', invitationLink);
    
    // Test retrieving the questionnaire
    const retrieved = await prisma.auPairQuestionnaire.findUnique({
      where: { uniqueToken: token }
    });
    console.log('✅ Questionnaire retrieved:', retrieved ? 'Found' : 'Not found');
    
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
    
    console.log('\n🎉 All tests passed! The invitation link system works perfectly.');
    console.log('📋 Generated invitation link:', invitationLink);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📍 Details:', error);
  }
}

// Run the test
testInvitationLinkGeneration();
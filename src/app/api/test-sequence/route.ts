import { NextResponse } from 'next/server'
import { createQuestionnaireInCloud, getQuestionnairesOverviewFromCloud } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST() {
  try {
    const testToken = uuidv4()
    
    console.log('🔍 Starting sequence test...')
    
    // Step 1: Count before
    const beforeOverview = await getQuestionnairesOverviewFromCloud()
    const beforeCount = beforeOverview.length
    console.log('📊 Before creation:', beforeCount, 'questionnaires')
    
    // Step 2: Create new questionnaire
    console.log('➕ Creating questionnaire with token:', testToken)
    const created = await createQuestionnaireInCloud(testToken)
    console.log('✅ Creation result:', created)
    
    if (!created) {
      return NextResponse.json({
        error: 'Failed to create questionnaire',
        beforeCount,
        created: false
      })
    }
    
    // Step 3: Count immediately after (might be eventual consistency issue)
    const afterOverview1 = await getQuestionnairesOverviewFromCloud()
    const afterCount1 = afterOverview1.length
    console.log('📊 Immediately after creation:', afterCount1, 'questionnaires')
    
    // Step 4: Wait 3 seconds and count again
    await new Promise(resolve => setTimeout(resolve, 3000))
    const afterOverview2 = await getQuestionnairesOverviewFromCloud()
    const afterCount2 = afterOverview2.length
    console.log('📊 After 3 second delay:', afterCount2, 'questionnaires')
    
    return NextResponse.json({
      testToken,
      beforeCount,
      afterCount1, // immediate
      afterCount2, // delayed
      created,
      expectedIncrease: 1,
      actualIncrease1: afterCount1 - beforeCount,
      actualIncrease2: afterCount2 - beforeCount,
      eventualConsistencyIssue: afterCount1 !== afterCount2,
      success: afterCount2 > beforeCount
    })
  } catch (error) {
    console.error('Test sequence failed:', error)
    return NextResponse.json({
      error: 'Test sequence failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
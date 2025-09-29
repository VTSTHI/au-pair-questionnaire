import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getQuestionnairesOverviewFromCloud } from '@/lib/supabase'

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' })
  }

  try {
    const timestamp = new Date().toISOString()
    
    // Test 1: Raw count
    const countResult = await supabase
      .from('questionnaires')
      .select('id', { count: 'exact', head: true })

    // Test 2: Raw select all
    const allResult = await supabase
      .from('questionnaires')
      .select('*')
      .order('created_at', { ascending: false })

    // Test 3: Same query as overview API
    const overviewResult = await supabase
      .from('questionnaires')
      .select('id, unique_token, first_name, last_name, age, country, nationality, created_at, updated_at')
      .order('created_at', { ascending: false })

    // Test 4: Use our library function
    const libResult = await getQuestionnairesOverviewFromCloud()

    // Test 5: Check for null/undefined fields
    const nullCheckResult = await supabase
      .from('questionnaires')
      .select('id, unique_token')
      .or('id.is.null,unique_token.is.null')

    return NextResponse.json({
      timestamp,
      diagnostics: {
        rawCount: countResult.count,
        rawCountError: countResult.error?.message,
        
        allSelectCount: allResult.data?.length || 0,
        allSelectError: allResult.error?.message,
        allSelectSample: allResult.data?.slice(0, 3),
        
        overviewSelectCount: overviewResult.data?.length || 0, 
        overviewSelectError: overviewResult.error?.message,
        overviewSelectSample: overviewResult.data?.slice(0, 3),
        
        libFunctionCount: libResult.length,
        libFunctionSample: libResult.slice(0, 3),
        
        nullRecordsCount: nullCheckResult.data?.length || 0,
        nullRecords: nullCheckResult.data,
        
        discrepancy: {
          countVsAll: countResult.count !== (allResult.data?.length || 0),
          countVsOverview: countResult.count !== (overviewResult.data?.length || 0),
          countVsLib: countResult.count !== libResult.length
        }
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to run diagnostic',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
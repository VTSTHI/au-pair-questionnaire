import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' })
  }

  try {
    // Get total count
    const countResult = await supabase
      .from('questionnaires')
      .select('id', { count: 'exact', head: true })

    // Get all records with minimal fields
    const selectResult = await supabase
      .from('questionnaires')
      .select('id, unique_token, created_at')
      .order('created_at', { ascending: false })

    // Get all IDs only to compare
    const idsOnlyResult = await supabase
      .from('questionnaires')
      .select('id')

    return NextResponse.json({
      totalCount: countResult.count,
      selectCount: selectResult.data?.length || 0,
      idsCount: idsOnlyResult.data?.length || 0,
      countError: countResult.error,
      selectError: selectResult.error,
      idsError: idsOnlyResult.error,
      selectData: selectResult.data,
      idsData: idsOnlyResult.data
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to run diagnostic',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
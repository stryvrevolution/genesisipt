import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const { submissionId } = params;

    const { data: submission, error } = await supabase
      .from('ipt_submissions')
      .select('*, ipt_scores(*)')
      .eq('id', submissionId)
      .single();

    if (error) throw error;

    return NextResponse.json({
      submission,
      score: submission.ipt_scores?.[0] || null,
    });
  } catch (error) {
    console.error('Get score error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve score' },
      { status: 500 }
    );
  }
}
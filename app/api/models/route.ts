import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models');
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 
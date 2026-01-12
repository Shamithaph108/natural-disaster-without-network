// API Route for Messages (works offline with LocalStorage)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Messages are stored in LocalStorage on the client side',
    note: 'This API route is for demonstration. Actual data is stored in browser LocalStorage.',
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Message would be saved to LocalStorage',
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

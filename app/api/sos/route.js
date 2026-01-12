// API Route for SOS Messages (works offline with LocalStorage)
import { NextResponse } from 'next/server';

export async function GET() {
  // In a real offline app, this would read from LocalStorage
  // But API routes run server-side, so we return instructions
  return NextResponse.json({
    message: 'SOS messages are stored in LocalStorage on the client side',
    note: 'This API route is for demonstration. Actual data is stored in browser LocalStorage.',
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    // In a real implementation, this would be handled client-side
    return NextResponse.json({
      success: true,
      message: 'SOS message would be saved to LocalStorage',
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

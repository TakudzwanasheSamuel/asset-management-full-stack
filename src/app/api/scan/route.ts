import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId } = body;
    if (!cardId) {
      return NextResponse.json({ message: 'Card ID is required' }, { status: 400 });
    }
    const isClockingIn = Math.random() > 0.5;
    const mockUser = {
        name: 'Jane Doe',
        position: 'Graphic Designer',
        imageUrl: 'https://placehold.co/128x128.png'
    };
    return NextResponse.json({ 
        message: `Successfully clocked ${isClockingIn ? 'in' : 'out'}`, 
        scanType: isClockingIn ? 'in' : 'out',
        user: mockUser
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

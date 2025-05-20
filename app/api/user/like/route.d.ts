import { NextRequest, NextResponse } from 'next/server'

declare function POST(req: NextRequest): Promise<NextResponse<{ message: string } | { error: string }>>
declare function DELETE(req: NextRequest): Promise<NextResponse<{ message: string } | { error: string }>>

export { POST, DELETE }

import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {

    const filePath = path.join(process.cwd(), 'content/legal/cookies.md');
    const fileContent = readFileSync(filePath, 'utf8');

    return NextResponse.json({
        status: 'OK',
        content: fileContent,
        code: 200
    })
}
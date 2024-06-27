import Pocketbase from "pocketbase";
const pocketbase = new Pocketbase('https://swotters.pockethost.io');
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Extract the URL parameter from the request
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/');
        const uid = pathSegments[pathSegments.length - 1];

        if (!uid) {
            return NextResponse.json({ error: 'UID Not provided' }, { status: 400 });
        }

        const certificate = await pocketbase.collection("certificates").getFirstListItem(
            `uid="${uid}"`, {
                expand: 'relfield1,relfield2.subRelField',
            }
        );

        return NextResponse.json({ certificate });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
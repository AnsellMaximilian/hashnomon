import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "../[...nextauth]/route";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  const session = await getServerSession(OPTIONS);

  if (!session) {
    return NextResponse.json({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }

  const token = await getToken({ req, secret, raw: true });

  return NextResponse.json({ token });
}

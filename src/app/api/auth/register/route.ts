import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/domain/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse("Email already in use", { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import connectDB from '@/lib/dbConnect';
import Doctor from '@/models/Doctor';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();
    const doctors = await Doctor.find();
    return NextResponse.json(doctors);
}

export async function POST(req: Request) {
    await connectDB();
    const body = await req.json();
    const newDoctor = await Doctor.create(body);
    return NextResponse.json(newDoctor);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const body = await req.json();
    const updated = await Doctor.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
}

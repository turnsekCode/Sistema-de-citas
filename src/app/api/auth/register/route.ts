import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
  await dbConnect();
  
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { name, email, password } = await req.json();

    // Validar que los datos no estén vacíos
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Comprobar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 }); // 409 Conflict
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password before saving:', hashedPassword);

    // Crear un nuevo usuario
    const user = await User.create({ name, email, password: hashedPassword });

    // Responder con éxito
    return NextResponse.json({
      message: 'User registered successfully',
      user: { name: user.name, email: user.email } // Excluyendo la contraseña del response
    }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 }); // 500 Internal Server Error
  }
}

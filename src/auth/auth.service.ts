// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: any): Promise<{ access_token: string }> {
    // 1. Valida as credenciais usando o serviço que já criamos
    const usuario = await this.usuariosService.login(
      loginDto.email,
      loginDto.senha,
    );

    // 2. Cria o 'payload' do token com informações úteis
    const payload = {
      sub: usuario.id, // 'sub' é o padrão para o ID do sujeito (usuário)
      email: usuario.email,
      tipo: usuario.tipo,
    };

    // 3. Gera o token JWT e o retorna
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
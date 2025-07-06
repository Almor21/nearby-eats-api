import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtBlacklist } from 'src/database/entities/jwt-blacklist.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(JwtBlacklist)
    private readonly jwtBlacklistRepository: Repository<JwtBlacklist>,
  ) {}

  async generateToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      jti: uuidv4(),
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET', ''),
      expiresIn: this.configService.get('JWT_EXPIRATION', '1h'),
    });
  }

  async verifyTokenBlackList(jti: string) {
    const revokedToken = await this.jwtBlacklistRepository.findOne({
      where: { id: jti },
    });

    if (revokedToken) {
      throw new UnauthorizedException('No autorizado');
    }

    return revokedToken;
  }
}

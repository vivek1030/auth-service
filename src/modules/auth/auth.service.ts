import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EXCEPTION_MESSAGES } from 'src/shared/constants/exception-messages.constant';
import { RESPONSE_MESSAGES } from 'src/shared/constants/response-messages.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<ApiResponse> {
    const { username, email, password } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new CustomException(EXCEPTION_MESSAGES.USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    this.userRepository.save(user);

    const response: ApiResponse = {
      success: true,
      message: RESPONSE_MESSAGES.REGISTER_SUCCESS,
      data: {
        email: email,
      },
    };

    return response;
  }

  async login(loginDto: LoginDto): Promise<ApiResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new CustomException(EXCEPTION_MESSAGES.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const response: ApiResponse = {
      success: true,
      message: RESPONSE_MESSAGES.LOGIN_SUCCESS,
      data: {
        token: accessToken,
      },
    };

    return response;
  }
}

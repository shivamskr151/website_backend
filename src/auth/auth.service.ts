import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '@common/dtos/user.dto';
import { UserRole, Status } from '@common/enums';
import { JwtService as CustomJwtService } from '@common/jwt/jwt.service';
import { MailService } from '@common/mail/mail.service';
import { CryptoUtil } from '@common/utils/crypto.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly customJwtService: CustomJwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, firstName, lastName, phoneNumber } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = this.userRepository.create({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      emailVerificationToken: uuidv4(),
    });

    const savedUser = await this.userRepository.save(user);

    // Send welcome email
    await this.mailService.sendWelcomeEmail(email, firstName);

    // Send email verification
    await this.mailService.sendEmailVerification(email, user.emailVerificationToken);

    const { password: _, ...result } = savedUser;
    return result;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await CryptoUtil.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== Status.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const accessToken = this.customJwtService.generateAccessToken(payload);
    const refreshToken = this.customJwtService.generateRefreshToken(payload);

    const { password: _, ...result } = user;
    return {
      user: result,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const payload = this.customJwtService.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });

      if (!user || user.status !== Status.ACTIVE) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      };

      const newAccessToken = this.customJwtService.generateAccessToken(newPayload);
      const newRefreshToken = this.customJwtService.generateRefreshToken(newPayload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyEmail(token: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { emailVerificationToken: token } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid verification token');
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    await this.userRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await this.userRepository.save(user);

    await this.mailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const user = await this.userRepository.findOne({ 
      where: { passwordResetToken: token },
    });

    if (!user || user.passwordResetExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    const { password, ...result } = updatedUser;
    return result;
  }

  async validateUser(id: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user || user.status !== Status.ACTIVE) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  async validateUserByCredentials(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await CryptoUtil.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    if (user.status !== Status.ACTIVE) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }
}

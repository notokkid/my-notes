import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import { User } from './user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findByEmail(email: string): Promise<User> {
    return this.repo.findOneBy({ email });
  }

  findById(id: number): Promise<User> {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, attributes: Partial<User>) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    Object.assign(user, attributes);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.repo.remove(user);
  }

  async registerWithEmailAndPassword(email: string, password: string) {
    const foundUser = await this.findByEmail(email);
    if (foundUser) {
      throw new BadRequestException(
        'Registration failed! Email already in use!',
      );
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = `${salt}.${hash.toString('hex')}`;

    const user = await this.create(email, hashedPassword);
    return user;
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    const foundUser = await this.findByEmail(email);
    if (!foundUser) {
      throw new NotFoundException('User with that email does not exist!');
    }

    const [salt, storedHash] = foundUser.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorrect password!');
    }

    return foundUser;
  }
}

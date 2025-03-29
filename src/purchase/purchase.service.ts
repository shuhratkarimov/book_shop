import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseEntity } from './entities/purchase.entity';
import { BookEntity } from '../book/entities/book.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async buyBook(userId: number, bookId: number): Promise<PurchaseEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!user || !book) {
      throw new Error('User or Book not found');
    }
    const purchase = this.purchaseRepository.create({ user, book });
    return await this.purchaseRepository.save(purchase);
  }
}

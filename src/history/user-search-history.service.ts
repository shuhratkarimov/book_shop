import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSearchHistory } from './entities/user-search-history.entity';
import { BookEntity } from '../book/entities/book.entity';

@Injectable()
export class UserSearchHistoryService {
  constructor(
    @InjectRepository(UserSearchHistory)
    private readonly userSearchHistoryRepository: Repository<UserSearchHistory>,
  ) {}

  async saveSearch(userId: number, book: BookEntity): Promise<UserSearchHistory> {
    const searchHistory = this.userSearchHistoryRepository.create({
      userId,
      book,
      searchDate: new Date(),
    });
    return await this.userSearchHistoryRepository.save(searchHistory);
  }

  async findRecentSearches(userId: number, limit: number = 5): Promise<UserSearchHistory[]> {
    return await this.userSearchHistoryRepository.find({
      where: { userId },
      relations: ['book'],
      order: { searchDate: 'DESC' },
      take: limit,
    });
  }
}
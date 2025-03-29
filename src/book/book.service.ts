import { Injectable } from "@nestjs/common";
import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";
import { InjectRepository } from "@nestjs/typeorm";
import { BookEntity } from "./entities/book.entity";
import { In, Repository } from "typeorm";
import { FilterBookInput } from "./dto/filter-book.dto";
import { HttpService } from "@nestjs/axios";
import { UserSearchHistoryService } from "src/history/user-search-history.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    private readonly httpService: HttpService,
    private readonly userSearchHistoryService: UserSearchHistoryService,
  ) {}

  async findAllBooks(filters?: FilterBookInput, userId?: number): Promise<BookEntity[]> {
    try {
      // Agar filters yo'q bo'lsa, barcha kitoblarni qaytarish
      if (!filters) {
        const books = await this.bookRepository.find();
        // Qidiruvni saqlash
        if (userId && books.length > 0) {
          await this.userSearchHistoryService.saveSearch(userId, books[0]);
        }
        return books;
      }

      // Filters mavjud bo'lsa, avvalgi logikani qo'llash
      let query = this.bookRepository.createQueryBuilder('book');
      if (filters.title) {
        query.andWhere('LOWER(book.title) LIKE LOWER(:title)', {
          title: `%${filters.title}%`,
        });
      }
      if (filters.minPrice !== undefined) {
        query.andWhere('book.price >= :minPrice', { minPrice: filters.minPrice });
      }
      if (filters.maxPrice !== undefined) {
        query.andWhere('book.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }
      if (filters.genre) {
        query.andWhere('book.genre = :genre', { genre: filters.genre });
      }
      if (filters.excludeBookId) {
        query.andWhere('book.id != :id', { id: filters.excludeBookId });
      }
      if (filters.sortBy) {
        query.orderBy(`book.${filters.sortBy}`, filters.order === 'DESC' ? 'DESC' : 'ASC');
      }
      if (filters.limit) {
        query.limit(filters.limit);
      }

      const books = await query.getMany();

      // Qidiruvni saqlash
      if (userId && books.length > 0) {
        await this.userSearchHistoryService.saveSearch(userId, books[0]);
      }

      return books;
    } catch (error) {
      console.error('Error in findAllBooks:', error);
      throw new Error('Books could not be retrieved');
    }
  }

  async getRecommendations(bookId: number, topN: number = 5): Promise<BookEntity[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:5000/recommend', {
          book_id: bookId,
          top_n: topN,
        }),
      );

      const recommendedBooks = response.data;
      const bookIds = recommendedBooks.map((book: any) => book.id);

      return await this.bookRepository.find({
        where: { id: In(bookIds) },
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error('Could not fetch recommendations');
    }
  }

  async getUserRecommendations(userId: number, topN: number = 5): Promise<BookEntity[]> {
    try {
      const recentSearches = await this.userSearchHistoryService.findRecentSearches(userId);
      if (recentSearches.length === 0) {
        return [];
      }

      const lastSearchedBook = recentSearches[0].book;
      return await this.getRecommendations(lastSearchedBook.id, topN);
    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      throw new Error('Could not fetch user recommendations');
    }
  }

  async createBook(createBookInput: CreateBookInput) {
    try {
      const createdBook = this.bookRepository.create(createBookInput);
      return await this.bookRepository.save(createdBook);
    } catch (error) {
      console.log(error);
    }
  }

  async findOneBook(id: number) {
    try {
      return await this.bookRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
    }
  }

  async updateBook(id: number, updateBookInput: UpdateBookInput) {
    try {
      await this.bookRepository.update(id, updateBookInput);
      return await this.bookRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
    }
  }

  async removeBook(id: number) {
    try {
      const result = await this.bookRepository.delete(id);
      if (result.affected === 0) {
        throw new Error(`Book with id ${id} not found!`);
      }
      return "Book successfully deleted!";
    } catch (error) {
      console.log(error);
    }
  }
}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BookService } from './book.service';
import { BookEntity } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { FilterBookInput } from './dto/filter-book.dto';

@Resolver(() => BookEntity)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Mutation(() => BookEntity, {name: "createBook"})
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.bookService.createBook(createBookInput);
  }

  @Query(() => [BookEntity])
  async recommendations(
    @Args('bookId') bookId: number,
    @Args('topN', { nullable: true, defaultValue: 5 }) topN: number,
  ) {
    return this.bookService.getRecommendations(bookId, topN);
  }

  @Query(() => [BookEntity])
  async userRecommendations(
    @Args('userId') userId: number,
    @Args('topN', { nullable: true, defaultValue: 5 }) topN: number,
  ) {
    return this.bookService.getUserRecommendations(userId, topN);
  }

  @Query(() => [BookEntity], { name: 'findAllBooks' })
  findAllBooks(
    @Args('filters', { type: () => FilterBookInput, nullable: true }) filters?: FilterBookInput,
    @Args('userId', { type: () => Int, nullable: true }) userId?: number
  ) {
    return this.bookService.findAllBooks(filters, userId);
  }

  @Query(() => BookEntity, { name: 'findOneBook' })
  findOneBook(@Args('id', { type: () => Int }) id: number) {
    return this.bookService.findOneBook(id);
  }

  @Mutation(() => BookEntity, {name: "updateBook"})
  updateBook(@Args('id') id: number, @Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.bookService.updateBook(id, updateBookInput);
  }

  @Mutation(() => String, {name: "removeBook"})
  removeBook(@Args('id', { type: () => Int }) id: number) {
    return this.bookService.removeBook(id);
  }
}

import { DataSource } from 'typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { UserEntity } from '../users/entities/user.entity'; // ✅ UserEntity qo‘shildi
import * as fs from 'fs';
import * as path from 'path';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'shuhrat0049',
  database: 'graphql',
  entities: [BookEntity, PurchaseEntity, UserEntity], // ✅ Barcha entity'lar qo'shildi
  synchronize: true,
});

async function exportBooksToCSV() {
  await AppDataSource.initialize();
  const bookRepository = AppDataSource.getRepository(BookEntity);
  const books = await bookRepository.find({ relations: ['purchases', 'purchases.user'] }); // ✅ UserEntity bog‘liqligi ham qo‘shildi

  const csvRows = ['id,title,genre,price,rating,soldCopies'];
  books.forEach(book => {
    csvRows.push(`${book.id},${book.title},${book.genre},${book.price},${book.rating},${book.purchases?.length || 0}`);
  });

  const csvContent = csvRows.join('\n');
  const filePath = path.join(__dirname, '../../ml/books.csv');
  fs.writeFileSync(filePath, csvContent);

  console.log('Books exported to ml/books.csv');
  await AppDataSource.destroy();
}

exportBooksToCSV().catch(error => console.error('Error exporting books:', error));

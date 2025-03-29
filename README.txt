# Kitob Tavsiya Tizimi

Bu loyiha NestJS va Python (Flask) yordamida kitoblar bo‘yicha tavsiyalar beruvchi tizimdir. NestJS GraphQL API sifatida ishlaydi va ma’lumotlar bazasida kitoblar ma’lumotlarini saqlaydi. Python API esa TensorFlow yordamida kitoblar bo‘yicha tavsiyalar beradi va Flask orqali NestJS bilan integratsiya qilinadi.

## Loyiha haqida umumiy ma’lumot
- **NestJS qismi**: GraphQL API sifatida ishlaydi, kitoblarni qidirish, qo‘shish va tavsiyalar olish imkonini beradi. Ma’lumotlar bazasi sifatida PostgreSQL ishlatiladi.
- **Python qismi**: TensorFlow yordamida kitoblar bo‘yicha tavsiyalar beradi. `books.csv` faylidan ma’lumotlarni o‘qib, Flask API orqali `http://localhost:5000/recommend` manzilida so‘rovlar qabul qiladi.
- **Integratsiya**: NestJS Python API’ga so‘rov yuboradi va tavsiyalarni oladi.

## Kerakli dasturlar
Loyihani ishga tushirish uchun quyidagi dasturlar o‘rnatilgan bo‘lishi kerak:
- **Node.js** (versiya 18.x yoki undan yuqori) va **npm** (NestJS uchun).
- **Python 3.11** (Python API uchun).
- **PostgreSQL** (versiya 15.x yoki undan yuqori, ma’lumotlar bazasi sifatida).
- **Git** (agar loyiha klon qilinadigan bo‘lsa).

## O‘rnatish va ishga tushirish

### 1. Loyiha fayllarini ochish
1. ZIP faylni oching:
   - `10-dars.zip` faylni o‘zingiz xohlagan joyga (masalan, `Desktop/10-dars/`) oching.
2. Terminalda loyiha papkasiga o‘ting:
   ```bash
   cd Desktop/10-dars
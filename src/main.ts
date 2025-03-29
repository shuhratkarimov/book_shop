import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true, 
  });  
  app.use(cookieParser());
  const PORT = process.env.PROJECT_PORT || 4001;
  await app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}/graphql`);
  });
}
bootstrap();

import { Module } from '@nestjs/common';
import { QuizModule } from './modules/quiz-app/quiz.module'; // Adjust the path as needed

@Module({
  imports: [QuizModule],
})
export class AppModule {}

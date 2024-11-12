import { IsString, IsNotEmpty, IsArray, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty({ message: 'Question must not be empty' })
  question: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Options must contain 4 items' })
  options: string[];  // Array of 4 answer options

  @IsString()
  @IsNotEmpty({ message: 'Correct answer must not be empty' })
  correctAnswer: string;  // Correct answer should match one of the options
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Quiz must have at least one question' })  // Added a custom message for at least one question
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

export class SubmitAnswerDto {
  @ApiProperty({
    description: 'Submit answer for a quiz'
  })
  @IsString()
  @IsNotEmpty()
  quizId: string;

  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

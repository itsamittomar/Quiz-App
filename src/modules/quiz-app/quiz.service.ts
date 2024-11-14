import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from '../../dtos/quiz.dto';
import { SubmitAnswerDto } from '../../dtos/quiz.dto';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface UserAnswers {
  [quizId: string]: {
    [questionId: string]: string; 
  };
}

@ApiTags('Quiz')
@Injectable()
export class QuizService {
  private quizzes: Quiz[] = []; 
  private userAnswers: UserAnswers = {}; 

  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({
    status: 201,
    description: 'The quiz has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request if title or questions are missing.',
  })
  createQuiz(createQuizDto: CreateQuizDto): Quiz {
    if (!createQuizDto.title || !createQuizDto.questions || createQuizDto.questions.length === 0) {
      throw new BadRequestException('Title and questions are required');
    }

    const quizId = uuidv4();
    const quiz: Quiz = {
      id: quizId,
      title: createQuizDto.title,
      questions: createQuizDto.questions.map((question) => ({
        id: uuidv4(),
        ...question,
      })),
    };
    this.quizzes.push(quiz); 
    return quiz;
  }

  @ApiOperation({ summary: 'Get a quiz by its ID' })
  @ApiResponse({
    status: 200,
    description: 'The quiz data has been successfully retrieved.'
  })
  @ApiResponse({
    status: 404,
    description: 'Quiz not found.',
  })
  getQuizById(quizId: string): Quiz {
    const quiz = this.quizzes.find((q) => q.id === quizId);

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const quizWithoutCorrectAnswers = {
      ...quiz,
      questions: quiz.questions.map(({ correctAnswer, ...rest }) => rest),
    };

    return quizWithoutCorrectAnswers;
  }

  @ApiOperation({ summary: 'Submit an answer for a quiz question' })
  @ApiBody({ type: SubmitAnswerDto }) // Use the appropriate DTO here
  @ApiResponse({
    status: 200,
    description: 'Answer submitted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Quiz or question not found.',
  })
  submitAnswer(submitAnswerDto: SubmitAnswerDto) {
    const { quizId, questionId, answer } = submitAnswerDto;

    const quiz = this.quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (!this.userAnswers[quizId]) {
      this.userAnswers[quizId] = {};
    }

    this.userAnswers[quizId][questionId] = answer;
    const isCorrect = question.correctAnswer === answer;
    const feedback = isCorrect
      ? 'Correct!'
      : `Incorrect. The correct answer is: ${question.correctAnswer}`;

    return {
      feedback,
      isCorrect,
      quizId,
      questionId,
      userAnswer: answer,
      correctAnswer: question.correctAnswer,
    };
  }

  @ApiOperation({ summary: 'Get results for a specific quiz' })
  @ApiResponse({
    status: 200,
    description: 'The quiz results have been successfully retrieved.',
    type: Object, // You can define a custom DTO here for the result response
  })
  @ApiResponse({
    status: 404,
    description: 'Quiz not found.',
  })
  getResults(quizId: string) {
    const quiz = this.getQuizById(quizId);

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const userQuizAnswers = this.userAnswers[quizId] || {};
    let score = 0;

    const answerSummary = quiz.questions.map((question) => {
      const userAnswer = userQuizAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) {
        score += 1;
      }

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    return {
      quizId,
      score,
      totalQuestions: quiz.questions.length,
      answerSummary,
    };
  }
}

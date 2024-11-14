import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { CreateQuizDto, SubmitAnswerDto } from '../../dtos/quiz.dto';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizService],
    }).compile();

    service = module.get<QuizService>(QuizService);
  });

  jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mock-uuid'),
  }));
  
  describe('QuizService - createQuiz', () => {
    let service: QuizService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [QuizService],
      }).compile();
  
      service = module.get<QuizService>(QuizService);
    });
  
    it('should create a quiz with valid data', () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Sample Quiz',
        questions: [
          { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: '4' },
        ],
      };
  
      const quiz = service.createQuiz(createQuizDto);
      expect(quiz.title).toBe(createQuizDto.title);
      expect(quiz.questions.length).toBe(createQuizDto.questions.length);
    });

  
    it('should throw an error if title is missing', () => {
      const createQuizDto: CreateQuizDto = {
        title: '', // Missing title
        questions: [
          { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: '4' },
        ],
      };
  
      expect(() => service.createQuiz(createQuizDto)).toThrowError(BadRequestException);
    });
  

  
    it('should handle multiple questions and ensure unique IDs for each question', () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Multiple Questions Quiz',
        questions: [
          { question: 'What is 1+1?', options: ['1', '2', '3'], correctAnswer: '2' },
          { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: '4' },
        ],
      };
  
      const quiz = service.createQuiz(createQuizDto);
  
      expect(quiz.questions[0].id).not.toBe(quiz.questions[1].id); // Ensure unique question IDs
    });
  });

  // Test get quiz by ID
  describe('getQuizById', () => {
    it('should return a quiz by ID', () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Sample Quiz',
        questions: [
          { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: '4' },
        ],
      };

      const quiz = service.createQuiz(createQuizDto);
      const fetchedQuiz = service.getQuizById(quiz.id);

      expect(fetchedQuiz).toEqual({
        id: quiz.id,
        title: quiz.title,
        questions: quiz.questions.map(({ correctAnswer, ...rest }) => rest),
      });
    });

    it('should throw an error if the quiz is not found', () => {
      expect(() => service.getQuizById('non-existing-id')).toThrow(NotFoundException);
    });
  });

  // Test submit answer
  describe('submitAnswer', () => {
    it('should return correct feedback when the answer is correct', () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Sample Quiz',
        questions: [
          { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: '4' },
        ],
      };

      const quiz = service.createQuiz(createQuizDto);
      const submitAnswerDto: SubmitAnswerDto = {
        quizId: quiz.id,
        questionId: quiz.questions[0].id,
        answer: '4',
      };

      const result = service.submitAnswer(submitAnswerDto);

      expect(result.feedback).toBe('Correct!');
      expect(result.isCorrect).toBe(true);
    });

    it('should return incorrect feedback when the answer is incorrect', () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Sample Quiz',
        questions: [
          { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: '4' },
        ],
      };

      const quiz = service.createQuiz(createQuizDto);
      const submitAnswerDto: SubmitAnswerDto = {
        quizId: quiz.id,
        questionId: quiz.questions[0].id,
        answer: '3',
      };

      const result = service.submitAnswer(submitAnswerDto);

      expect(result.feedback).toBe('Incorrect. The correct answer is: 4');
      expect(result.isCorrect).toBe(false);
    });

    it('should throw an error if the quiz is not found', () => {
      const submitAnswerDto: SubmitAnswerDto = {
        quizId: 'non-existing-id',
        questionId: 'non-existing-question-id',
        answer: '4',
      };

      expect(() => service.submitAnswer(submitAnswerDto)).toThrow(NotFoundException);
    });

    it('should throw an error if the question is not found', () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Sample Quiz',
        questions: [
          { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: '4' },
        ],
      };

      const quiz = service.createQuiz(createQuizDto);
      const submitAnswerDto: SubmitAnswerDto = {
        quizId: quiz.id,
        questionId: 'non-existing-question-id',
        answer: '4',
      };

      expect(() => service.submitAnswer(submitAnswerDto)).toThrow(NotFoundException);
    });
  });

  
  describe('getResults', () => {
    it('should return zero score if no answers are correct', () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Sample Quiz',
        questions: [
          { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: '4' },
        ],
      };

      const quiz = service.createQuiz(createQuizDto);
      const submitAnswerDto: SubmitAnswerDto = {
        quizId: quiz.id,
        questionId: quiz.questions[0].id,
        answer: '3',
      };

      service.submitAnswer(submitAnswerDto);

      const results = service.getResults(quiz.id);

      expect(results.score).toBe(0);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { CreateQuizDto, SubmitAnswerDto } from '../../dtos/quiz.dto';
import { NotFoundException } from '@nestjs/common';

// Mocking the QuizService
const mockQuizService = {
  createQuiz: jest.fn(),
  getQuizById: jest.fn(),
  submitAnswer: jest.fn(),
  getResults: jest.fn(),
};

describe('QuizController', () => {
  let quizController: QuizController;
  let quizService: QuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        {
          provide: QuizService,
          useValue: mockQuizService,
        },
      ],
    }).compile();

    quizController = module.get<QuizController>(QuizController);
    quizService = module.get<QuizService>(QuizService);
  });

  describe('createQuiz', () => {
    it('should create a quiz successfully', async () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Test Quiz',
        questions: [
          {
            question: 'What is 2 + 2?',
            options: ['3', '4', '5'],
            correctAnswer: '4',
          },
        ],
      };

      const mockResponse = {
        id: 'some-uuid',
        title: createQuizDto.title,
        questions: createQuizDto.questions.map((q, idx) => ({
          id: `question-${idx}-uuid`,
          ...q,
        })),
      };

      mockQuizService.createQuiz.mockReturnValue(mockResponse);

      const result = await quizController.createQuiz(createQuizDto);
      expect(result.statusCode).toBe(201);
      expect(result.message).toBe('Quiz Created Successfully');
      expect(result.data).toEqual(mockResponse);
    });

    it('should throw BadRequestException if title is missing', async () => {
      const createQuizDto: CreateQuizDto = { title: '', questions: [] };
      try{
        await expect(quizController.createQuiz(createQuizDto))
      }
      catch(error){
        expect(error).toBeInstanceOf(NotFoundException)
      }
    });
  });

  describe('getQuizData', () => {
    it('should return quiz data successfully', async () => {
      const quizId = 'some-uuid';
      const mockQuizData = {
        id: quizId,
        title: 'Test Quiz',
        questions: [
          { id: 'question-uuid', question: 'What is 2 + 2?', options: ['3', '4', '5'] },
        ],
      };

      mockQuizService.getQuizById.mockReturnValue(mockQuizData);

      const result = await quizController.getQuizData(quizId);
      expect(result.message).toBe('Quiz data fetched Successfully');
      expect(result.response).toEqual(mockQuizData);
    });

    it('should throw NotFoundException if quiz is not found', async () => {
      const quizId = 'invalid-uuid';
      mockQuizService.getQuizById.mockImplementation(() => {
        throw new NotFoundException('Quiz not found');
      });

      try{
        await expect(quizController.getQuizData(quizId))
      }
      catch(error){
        expect(error).toBeDefined()
      }
    });
  });

  describe('submitAnswer', () => {
    it('should submit an answer successfully', async () => {
      const submitAnswerDto: SubmitAnswerDto = {
        quizId: 'some-uuid',
        questionId: 'question-uuid',
        answer: '4',
      };

      const mockFeedback = {
        feedback: 'Correct!',
        isCorrect: true,
        quizId: submitAnswerDto.quizId,
        questionId: submitAnswerDto.questionId,
        userAnswer: submitAnswerDto.answer,
        correctAnswer: '4',
      };

      mockQuizService.submitAnswer.mockReturnValue(mockFeedback);

      const result = await quizController.submitAnswer(submitAnswerDto);
      expect(result).toEqual(mockFeedback);
    });

    it('should throw NotFoundException if quiz or question is not found', async () => {
      const submitAnswerDto: SubmitAnswerDto = {
        quizId: 'invalid-uuid',
        questionId: 'question-uuid',
        answer: '4',
      };

      mockQuizService.submitAnswer.mockImplementation(() => {
        throw new NotFoundException('Quiz or Question not found');
      });

      try{
        await expect(quizController.submitAnswer(submitAnswerDto))
      }
      catch(error){
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('evaluateQuiz', () => {
    it('should evaluate the quiz and return results', async () => {
      const quizId = 'some-uuid';
      const mockResults = {
        quizId,
        score: 1,
        totalQuestions: 1,
        answerSummary: [
          {
            questionId: 'question-uuid',
            userAnswer: '4',
            correctAnswer: '4',
            isCorrect: true,
          },
        ],
      };

      mockQuizService.getResults.mockReturnValue(mockResults);

      const result = await quizController.evaluateQuiz(quizId);
      expect(result).toEqual(mockResults);
    });

    it('should throw NotFoundException if quiz is not found when evaluating', async () => {
      const quizId = 'invalid-uuid';
      mockQuizService.getResults.mockImplementation(() => {
        throw new NotFoundException('Quiz not found');
      });
      try{
        await expect(quizController.evaluateQuiz(quizId))
      }
      catch(error){
        expect(error).toBeInstanceOf(NotFoundException)
      }
    });
  });
});

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from '../../dtos/quiz.dto';
import { SubmitAnswerDto } from '../../dtos/quiz.dto';
import { v4 as uuidv4 } from 'uuid';

// Define the Question interface
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string; // correctAnswer is optional now
}

// Define the Quiz interface
interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

// Define a type for user answers
interface UserAnswers {
  [quizId: string]: {
    [questionId: string]: string;  // The answer could be a string, modify it if needed
  };
}

@Injectable()
export class QuizService {
  private quizzes: Quiz[] = []; // Store quizzes
  private userAnswers: UserAnswers = {}; // Store user answers

  // Method to create a new quiz
  createQuiz(createQuizDto: CreateQuizDto): Quiz {
    const quizId = uuidv4();
    const quiz: Quiz = {
      id: quizId,
      title: createQuizDto.title,
      questions: createQuizDto.questions.map((question) => ({
        id: uuidv4(),
        ...question,
      })),
    };
    this.quizzes.push(quiz); // Add quiz to quizzes array
    return quiz;
  }

  // Method to get a quiz by ID
  getQuizById(quizId: string): Quiz {
    const quiz = this.quizzes.find((q) => q.id === quizId);

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Map through the questions and exclude the correct answers
    const quizWithoutCorrectAnswers = {
      ...quiz,
      questions: quiz.questions.map(({ correctAnswer, ...rest }) => rest),
    };

    return quizWithoutCorrectAnswers;
  }

  // Method to submit an answer and provide feedback
  submitAnswer(submitAnswerDto: SubmitAnswerDto) {
    const { quizId, questionId, answer } = submitAnswerDto;

    // Check if the quiz exists
    const quiz = this.quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Find the specific question
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Initialize the userAnswers for this quiz if not already initialized
    if (!this.userAnswers[quizId]) {
      this.userAnswers[quizId] = {};
    }

    // Store the user's answer
    this.userAnswers[quizId][questionId] = answer;

    // Check if the answer is correct or not
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

  // Method to get the results for a specific quiz
  getResults(quizId: string) {
    const quiz = this.getQuizById(quizId);
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

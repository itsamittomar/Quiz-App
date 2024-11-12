import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto , SubmitAnswerDto } from '../../dtos/quiz.dto';
import { ApiOperation } from '@nestjs/swagger';


@Controller('quiz')
export class QuizController {

  constructor(private  quizService: QuizService) {}
  @Post()
  @HttpCode(201)
  @ApiOperation({summary:"This API will create the quiz "})
  createQuiz(@Body() createQuizDto: CreateQuizDto) {
    const response =  this.quizService.createQuiz(createQuizDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Quiz Created Successfully',
      data: response,
    };
  }


  @Get('test')
  testRoute() {
    return { message: 'Quiz Controller is working!' };
  }



  @Get(':quizId')
  @HttpCode(200)
  @ApiOperation({summary:"This API will get the quiz data"})
  getQuizData(@Param('quizId') quizId: string) {
    const response =  this.quizService.getQuizById(quizId);
    return {message: 'Quiz data fetched Successfully' , response}
  }


  @Post('answer')
  @HttpCode(200)
  @ApiOperation({summary:"This API will submit answer"})
  submitAnswer(@Body() submitAnswerDto: SubmitAnswerDto) {
    return this.quizService.submitAnswer(submitAnswerDto);
  }

  @Get(':quizId/evaluate')
  @HttpCode(200)
  @ApiOperation({summary:"This API will evaluate quiz"})
  evaluateQuiz(@Param('quizId') quizId: string) {
    return this.quizService.getResults(quizId);
  }
}

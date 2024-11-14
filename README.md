# Quiz App

## Overview

Quiz App is a simple application that allows users to create quizzes, submit answers, and evaluate the results. The app provides an API that allows interaction with quizzes and their questions. This project is built using **NestJS** and **Swagger** for API documentation.

---

## API Documentation

The application provides the following APIs to interact with quizzes:

### 1. **Create Quiz**

- **Endpoint**: `POST /quiz`
- **Description**: Creates a new quiz with a title and questions.
- **Request Body**: 
    ```json
    {
      "title": "Sample Quiz Title",
      "questions": [
        {
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5"],
          "correctAnswer": "4"
        },
        {
          "question": "What is the capital of France?",
          "options": ["Berlin", "Madrid", "Paris"],
          "correctAnswer": "Paris"
        }
      ]
    }
    ```
- **Response**:
    ```json
    {
      "statusCode": 201,
      "message": "Quiz Created Successfully",
      "data": {
        "id": "quiz-uuid",
        "title": "Sample Quiz Title",
        "questions": [
          {
            "id": "question-uuid-1",
            "question": "What is 2 + 2?",
            "options": ["3", "4", "5"]
          },
          {
            "id": "question-uuid-2",
            "question": "What is the capital of France?",
            "options": ["Berlin", "Madrid", "Paris"]
          }
        ]
      }
    }
    ```

### 2. **Get Quiz Data**

- **Endpoint**: `GET /quiz/:quizId`
- **Description**: Retrieves the quiz data by its ID.
- **Response**:
    ```json
    {
      "message": "Quiz data fetched Successfully",
      "response": {
        "id": "quiz-uuid",
        "title": "Sample Quiz Title",
        "questions": [
          {
            "id": "question-uuid-1",
            "question": "What is 2 + 2?",
            "options": ["3", "4", "5"]
          },
          {
            "id": "question-uuid-2",
            "question": "What is the capital of France?",
            "options": ["Berlin", "Madrid", "Paris"]
          }
        ]
      }
    }
    ```

### 3. **Submit Answer**

- **Endpoint**: `POST /quiz/answer`
- **Description**: Submits an answer for a specific question in a quiz.
- **Request Body**:
    ```json
    {
      "quizId": "quiz-uuid",
      "questionId": "question-uuid-1",
      "answer": "4"
    }
    ```
- **Response**:
    ```json
    {
      "feedback": "Correct!",
      "isCorrect": true,
      "quizId": "quiz-uuid",
      "questionId": "question-uuid-1",
      "userAnswer": "4",
      "correctAnswer": "4"
    }
    ```

### 4. **Evaluate Quiz**

- **Endpoint**: `GET /quiz/:quizId/evaluate`
- **Description**: Evaluates the results of a quiz.
- **Response**:
    ```json
    {
      "quizId": "quiz-uuid",
      "score": 1,
      "totalQuestions": 2,
      "answerSummary": [
        {
          "questionId": "question-uuid-1",
          "userAnswer": "4",
          "correctAnswer": "4",
          "isCorrect": true
        },
        {
          "questionId": "question-uuid-2",
          "userAnswer": "Madrid",
          "correctAnswer": "Paris",
          "isCorrect": false
        }
      ]
    }
    ```

---

## Models

### Quiz

A **Quiz** contains a title and a list of questions.

- **id**: `string` (UUID)
- **title**: `string`
- **questions**: `Array<Question>`

### Question

A **Question** contains a question, a list of options, and the correct answer.

- **id**: `string` (UUID)
- **question**: `string`
- **options**: `Array<string>`
- **correctAnswer**: `string` (optional)

### SubmitAnswerDto

The **SubmitAnswerDto** is used to submit answers for a question.

- **quizId**: `string` (UUID)
- **questionId**: `string` (UUID)
- **answer**: `string`

### CreateQuizDto

The **CreateQuizDto** is used to create a new quiz.

- **title**: `string`
- **questions**: `Array<QuestionDto>`

### QuestionDto

The **QuestionDto** is used to define questions when creating a quiz.

- **question**: `string`
- **options**: `Array<string>`
- **correctAnswer**: `string` (optional)

---

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/quiz-app.git
    ```

2. Install dependencies:
    ```bash
    cd quiz-app
    npm install
    ```

3. Start the application:
    ```bash
    npm run start:dev
    ```

4. To Check the test case:
    ```bash
    npm run test
    ```

4. The application will be running at `http://localhost:3001`. You can access the Swagger UI at `http://localhost:3001/api` to test the APIs.

---



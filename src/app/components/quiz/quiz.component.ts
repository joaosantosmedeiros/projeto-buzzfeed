import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import quiz_questions from '../../../assets/data/quiz-questions.json';

type Question = {
  id: number;
  question: string;
  options: { id: number; name: string; alias: string }[];
};

type Questions = {
  title: string;
  questions: Question[];
};

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent implements OnInit {
  title: string = '';

  questions: Question[] = [];
  selectedQuestion: Question = { id: 0, options: [], question: 'default' };
  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  answers: string[] = [];

  isFinished: boolean = false;

  result: string = '';

  constructor() {}

  ngOnInit(): void {
    if (quiz_questions) {
      this.isFinished = false;
      this.questions = quiz_questions.questions;
      this.title = quiz_questions.title;
      this.selectedQuestion = this.questions[this.questionIndex];
      this.questionIndex = 0;
      this.questionMaxIndex = this.questions.length;
    }
  }

  playerChoice = (choice: string) => {
    this.answers.push(choice);
    this.nextStep();
  };

  nextStep = async () => {
    this.questionIndex += 1;

    if (this.questionMaxIndex > this.questionIndex) {
      this.selectedQuestion = this.questions[this.questionIndex];
    } else {
      const finalAnswer = await this.checkResult(this.answers);
      this.isFinished = true;
      this.result =
        quiz_questions.results[finalAnswer as keyof typeof quiz_questions.results];
    }
  };

  checkResult = async (answers: string[]): Promise<string> => {
    return answers.reduce((previous, current, i, arr) => {
      if (
        arr.filter((item) => item === previous).length >
        arr.filter((item) => item === current).length
      ) {
        return previous;
      } else {
        return current;
      }
    });
  };
}

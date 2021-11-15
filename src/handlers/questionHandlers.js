'use strict';

import { QUESTION_CONTAINER_ID, QUIZ_CONTAINER_ID, SCORE_SPAN_ID, NEXT_QUESTION_BUTTON_ID } from '../constants.js';
import { createQuestionElement } from '../views/questionViews.js';
import { clearDOMElement, getDOMElement, getKeyByValue, checkAnswer, getCardElements, getCurrentContent, getInactiveCardElements, getCardContent } from '../utils/DOMUtils.js';
import { quizData, timerData, animationData } from '../data.js';
import { nextQuestion } from '../listeners/questionListeners.js'

export const incrementQuestionIndex = () => {
  quizData.currentQuestionIndex = quizData.currentQuestionIndex + 1;
};

export const showCurrentQuestion = () => {
  const currentQuestion = quizData.questions[quizData.currentQuestionIndex];
  const questionContainer = getDOMElement(QUESTION_CONTAINER_ID);
  const timeCount = document.querySelector('.timer .timer_sec')
  let time = currentQuestion.time;
  
  const timerCountdown = () => {
    timeCount.textContent = time;
    time > 0 ? time -- : time = 0;
  }

  timerData.counter = setInterval(timerCountdown, 1000)
  
  const nextQuestionButton = getDOMElement(NEXT_QUESTION_BUTTON_ID);
  nextQuestionButton.removeEventListener('click', nextQuestion)
};

export const deleteQuestionCard = () => {
  const card = getCardElements();
  let currentContent = getCurrentContent();
  const cardContent = getCardContent();
  const cardContentNumber = 9 - animationData.i;

  cardContent[cardContentNumber].classList.remove("active");

  card[animationData.layer - 1].style.height = "0";
  card[animationData.layer - 1].style.padding = "0";
  card[animationData.layer - 1].classList.remove("active");
  card[animationData.layer - 1].classList.add("inactive");

  animationData.i += 1;
  animationData.step += 10;
  animationData.layer -= 1;

  card[9 - animationData.i].style.animation = 'neon 2s ease-in-out infinite alternate';

  if (animationData.i < cardContent.length) {
    document.getElementById("step").style.width = animationData.step + "%";
    const nextCardContentNumber = 9 - animationData.i;
    const nextItem = cardContent[nextCardContentNumber];
    currentContent = nextItem.classList.add("active");
  }
};

export const showCurrentScore = () => {
  const currentScore = quizData.currentTotalScore;
  const scoreSpan = getDOMElement(SCORE_SPAN_ID);
  scoreSpan.innerText = currentScore;
};

export const clearQuizContainer = () => {
  const quizContainer = getDOMElement(QUIZ_CONTAINER_ID);
  clearDOMElement(quizContainer);
};

export function handleSelectedAnswer(evt) {
  const currentQuestion = quizData.questions[quizData.currentQuestionIndex];
  const nextQuestionButton = getDOMElement(NEXT_QUESTION_BUTTON_ID);

  currentQuestion.selected = getKeyByValue(currentQuestion.answers, evt.target.textContent);

  clearInterval(timerData.counter)
  nextQuestionButton.addEventListener('click', nextQuestion);
};

export function handleQuestionResult() {
  const currentQuestion = quizData.questions[quizData.currentQuestionIndex];
  const isCorrect = checkAnswer(currentQuestion.selected, currentQuestion.correct);
  if (isCorrect) {
    quizData.currentTotalScore += 1
  }
};

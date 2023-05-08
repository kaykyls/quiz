import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCorrectAnswer,
  setPlayerAnswer,
  setSelectedAnswer,
  setIsCorrect
} from '../../redux/answerSlice';
import './question.scss';
import he from 'he';

interface QuestionProps {
    question: {
      category: string;
      correct_answer: string;
      difficulty: string;
      incorrect_answers: string[];
      question: string;
      type: string;
    }
}

const Question = ({ question }: QuestionProps) => {
    const {
        playerAnswer,
        selectedAnswer,
        isCorrect,
        correctAnswer
    } = useSelector((state: any) => state.answer);

    const [answers, setAnswers] = useState<string[]>([])
    const [decodedAnswers, setDecodedAnswers] = useState<string[]>([])

    const dispatch = useDispatch()

    const handleSelectAnswer = (index: number) => {
        if (isCorrect !== null) {
            return
        }

        dispatch(setSelectedAnswer(index))
        dispatch(setPlayerAnswer(answers[index]))
    }

    const shuffle = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        setAnswers(shuffle([question.correct_answer, ...question.incorrect_answers]))  

        dispatch(setPlayerAnswer(null))
        dispatch(setIsCorrect(null))
        dispatch(setCorrectAnswer(question.correct_answer))
        dispatch(setSelectedAnswer(null))
    }, [question])

    useEffect(() => {
        const decodedAnswers = answers.map((answer: string) => he.decode(answer));
        setDecodedAnswers(decodedAnswers);
      }, [answers]);
      

    const changleClassName = (index: number) => {
        if(isCorrect === false && playerAnswer === answers[index]) {
            return "alternative is-wrong"
        }

        if(isCorrect && playerAnswer === answers[index]) {
            return "alternative is-correct"
        }

        if(isCorrect === false && answers[index] === correctAnswer) {
            return "alternative is-correct"
        }

        if (selectedAnswer === index) {
            return "alternative is-selected"
        }

        if (isCorrect !== null && answers[index] !== correctAnswer && answers[index] !== playerAnswer) {
            return "alternative is-confirmed"
        }

        return "alternative"
    }

    return (
        <div className='question'>
            <div className="alternatives">
                <div onClick={() => handleSelectAnswer(0)} className={changleClassName(0)}>
                    <span className='alternative-text'>{"A)"} {decodedAnswers[0]}</span>
                </div>
                <div onClick={() => handleSelectAnswer(1)} className={changleClassName(1)}>
                    <span className='alternative-text'>{"B)"} {decodedAnswers[1]}</span>
                </div>
                {question.type === "multiple" &&
                <Fragment>
                    <div onClick={() => handleSelectAnswer(2)} className={changleClassName(2)}>
                    <span className='alternative-text'>{"C)"} {decodedAnswers[2]}</span>
                    </div>
                    <div onClick={() => handleSelectAnswer(3)} className={changleClassName(3)}>
                        <span className='alternative-text'>{"D)"} {decodedAnswers[3]}</span>
                    </div>
                </Fragment>
                }
                
            </div>
        </div>
    )
}

export default Question
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect, useCallback } from "react";
import { getQuizToStart, submitQuiz } from "~/apis";
import { toast } from "react-toastify";
import { Backdrop, Button, EditorViewer } from "~/components";
import ShowResult from "./ShowResult";


export default function StartPractice() {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(60);

  const [quizToStart, setQuizToStart] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [hasAnsweredAll, setHasAnsweredAll] = useState(false);// check còn câu nào chưa chọn thì thông báo
  const [result, setResult] = useState([]);
  const [answeredQues, setAnsweredQues] = useState([]);
  const [showResult, setShowResult] = useState(false);
  
  // Hàm format thời gian dạng mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const body = {
          quizId: parseInt(id),
        };
        const response = await getQuizToStart(body);
        setQuizToStart(response);
        setAnswers(response.questionResponseList.map(question => ({
          questionId: question.id,
          selectedOptions: []
        })));
        setTimeLeft(response.durationMinutes * 60)
        
      } catch (error) {
        toast.error(error.message, { toastId: 'get_exam' });
      }
    })();
  }, []);

  const handleAnswer = (question, answerId) => {
    setAnswers(prevAnswers => {
      const newAnswers = prevAnswers.map(answer => {
        if (answer.questionId === question.id) {
          if (question.questionType.alias === 'single_choice') {
            const selectedOptions = [answerId];
            return {
              ...answer,
              selectedOptions
            };
          } else {
            const selectedOptions = [...answer.selectedOptions]; 
            const answerIndex = selectedOptions.indexOf(answerId);
            if (answerIndex === -1) {
              selectedOptions.push(answerId);
            } else {
              selectedOptions.splice(answerIndex, 1);
            }
            return {
              ...answer,
              selectedOptions
            };
          }
        }
        return answer;
      });
  
      const answeredAll = newAnswers.every(answer => answer.selectedOptions.length > 0);
      setHasAnsweredAll(answeredAll);
      return newAnswers;
    });

    setAnsweredQues(prev => {
      const cloned = [...prev, question.id];
      const resultSet = new Set(cloned);

      return Array.from(resultSet);
    })
  };
  
  const handleSubmitQuiz = useCallback(async (data) => {
    if(hasAnsweredAll || timeLeft === 0){
      const body = {
        userQuizResultId: data.userQuizResultId,
        quizId: data.quizId,
        answers: answers,
      }
      const respone = await submitQuiz(body);
      setResult(respone)
      setShowResult(true);

    } else {
      toast.error('Vui lòng chọn ít nhất một đáp án cho mỗi câu hỏi.', { toastId: 'select_answer' });
    }
  }, [timeLeft, hasAnsweredAll, answers]);

  useEffect(() => {
    let intervalId = null;

    intervalId = setInterval(() => {
      setTimeLeft(prev => {
        if(prev === 0) {
          clearInterval(intervalId);
          
          return 0;
        } 

        return prev - 1;
      });
    }, 1000);

    return () => {
      if(intervalId) {
        clearInterval(intervalId);
      }
    }
  }, [handleSubmitQuiz])

  useEffect(() => {
    if(timeLeft === 0) {
      (async () => {
        await handleSubmitQuiz(quizToStart);
      })()
    }
  }, [timeLeft, handleSubmitQuiz, quizToStart]);

 

  return (
    <div className="w-full">
      <div>
      <div className="fixed text-lg rounded-md mr-3 mt-3 border-2 shadow-md right-0 w-[20%] max-h-fit bg-gray-100 p-4">
      <p>
        <button
            onClick={() => handleSubmitQuiz(quizToStart)}
            disabled={!handleAnswer}
            className="px-6 w-full py-2 rounded-md text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
          >
            Nộp bài
          </button>
        </p>
        <p className="text-[30px] mt-5">{formatTime(timeLeft)}</p>
        <p className="mt-5">
          <span className="font-bold">- {quizToStart.title} -</span>
        </p>
        <p>
          <span>---------------- * - * ----------------</span>
        </p>
        <p className="flex">
        {quizToStart.questionResponseList && quizToStart.questionResponseList.map((item, index) => (
          <div key={item.id}>
              <div className={`rounded-full border-2 p-2 m-1 ${answeredQues.find((a) => item.id === a) ?  'bg-green-200'  : 'bg-slate-50'}`}>
              <Button className="w-[15px]">{index + 1}</Button>
              </div>
          </div>
        ))}
        </p>
      </div>
        <div className="bg-slate-50 rounded-md">
        {quizToStart.questionResponseList &&
            quizToStart.questionResponseList.map((item, index) => (
              <div key={item.id}>
                <div className="p-5 font-mono flex">
                  Câu hỏi: {index + 1} - <div className='ml-2 h-[25px]'><EditorViewer content={item.content} /></div>
                </div>
                <div>
                {item.answers.map((ans) => (
                  <div key={ans.id} className="ml-3 flex">
                    <input
                      type={item.questionType.alias === 'single_choice' ? 'radio' : 'checkbox'}
                      name={`answer_${index}`}
                      checked={answers[index]?.selectedOptions?.includes(ans.id)}
                      onChange={() => handleAnswer(item, ans.id)}
                      className='mt-3'
                    />
                    <div className='flex'>
                      <button
                        className="px-6 py-2 w-[800px] text-left border m-1 rounded-md shadow-sm"
                      >
                        {ans.content}
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      {showResult && (
         <Backdrop opacity={0.35} className="overflow-auto">
            <ShowResult showresult={result}/>
         </Backdrop>
      )}
    </div>
  );
}

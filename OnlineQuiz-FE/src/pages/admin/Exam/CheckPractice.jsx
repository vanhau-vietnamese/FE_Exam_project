
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getQuizToStart } from '~/apis';
import Icons from '~/assets/icons';
import { EditorViewer } from '~/components';


export default function CheckPractice() {
  const { id } = useParams();

  const [quizToStart, setQuizToStart] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [checkAnswer, setCheckAnswer] = useState([]);
  const [hasAnsweredAll, setHasAnsweredAll] = useState(false);// check còn câu nào chưa chọn thì thông báo
  const [isSubmitted, setIsSubmitted] = useState(false);

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
  };
  
  
  
  const handleSubmitQuiz = (data) => {
    if(hasAnsweredAll){
      const result = [];
      data.questionResponseList.map((ques) => {
        const correctAnswers = ques.answers.filter(answer => answer.correct).map(answer => answer.id);
        const selectedOptions = answers.find(answer => answer.questionId === ques.id)?.selectedOptions || [];
        
        const selectedString = selectedOptions.sort().toString();
        const correctString = correctAnswers.sort().toString();
        
        if(selectedOptions.length > 1){
          return result.push({id: ques.id, correct: selectedString === correctString})
        }else{
          return result.push({id: ques.id, correct: correctAnswers.includes(selectedOptions[selectedOptions.length - 1])})
        }
       
      })
      setCheckAnswer(result)
      setIsSubmitted(true)
    } else {
      toast.error('Vui lòng chọn ít nhất một đáp án cho mỗi câu hỏi.', { toastId: 'select_answer' });
    }
    
    
  };
  

  return (
    <div>
      <div className="fixed text-lg rounded-md mr-3 mt-3 border-2 shadow-md right-0 w-[300px] max-h-fit bg-gray-100 p-4">
        <p>
          <span className="font-bold">- {quizToStart.title} -</span>
        </p>
        <p>
          <span>---------------- * - * ----------------</span>
        </p>
        <p>
        <button
            onClick={() => handleSubmitQuiz(quizToStart)}
            disabled={!handleAnswer}
            className="px-6 w-full mt-5 py-2 rounded-md text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
          >
            Kiểm tra đáp án
          </button>
        </p>
      </div>
      <div className=" bg-slate-50 shadow-md h-full w-screen rounded-md p-3 m-3">
        {quizToStart.questionResponseList &&
          quizToStart.questionResponseList.map((item, index) => (
            <div key={item.id}>
              <p className="mt-5 font-mono flex">
                Câu hỏi: {index + 1} - <div className='ml-2 h-[25px]'><EditorViewer content={item.content} /></div>
              </p>
              <div>
              {item.answers.map((ans) => (
                <div key={ans.id} className="ml-3 flex">
                  <input
                    type={item.questionType.alias === 'single_choice' ? 'radio' : 'checkbox'}
                    name={`answer_${index}`}
                    disabled={isSubmitted}
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
                    <div className='mt-4'>
                      {answers[index]?.selectedOptions.includes(ans.id) && checkAnswer[index] && (
                          checkAnswer[index].correct ? (
                            <div className="text-white ml-5 bg-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                              <Icons.Check />
                            </div>
                          ) : (
                            <div className="text-white ml-5 bg-danger rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                              <Icons.X />
                            </div>
                          )
                        )}
                      </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

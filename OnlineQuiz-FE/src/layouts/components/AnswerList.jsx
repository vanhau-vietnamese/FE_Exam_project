import PropTypes from 'prop-types';

export default function AnswerList({ answers }) {
  const correctAnswers = answers.filter((item) => item.correct === true);

  return (
    <div className="mt-5">
      {answers.map((answer, index) => (
        <div key={index}>
          <p className="border border-spacing-5 rounded-md p-3 m-3">{answer.content}</p>
        </div>
      ))}
      <label className="flex items-center mb-5">
        <div className="flex">
          {correctAnswers && correctAnswers.length > 0 && (
            <div className="flex">
              <p className="mt-5 font-bold text-green-700">Đáp án đúng:</p>
              {correctAnswers.map((correctAnswer, index) => (
                <p className="mt-5 ml-2" key={index}>
                  {correctAnswer.content}
                </p>
              ))}
            </div>
          )}
        </div>
      </label>
    </div>
  );
}

AnswerList.propTypes = {
  answers: PropTypes.array.isRequired,
};

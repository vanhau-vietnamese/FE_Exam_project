import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { router } from '~/routes';

export default function ShowResult({showresult}) {
    return(
        <div className="flex items-center justify-center pt-6">
            <div className=" container mx-auto p-4 bg-slate-100 rounded-md w-[700px]">
                <h1>Kết quả bài tập {showresult.quizId}</h1>
                <div>
                    <h2 className="border-2 p-5 rounded-md text-center"> Điểm số: {showresult.marks} </h2>
                   <h3 className='mt-5'>Số câu đúng: {showresult.numberOfCorrect} </h3>
                   <h3 className='mt-5'>Số câu sai: {showresult.numberOfIncorrect}</h3>
                </div>
                <div className='mt-5'>
                    <Link to={router.student} className='rounded-md px-6 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover'>OK</Link>
                </div>
            </div>
        </div>
    );
}

ShowResult.propTypes = {
    showresult: PropTypes.object,
  };
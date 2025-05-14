import { useEffect } from 'react';
import { getQuestionTypes, getQuestions, searchQues } from '~/apis';
import { Backdrop, Input } from '~/components';
import { useQuestionStore } from '~/store';
import {
  CreateQuestionModal,
  FormEditQuestion,
  QuestionDelete,
  QuestionTable,
  ViewDetailQuestion,
} from './components';
import Icons from '~/assets/icons';
import { useState } from 'react';
import { useDebounce } from '~/hooks';

const ModalFormObj = {
  ['view']: (
    <Backdrop opacity={0.25}>
      <ViewDetailQuestion />
    </Backdrop>
  ),
  ['edit']: (
    <Backdrop opacity={0.25}>
      <FormEditQuestion />
    </Backdrop>
  ),
  ['delete']: <QuestionDelete />,
};

function QuestionWrapper() {
  const { setQuestionList, modal, targetQuestion, setQuestionType } = useQuestionStore(
    (state) => state
  );
  const [searchKeywords, setSearchKeywords] = useState('');

  const debounceQuery = useDebounce(searchKeywords, 200);

  useEffect(() => {
    (async () => {
      const searchValue = await searchQues({ searchContent: debounceQuery });
      setQuestionList(searchValue || []);
    })();
  }, [debounceQuery]);

  useEffect(() => {
    (async () => {
      const listQuestion = await getQuestions();
      const questionTypes = await getQuestionTypes();
      setQuestionList(listQuestion);

      if (questionTypes && questionTypes.length > 0) {
        setQuestionType(
          questionTypes.map((type) => ({ display: type.displayName, value: type.alias }))
        );
      }
    })();
  }, [setQuestionList, setQuestionType]);

  return (
    <>
      <div className="w-full">
        <div className="flex items-center w-full justify-between mb-5">
          <Input
            icon={<Icons.Search />}
            placeholder="Tìm kiếm theo nội dung câu hỏi"
            value={searchKeywords}
            onChange={(e) => setSearchKeywords(e.target.value)}
            className="md:max-w-[450px]"
          />
          <CreateQuestionModal />
        </div>
        <QuestionTable />
      </div>

      {targetQuestion && modal && ModalFormObj[modal]}
    </>
  );
}

export default QuestionWrapper;

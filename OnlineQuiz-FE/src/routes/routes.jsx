import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AuthLayout, DashBoardLayout } from '~/layouts';
import NotFound from '~/pages/NotFound';
import { CheckPractice, DoneCreateExam, FormCreateExam } from '~/pages/admin/Exam';
import ExamWrapper from '~/pages/admin/Exam/ExamWrapper';
import { Overview, QuestionWarehouse, Category, Teachers, Trainees } from '~/pages/admin';
import { SignInPage, SignUpPage } from '~/pages/auth';
import { ShowHistory, StartPractice, StudentExcises } from '~/pages/student';

import router from './const';
import UserInfo from '~/pages/user/account/UserInfo';

const routes = createBrowserRouter([
  {
    path: router.root,
    element: <DashBoardLayout />,
    children: [
      {
        path: router.admin,
        children: [
          {
            index: true,
            element: <Navigate to={`${router.admin}/exam`} />,
          },
          {
            path: 'overview',
            element: <Overview />,
          },

          {
            path: 'question',
            element: <QuestionWarehouse />,
          },
          {
            path: 'exam',
            children: [
              {
                index: true,
                element: <ExamWrapper />,
              },
              {
                path: 'checkpractice/:id',
                element: <CheckPractice />,
              },
            ],
          },
          {
            path: 'exam/createExam',
            element: <FormCreateExam />,
          },
          {
            path: 'exam/doneCreateExam',
            element: <DoneCreateExam />,
          },

          {
            path: 'students',
            children: [
              {
                index: true,
                element: <Trainees />,
              },
            ],
          },
          {
            path: 'teachers',
            children: [
              {
                index: true,
                element: <Teachers />,
              },
            ],
          },
          {
            path: 'categories',
            element: <Category />,
          },
        ],
      },
      {
        path: router.student,
        children: [
          {
            index: true,
            element: <Navigate to={`${router.student}/excises`} />,
          },
          {
            path: 'excises',
            children: [
              {
                index: true,
                element: <StudentExcises />,
              },
              {
                path: 'startQuiz/:id',
                element: <StartPractice />,
              },
            ],
          },
          {
            path: 'history',
            children: [
              {
                index: true,
                element: <ShowHistory />,
              },
              {
                path: 'startQuiz/:id',
                element: <StartPractice />,
              },
            ],
          },
        ],
      },
      {
        path: router.account,
        element: <UserInfo />,
      },
    ],
  },

  // Auth Route
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: router.signIn,
        element: <SignInPage />,
      },
      {
        path: router.signUp,
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default routes;

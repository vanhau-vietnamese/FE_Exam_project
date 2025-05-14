import Icons from '~/assets/icons';

const router = {
  root: '/',
  student: '/student',
  excises: '/student/excises',
  history: '/student/history',
  startQuiz: '/student/startQuiz',
  admin: '/admin',
  studentList: '/admin/students',
  question: '/admin/question',
  category: '/admin/categories',
  teacher: '/admin/teachers',
  exam: '/admin/exam',
  checkpractice: '/admin/checkpractice',
  createExam: '/admin/createExam',
  doneCreateExam: '/admin/createExam/doneCreateExam',
  signIn: '/auth/sign-in',
  signUp: '/auth/sign-up',
  account: '/account',
};

export const AdminNavLinks = [
  {
    path: `${router.admin}/overview`,
    name: 'Tổng quan',
    icon: <Icons.Dashboard />,
  },
  {
    path: router.exam,
    name: 'Kho bài tập',
    icon: <Icons.Paper />,
  },
  {
    path: router.question,
    name: 'Kho câu hỏi',
    icon: <Icons.DocumentText />,
  },
  {
    path: router.category,
    name: 'Danh mục',
    icon: <Icons.Squared />,
  },
  // {
  //   path: router.studentList,
  //   name: 'Học viên',
  //   icon: <Icons.Academic />,
  // },
  {
    path: router.teacher,
    name: 'Tài khoản',
    icon: <Icons.User />,
  },
];

export const StudentNavLinks = [
  {
    path: `${router.student}/excises`,
    name: 'Luyện tập',
    icon: <Icons.BookOpen />,
  },
  {
    path: router.history,
    name: 'Lịch sử',
    icon: <Icons.DownArrow />,
  },
];

export const RoleRootRoute = {
  ['admin']: router.admin,
  ['student']: router.student,
};

export default router;

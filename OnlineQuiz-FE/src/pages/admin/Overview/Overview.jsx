import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getStatistic } from '~/apis';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function Overview() {
  const [statistics, setStatistic] = useState([]);
  console.log({ statistics });

  useEffect(() => {
    (async () => {
      try {
        const statistics = await getStatistic();
        setStatistic(statistics);
      } catch (error) {
        toast.error('Không thể lấy dữ liệu thống kê', { toastId: 'get_statistic' });
      }
    })();
  }, []);

  const categories = statistics.map((item) => `Tháng ${item.month}`);
  const totalStudents = statistics.map((item) => item.totalStudents);
  const totalQuestions = statistics.map((item) => item.totalQuestions);
  const totalQuizzes = statistics.map((item) => item.totalQuizzes);

  const options = {
    chart: {
      type: 'line',
      height: '50%',
    },
    title: {
      text: 'Thống kê dữ liệu hàng tháng',
    },
    xAxis: {
      categories,
      title: { text: 'Tháng' },
    },
    yAxis: {
      title: { text: 'Số lượng' },
    },
    series: [
      {
        name: 'Học sinh',
        data: totalStudents,
      },
      {
        name: 'Câu hỏi',
        data: totalQuestions,
      },
      {
        name: 'Bài tập',
        data: totalQuizzes,
      },
    ],
  };

  return (
    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default Overview;

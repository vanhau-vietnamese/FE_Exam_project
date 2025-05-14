import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteCategoryById, getAllCategories, searchCategory } from '~/apis';
import Icons from '~/assets/icons';
import { Button, DialogComfirm, Input, Loading } from '~/components';
import { useDebounce } from '~/hooks';
import FormUpsertCategoryModal from './components/FormUpsertCategoryModal';

function Category() {
  const [searchKeywords, setSearchKeywords] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [targetValue, setTargetValue] = useState(null);

  const debounceQuery = useDebounce(searchKeywords, 200);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const listCategories = await getAllCategories();
        setCategories(listCategories);
      } catch (error) {
        toast.error('Không thể lấy danh sách danh mục', { toastId: 'get_categories' });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [setCategories]);

  useEffect(() => {
    (async () => {
      const searchValue = await searchCategory({ searchContent: debounceQuery });
      setCategories(searchValue || []);
    })();
  }, [debounceQuery]);

  const handleDeleteCategory = async () => {
    try {
      await deleteCategoryById(targetValue.id);
      setCategories(categories.filter((category) => category.id !== targetValue.id));
      toast.success('Xóa danh mục thành công', { toastId: 'delete_category' });
      setTargetValue(null);
    } catch (error) {
      toast.error('Danh mục đang được sử dụng, không thể xóa !', {
        toastId: 'fail_delete_category',
      });
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full flex items-center justify-between mb-3">
          <Input
            icon={<Icons.Search />}
            placeholder="Tìm kiếm theo tên danh mục"
            value={searchKeywords}
            onChange={(e) => setSearchKeywords(e.target.value)}
            className="md:max-w-[400px] flex-0"
          />
          <div>
            <Button
              className="flex-1 flex items-center gap-x-2 px-4 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover w-full"
              onClick={() => setOpenModal('create')}
            >
              <Icons.Plus />
              <p>Thêm mới</p>
            </Button>
          </div>
        </div>

        <table className="block w-full text-sm text-left rtl:text-right border-collapse">
          <thead className="text-[#3b3e66] uppercase text-xs block w-full">
            <tr className="bg-[#d1d2de] rounded-ss rounded-se w-full flex items-center text-xs">
              <th className="p-3 w-[5%] flex-shrink-0">Mã</th>
              <th className="p-3 flex-shrink-0 w-[25%]">Danh mục</th>
              <th className="p-3 flex-auto">Mô tả</th>
              <th className="p-3 flex-shrink-0 w-[15%]">Thời gian</th>
              <th className="p-3 flex-shrink-0 w-[15%]" align="center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto block w-full h-[calc(100vh-12rem)] border-strike border rounded-es rounded-ee bg-white">
            {loading ? (
              <tr className="block w-full h-full">
                <td className="flex flex-col items-center justify-center w-full h-full">
                  <Loading />
                </td>
              </tr>
            ) : categories && categories.length > 0 ? (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="flex items-center border-b border-[#d1d2de] transition-all hover:bg-[#d1d2de] hover:bg-opacity-30 h-[40px] font-semibold text-[#3b3e66] text-xs"
                >
                  <td className="p-3 w-[5%] flex-shrink-0">{category.id}</td>
                  <td className="p-3 flex-shrink-0 w-[25%] text-nowrap text-ellipsis overflow-hidden">
                    {category.title}
                  </td>
                  <td className="p-3 flex-auto text-nowrap text-ellipsis overflow-hidden">
                    {category.description || '--'}
                  </td>
                  <td className="p-3 overflow-hidden flex-shrink-0 w-[15%]" align="left">
                    {category.createdAt
                      ? moment(category.createdAt).format('hh:mm:ss A - DD/MM/YYYY')
                      : '--'}
                  </td>
                  <td className="p-3 flex-shrink-0 w-[15%] flex items-center justify-center">
                    <Button
                      onClick={() => setTargetValue(category)}
                      className="text-xs border border-danger rounded px-2 py-1 text-danger hover:bg-red-200 hover:bg-opacity-40"
                    >
                      <Icons.Trash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="block w-full h-full">
                <td className="flex flex-col items-center justify-center gap-y-5 w-full h-full p-5 text-slate-400 font-semibold text-xl">
                  <Icons.Empty />
                  <span>Không có dữ liệu</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {targetValue && !openModal && (
          <DialogComfirm
            title="Xác nhận xóa"
            color="danger"
            icon={<Icons.Exclamation />}
            body="Bạn có chắc muốn xóa danh mục này không?"
            onCancel={() => setTargetValue(null)}
            onConfirm={handleDeleteCategory}
            className="md:max-w-[500px]"
          />
        )}
        {openModal && (
          <FormUpsertCategoryModal
            isEditing={openModal === 'edit'}
            data={openModal === 'edit' ? targetValue : null}
            onCancel={() => {
              setOpenModal(null);
              setTargetValue(null);
            }}
            onSuccess={(value) => {
              if (value) {
                if (openModal === 'edit') {
                  const index = categories.findIndex((category) => category.id === value.id);
                  if (index > -1) {
                    const newCategories = [...categories];
                    newCategories[index] = value;
                    setCategories(newCategories);
                  }
                } else {
                  setCategories([...categories, value]);
                }
              }
              setOpenModal(null);
              setTargetValue(null);
            }}
            className="md:max-w-3xl "
          />
        )}
      </div>
    </>
  );
}

export default Category;

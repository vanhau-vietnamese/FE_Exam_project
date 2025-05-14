import PropTypes from 'prop-types';
import Backdrop from './Backdrop';
import Button from './Button';

export default function ModalCreation({
  title,
  className,
  children,
  onCancel,
  onConfirm,
  loading,
}) {
  return (
    <Backdrop opacity={0.25}>
      <div
        className={`container h-full mx-auto my-0 pt-[10vh] animate-fade-down animate-duration-[300ms] text-text ${className}`}
      >
        <form className="w-full bg-white shadow-sm rounded-md" onSubmit={onConfirm}>
          <div className="flex items-center gap-x-2 px-4 py-2 border-b border-dashed border-strike bg-slate-200 rounded-md rounded-ee-none rounded-es-none">
            <h3 className="text-text text-sm">{title}</h3>
          </div>
          <div className="px-4 py-5">{children}</div>
          <div className="flex items-center justify-end gap-x-5 p-2 border-t border-dashed border-strike">
            <Button
              onClick={onCancel}
              className={`px-4 py-2 text-sm !border-danger text-danger hover:bg-danger hover:bg-opacity-10`}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className={`px-4 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover`}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </div>
        </form>
      </div>
    </Backdrop>
  );
}

ModalCreation.propTypes = {
  loading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

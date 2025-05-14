import Backdrop from './Backdrop';
import PropTypes from 'prop-types';
import Button from './Button';

const DialogColor = {
  ['info']: {
    text: 'text-info',
    cancelBtn: '!border-danger text-danger hover:bg-danger hover:bg-opacity-10',
    confirmBtn: 'text-white !border-info bg-info hover:shadow-info_hover',
  },
  ['danger']: {
    text: 'text-danger',
    cancelBtn: '!border-info text-sm text-info hover:bg-info',
    confirmBtn: '!border-danger text-white bg-danger hover:shadow-danger_hover',
  },
};

export default function DialogComfirm({
  title,
  body,
  icon,
  color = 'info',
  onCancel,
  onConfirm,
  className,
}) {
  return (
    <Backdrop opacity={0.25}>
      <div
        className={`container h-full mx-auto my-0 pt-[30vh] animate-fade-down animate-duration-[300ms] ${DialogColor[color].text} ${className}`}
      >
        <div className="w-full bg-white shadow-sm rounded-md">
          <div className="flex items-center gap-x-2 px-2 py-3 border-b border-dashed border-strike bg-slate-200 rounded-md rounded-ee-none rounded-es-none">
            {icon && icon}
            <h3 className="text-text">{title}</h3>
          </div>
          <div className="px-2 py-5">
            <p className="text-base font-medium text-black">{body}</p>
          </div>
          <div className="flex items-center justify-end gap-x-5 p-2 border-t border-dashed border-strike">
            <Button
              onClick={onCancel}
              className={`px-4 py-2 text-sm hover:bg-opacity-10 ${DialogColor[color].cancelBtn}`}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm ${DialogColor[color].confirmBtn}`}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

DialogComfirm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  icon: PropTypes.node,
  color: PropTypes.oneOf(['info', 'danger']),
  className: PropTypes.string,
};

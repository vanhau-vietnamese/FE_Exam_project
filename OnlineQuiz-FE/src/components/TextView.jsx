import PropTypes from 'prop-types';

export default function TextView({ label, value, className }) {
  return (
    <div className={`flex flex-col w-full gap-y-1 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-text">{label}</label>}
      <div className="flex items-center bg-slate-100 rounded-md p-2">
        <p className="w-full text-text text-sm">{value}</p>
      </div>
    </div>
  );
}

TextView.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

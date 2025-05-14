import PropTypes from 'prop-types';

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disable: PropTypes.bool,
  onClick: PropTypes.func,
};

function Button({ children, type = 'button', className, onClick, disable }) {
  const handleClick = () => {
    if (!disable && typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disable}
      className={`border border-solid border-transparent text-center select-none transition-all duration-[350ms] font-semibold rounded-md disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;

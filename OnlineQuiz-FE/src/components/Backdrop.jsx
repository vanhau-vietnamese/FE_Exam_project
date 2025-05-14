import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

Backdrop.propTypes = {
  opacity: PropTypes.number,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

function Backdrop({ children, className, opacity = 0 }) {
  return createPortal(
    <div
      className={`fixed inset-0 overflow-auto z-[99] w-full h-full min-h-screen bg-black ${className}`}
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
    >
      {children}
    </div>,
    document.querySelector('body')
  );
}

export default Backdrop;

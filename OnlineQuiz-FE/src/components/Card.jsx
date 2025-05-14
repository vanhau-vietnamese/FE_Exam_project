import PropTypes from 'prop-types';

export default function Card({ children, className }) {
  return <div className={`bg-white p-2 shadow-xl rounded-md h-fit ${className}`}>{children}</div>;
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

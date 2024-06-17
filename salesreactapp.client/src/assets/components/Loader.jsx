import Spinner from 'react-bootstrap/Spinner';

function Loader() {
  return (
      <div className="sales-loader">
          <Spinner animation="border" />&#160;&#160; L O A D I N G ...
      </div>
  );
}

export default Loader;

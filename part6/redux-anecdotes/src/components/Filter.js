import React from "react";
import { useDispatch } from "react-redux";
import { filterChange } from "../reducers/filterReducer";
// import { connect } from "react-redux";

const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    // input-field value is in variable event.target.value
    dispatch(filterChange(event.target.value));
  };
  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
};

export default Filter;

// Use redux with the connect function (alternative option to using the Redux Hooks API)

// const Filter = (props) => {
//   const handleChange = (event) => {
//     // input-field value is in variable event.target.value
//     props.filterChange(event.target.value);
//   };

//   const style = {
//     marginBottom: 10,
//   };

//   return (
//     <div style={style}>
//       filter <input onChange={handleChange} />
//     </div>
//   );
// };

// const mapDispatchToProps = {
//   filterChange,
// };

// const ConnectedFilter = connect(null, mapDispatchToProps)(Filter);
// export default ConnectedFilter;

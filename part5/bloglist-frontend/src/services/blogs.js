import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

// Assigned to object and then exported as default export to get rid of React warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
const blogService = { getAll };

export default blogService;

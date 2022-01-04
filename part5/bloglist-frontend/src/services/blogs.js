import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, newObject) => {
  const response = await axios.put(baseUrl, newObject);
  return response.data;
};

// Assigned to object and then exported as default export to get rid of React warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
const blogService = { getAll, create, update, setToken };

export default blogService;

import axios from "axios";
// When using JSON server
// const baseUrl = "http://localhost:3001/persons";
// When using express server
const baseUrl = "http://localhost:3001/api/persons";

function getAll() {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
}

function create(newObject) {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
}

function update(id, newObject) {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
}

function deletePerson(id) {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
}

const personService = { getAll, create, update, deletePerson };

export default personService;

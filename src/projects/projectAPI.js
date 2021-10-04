import { Project } from "./Project";

const baseUrl = "http://localhost:4000";
const url = `${baseUrl}/projects`;

function translateStatusToErrorMessage(status) {
  switch (status) {
    case 401:
      return "Please login again.";
    case 403:
      return "You do not have permission to view the project(s).";
    default:
      return "There was an error retrieving the project(s). Please try again.";
  }
}

function checkStatus(response) {
  if (response.ok) {
    return response;
  } else {
    const httpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

    let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
  }
}

function parseJSON(response) {
  return response.json();
}

function delay(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}

const projectAPI = {
  get: (page = 1, search = "", limit = 20) => {
    search = search !== "" ? search.slice(10) : search;
    // console.log(search);
    // const newUrl = new URL(`${url}?_page=${page}&_limit=${limit}&_sort=name`)
    const newUrl = new URL(url);
    newUrl.searchParams.append("_page", page);
    newUrl.searchParams.append("_limit", limit);
    if (search) {
      newUrl.searchParams.append("isActive", search);
    }

    return fetch(newUrl)
      .then(checkStatus)
      .then(parseJSON)
      .then((projects) => {
        return projects.map((p) => {
          return new Project(p);
        });
      })
      .catch((error) => {
        console.log("log client error " + error);
        throw new Error(
          "There was an error retrieving the projects. Please try again."
        );
      });
  },
  put(project) {
    return fetch(`${url}/${project.id}`, {
      method: "PUT",
      body: JSON.stringify(project),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(checkStatus)
      .then(parseJSON)
      .catch((error) => {
        console.log("log client error " + error);
        throw new Error(
          "There was an error updating the project. Please try again."
        );
      });
  },
  find(id) {
    return fetch(`${url}/${id}`).then(checkStatus).then(parseJSON);
  },
};

export { projectAPI };

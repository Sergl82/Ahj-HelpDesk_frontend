function getURLParams(params) {
  const urlParams = new URLSearchParams();
  urlParams.append('method', params.method);
  if (params.id) urlParams.append('id', params.id);
  return `/?${urlParams}`;
}

function geformData(params) {
  const formData = new FormData();
  formData.append('method', params.method);
  if (params.id) {
    formData.append('id', params.id);
  }

  formData.append('name', params.name);
  formData.append('description', params.description);

  return formData;
}

export default function createRequest(params) {
  return new Promise((resolve, reject) => {
    // const URL = 'http://localhost:7070';
    const URL = 'https://serg-heroku.herokuapp.com/';
    const xhr = new XMLHttpRequest();
    const { method } = params;
    let urlParams = getURLParams(params);
    let methodRequest = 'GET';
    let formData = new FormData();

    if (method === 'createTicket'
       || method === 'changeStatus'
       || method === 'deleteTicket'
       || method === 'editTicket'
    ) {
      methodRequest = 'POST';
      urlParams = '';

      formData = geformData(params);
    }

    xhr.open(methodRequest, URL + urlParams);
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          if (xhr.response) {
            const data = JSON.parse(xhr.response);
            resolve(data);
          }
        } catch (e) {
          reject(e);
        }
      } else reject(new Error(`${xhr.status}: ${xhr.responseText}`));
    });
    xhr.send(formData);
  });
}

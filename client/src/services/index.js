const baseUrl = `./api`;

export const services = {
  order,
}

function order(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  return fetch(`${baseUrl}/order`, requestOptions).then(handleResponse);
}









// Helpers functions
// API response message(s)
function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
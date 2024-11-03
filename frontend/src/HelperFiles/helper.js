import config from '../../backend.config.json'

const genQueryString = (queryJSON) => {
  let queryString = '';
  for (let attribute in queryJSON) {
    queryString += `&${attribute}=${queryJSON[attribute]}`;
  }
  return queryString.slice(1);
}

const fetchRequest = async (path, method, body, token, queryJSON) => {
  const url = `http://localhost:${config.BACKEND_PORT}${path}` + (queryJSON ? ('?' + genQueryString(queryJSON)) : '');
  const headers = token ? {'Content-type': 'application/json', 'Authorization': `Bearer ${token}`} : {'Content-type': 'application/json'};
  const request = body ? {'method': method, 'headers': headers, 'body': JSON.stringify(body)} : {'method': method, 'headers': headers};

  console.log(url);
  console.log(request);

  try {
    const response = await fetch(url, request);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  return passwordRegex.test(password);
};

const isValidName = (name) => {
  return name.length > 0;
};

const isValidConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Registration function
export async function authFetch(userData, path) {
  // Validate all fields first
  const errors = [];

  if (!isValidEmail(userData.email)) {
    errors.push('Invalid email format');
  }

  if (!isValidPassword(userData.password)) {
    errors.push('Password must contain at least 8 characters, including uppercase, lowercase, number and special character');
  }

  if (path === config.REGISTER_PATH) {
    if (!isValidName(userData.name)) {
      errors.push('Name cannot be empty');
    }
  }
  // If there are validation errors, throw them
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw new Error(`Registration error: ${error.message}`);
  }
}

export default {fetchRequest, isValidEmail, isValidName, isValidPassword, isValidConfirmPassword};

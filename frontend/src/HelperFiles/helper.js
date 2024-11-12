import config from '../../backend.config.json'

const genQueryString = (queryJSON) => {
  let queryString = '';
  for (let attribute in queryJSON) {
    queryString += `&${attribute}=${queryJSON[attribute]}`;
  }
  return queryString.slice(1);
}

export const fetchRequest = async (path, method, body, token, queryJSON) => {
  const url = `http://localhost:${config.BACKEND_PORT}${path}` + (queryJSON ? ('?' + genQueryString(queryJSON)) : '');
  const headers = token ? {'Content-type': 'application/json', 'Authorization': `Bearer ${token}`} : {'Content-type': 'application/json'};
  const request = body ? {'method': method, 'headers': headers, 'body': JSON.stringify(body)} : {'method': method, 'headers': headers};

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

// Authentication function
export async function authFetch(userData, path) {
  // Only validate name for registration
  if (path.includes('register')) {
    if (!isValidName(userData.name)) {
      return {
        success: false,
        error: 'Please enter a valid name'
      };
    }
    if (!isValidEmail(userData.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      };
    }
  
    if (!isValidPassword(userData.password)) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      };
    }

    if (!isValidConfirmPassword(userData.password, userData.confirmPassword)) {
      return {
        success: false,
        error: 'Passwords do not match'
      };
    }
  }

  try {
    const response = await fetchRequest(
      path,
      'POST',
      userData,
      null, // no token needed for registration
      null  // no query parameters needed
    );

    if (!response) {
      throw new Error('Incorrect email or password');
    }

    return {
      success: true,
      data: response
    };

  } catch (error) {
    return {
      success: false,
      error: error.message || 'Registration failed. Please try again.'
    };
  }

}

// Logout function 
export async function logoutFetch(path, token) {
  try {
    const response = await fetchRequest(
      path,
      'POST',
      null,  // no body needed
      token, // pass the token
      null   // no query parameters
    );

    if (!response) {
      throw new Error('Network response was not ok');
    }

    return {
      success: true,
      data: response
    };

  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message || 'Logout failed. Please try again.'
    };
  }
}


export const getSlides = (presentations) => {
  return presentations?.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides;
};

export const getSlideByPosition = (presentations, slidePosition) => {
  return presentations?.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides.find((slide) => slide.slideNum === slidePosition);
}

export const getSlidePositionById = (presentations, slideId) => {
  return presentations?.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides.findIndex((slide) => slide.id === slideId) + 1;
};

export const getElementByIndex = (presentations, elementIndex, slideNum) => {
  return presentations?.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides[slideNum - 1].contents[elementIndex];
};

export const getPresentationTitle = (presentations) => {
  return presentations?.find((presentation) => presentation.id == location.pathname.split("/")[2]).title;
};

export default { isValidEmail, isValidName, isValidPassword, isValidConfirmPassword };

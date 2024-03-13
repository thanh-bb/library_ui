const BASE_URL = process.env.REACT_APP_BASE_URL;

export const get = async (path, options = {}) => {
    const response = await fetch(`${BASE_URL}${path}`, options);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
};


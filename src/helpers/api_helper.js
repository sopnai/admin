import axios from "axios";

// import accessToken from "./jwt-token-access/accessToken"

//pass new generated access token here
// const token = accessToken

//apply base url for axios
// const API_URL = "https://flawlessapi.uatdemo.in/admin"

// const axiosApi = axios.create({
//     baseURL: API_URL,
// })

// axiosApi.defaults.headers.common["Authorization"] = token 

// axiosApi.interceptors.response.use(
//     response => response,
//     error => Promise.reject(error)
// )

// export async function get(url, config = {}) {
//     return await axiosApi.get(url, { ...config }).then(response => response.data)
// }


const API_URL = process.env.REACT_APP_API_URL;
// const API_URL = "http://192.168.31.49:3000/admin";

const getAccessToken = () => {
    const storedAuthUser = localStorage.getItem("authUser");
    if (!storedAuthUser) {
        console.error("No authUser found in localStorage!");
        return null;
    }

    try {
        const authUser = JSON.parse(storedAuthUser);
        const accessToken = authUser?.data?.accessToken;

        if (!accessToken) {
            console.error("No access token found!");
            return null;
        }

        return accessToken;
    } catch (error) {
        console.error("Failed to parse authUser data!", error);
        return null;
    }
};

const logoutUser = () => {
    window.Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("authUser");
            window.location.href = "/login";
        }
    });
};


const axiosApi = axios.create({
    baseURL: API_URL,
});

axiosApi.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            logoutUser();
        }
        return Promise.reject(error);
    }
);

export async function get(url, config = {}) {
    return await axiosApi.get(url, { ...config }).then((response) => response.data);
}

export async function post(url, data, config = {}) {
    return axiosApi
        .post(url, data, { ...config })
        .then((response) => response.data);
}

export async function put(url, data, config = {}) {
    return axiosApi
        .put(url, data, { ...config })
        .then((response) => response.data);
}

export async function del(url, config = {}) {
    return await axiosApi
        .delete(url, { ...config })
        .then((response) => response.data);
}

export default axiosApi;

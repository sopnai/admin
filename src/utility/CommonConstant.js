// import { axiosInstance } from '../config/NetworkUtility';

// export const setAuthToken = (token, email = '', name = '') => {
//     if (token) {
//         localStorage.setItem('authToken', token);
//         // localStorage.setItem('userEmail', email);
//         // localStorage.setItem('userName', name);

//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//         localStorage.removeItem('authToken');
//         // localStorage.removeItem('userEmail');
//         // localStorage.removeItem('userName');
//         delete axiosInstance.defaults.headers.common['Authorization'];
//     }
// };


const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatCurrency = (amount) => {
    if (!amount) return '0';

    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatDateTime = (dateString) => {
    if (!dateString) return 'Invalid Date';

    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    return `${day}/${month}/${year}, ${hours}:${minutes} ${amPm}`;
};


export const formatDateTimeISO = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};


export const formatDateTime2 = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};



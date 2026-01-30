import React, { useState, useEffect } from 'react';


export const ConfirmAlert = ({ title = '', text = '', confirmButtonText = '', customClassBtn = '' }) => {
    return window.Swal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Cancel',
        customClass: {
            confirmButton: customClassBtn,
            cancelButton: 'btn btn-secondary',
        },
    });
}

export const DeleteAlert = ({ title = '', text = '' }) => {
    return window.Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
    });
}

export const SuccessAlert = (text = '') => {
    return window.Swal.fire({
        title: 'Success!',
        text: text,
        icon: 'success',
    });
}

export const ErrorAlert = (text = '') => {
    return window.Swal.fire({
        title: 'Error',
        text: text,
        icon: 'error',
    });
}

export const WarningAlert = (text = '') => {
    return window.Swal.fire({
        title: 'Warning',
        text: text,
        icon: 'warning',
    });
}
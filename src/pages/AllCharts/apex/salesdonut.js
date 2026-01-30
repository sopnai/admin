import React from 'react';
import ReactApexChart from 'react-apexcharts';

const Salesdonut = ({ bookingStatus }) => {
    const options = {
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '80%',
                },
            },
        },
        colors: ['#f8b425', '#ed4561', '#39a3fa', '#02a499'],
        labels: ['Pending', 'Cancelled', 'Confirmed', 'Completed'],
    };

    const series = [
        bookingStatus.pending || 0,
        bookingStatus.cancelled || 0,
        bookingStatus.confirmed || 0,
        bookingStatus.completed || 0,
    ];

    return (
        <ReactApexChart options={options} series={series} type="donut" height={230} className="apex-charts" />
    );
};

export default Salesdonut;

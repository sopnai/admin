import React, { useState, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';

const DataTable = ({ data, totalPage, total, currentPage, isLoading, onPageChange = () => { } }) => {

    const loading = false;
    const usersPerPage = 10;
    const [visiblePageCount, setvisiblePageCount] = useState(totalPage > 3 ? 3 : 1);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const [paginationRange, setPaginationRange] = useState([]);

    useEffect(() => {
        getPaginationRange();
        setStartIndex((currentPage - 1) * usersPerPage + 1);
        setEndIndex(Math.min(currentPage * usersPerPage, total));
    }, [currentPage, visiblePageCount]);

    useEffect(() => {
        setvisiblePageCount(totalPage > 3 ? 3 : 1);
    }, [data]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPage) {
            onPageChange(page);
        }
    };

    const getPaginationRange = () => {
        const start = Math.max(currentPage - Math.floor(visiblePageCount / 2), 1);
        const end = Math.min(start + visiblePageCount - 1, totalPage);
        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        setPaginationRange(pages);
    };


    return (
        <>
            <div style={{ position: 'relative' }}>
                {isLoading && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                        }}
                    >
                        <div className="tableSpinner">
                            <span className="spinner-border" role="status" aria-hidden="true"></span>
                        </div>
                    </div>
                )}
                <MDBDataTable
                    responsive
                    bordered
                    data={data}
                    paging={false}
                    exportToCSV={true}
                    searching={false}
                    displayEntries={false}
                    btn
                />
            </div>

            <div className='d-flex justify-content-between align-items-center mt-3 pagination-part'>
                <div className="showing-range">
                    Showing {startIndex} to {endIndex} of {total} entries
                </div>

                {/* Custom Pagination */}
                <div className="pagination d-flex gap-1 align-items-center">
                    <button className='btn btn-outline-primary' onClick={() => handlePageChange(currentPage - 1)} disabled={loading || currentPage === 1} >
                        Previous
                    </button>

                    {paginationRange[0] > 1 && (
                        <>
                            <button onClick={() => handlePageChange(1)} className={currentPage === 1 ? "active btn btn-primary" : "btn btn-outline-primary"}>1</button>
                            {paginationRange[0] > 2 && <span>...</span>}
                        </>
                    )}

                    {paginationRange.map((pageNum) => (
                        <button

                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={currentPage === pageNum ? "active btn btn-primary" : "btn btn-outline-primary"}
                        >
                            {pageNum}
                        </button>
                    ))}

                    {paginationRange[paginationRange.length - 1] < totalPage && (
                        <>
                            {paginationRange[paginationRange.length - 1] < totalPage - 1 && <span>...</span>}
                            <button onClick={() => handlePageChange(totalPage)} className={currentPage === totalPage ? "active btn btn-primary" : "btn btn-outline-primary"}>{totalPage}</button>
                        </>
                    )}

                    <button
                        className='btn btn-outline-primary'
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    )
}

export default DataTable;
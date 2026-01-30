import React, { useState } from "react"
import PropTypes from 'prop-types'
import { Link, useNavigate } from "react-router-dom";
import { LoadingBtn } from "components/Loading/Loading";
import { Row, Col, BreadcrumbItem, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Button } from "reactstrap"

const Breadcrumb = props => {
    const navigate = useNavigate();

    return (
        <Row className="align-items-center">
            <Col sm={6}>
                <div className="page-title-box">
                    <h4 className="font-size-18">{props.breadcrumbItem}</h4>
                    <ol className="breadcrumb mb-0">
                        {
                            (props.maintitle) ?
                                <>
                                    <BreadcrumbItem>
                                        <Link to="/#">{props.maintitle}</Link>
                                    </BreadcrumbItem>
                                </> : ''
                        }
                        <BreadcrumbItem>
                            <Link to={'/#'} onClick={() => navigate(-1)}>{props.title}</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            {props.breadcrumbItem}
                        </BreadcrumbItem>
                    </ol>
                </div>
            </Col>
            {
                props?.isBtn ?
                    <Col sm={6}>
                        <div className="float-end d-none d-md-block">
                            <Button
                                color="success"
                                className="waves-effect waves-light me-1 float-end"
                                onClick={() => { props?.handleSubmit() }}
                                disabled={props?.btnLoading || props?.disabled}
                            >
                                {props?.btnLoading ? <LoadingBtn /> : props?.btnTitle}
                            </Button>
                        </div>
                    </Col> : null
            }
        </Row>
    )
}

Breadcrumb.propTypes = {
    breadcrumbItem: PropTypes.string,
    title: PropTypes.string
}

export default Breadcrumb

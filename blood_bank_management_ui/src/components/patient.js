import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import { IconButton } from "@mui/material";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { setPopupState } from "../actions";
import CustomTable from "./customTable";
import "react-datepicker/dist/react-datepicker.css";


const Patient = () => {
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);

    const [donorFilters, setdonorFilters] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        blood_type: '',
        hname: '',
        received_quantity_ml: '',

    });
    const [allDonors, setAllDonors] = useState([])

    useEffect(() => {
        getAllDonors(donorFilters);
    }, [donorFilters]);

    const getAllDonors = (donorFilters, callback) => {
        axios.post('http://localhost:8080/api/patient/getPatients', { filters: donorFilters })
            .then((res) => {
                setAllDonors(res?.data?.message || []);
                callback && callback();
            })
            .catch(({ response }) => {
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
            });
    }

    const columns = [
        {
            name: 'First Name',
            type: 'text',
            dName: 'first_name',
        },
        {
            name: 'Last Name',
            type: 'text',
            dName: 'last_name',
        },
        {
            name: 'Gender',
            type: 'dropdown',
            dName: 'gender',
            options: ['Male', 'Female']
        },
        {
            name: 'Blood Type',
            type: 'dropdown',
            dName: 'blood_type',
            options: ['A+', 'B+', 'AB+', 'A-', 'B-', 'AB-', 'O+', 'O-']
        },
        {
            name: 'Blood Bank',
            type: 'text',
            dName: 'hname',
        },
        {
            name: 'Quantity',
            type: 'text',
            dName: 'received_quantity_ml',
        },
        {
            name: 'Date Of Birth',
            dName: 'dob',
            isDate: true,
        },
        {
            name: 'Received At',
            dName: 'dob',
            isDate: true,
        },
        {
            name: 'Country',
            type: 'text',
            dName: 'country',
        },
        {
            name: 'State',
            type: 'text',
            dName: 'state',
        },
        {
            name: 'City',
            type: 'text',
            dName: 'city',
        },
        {
            name: 'Locality',
            type: 'text',
            dName: 'locality',
        },
        {
            name: 'Created At',
            dName: 'created_at',
            isDate: true,
        }
    ]

    const applyFilters = (name, value) => {
        setdonorFilters({
            ...donorFilters,
            [name]: value
        })
    }

    return (
        <>
            <div className="pollutionContainer">
                <LoadingBar
                    color='#f11946'
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)} />
                <CustomTable
                    columns={columns}
                    title={"Patients"}
                    data={allDonors}
                    applyFilters={applyFilters}
                />
            </div>
        </>
    );
};

export default Patient;
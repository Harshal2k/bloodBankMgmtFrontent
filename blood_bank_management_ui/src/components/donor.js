import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Autocomplete, Stack, Grid } from "@mui/material";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { setPopupState } from "../actions";
import CustomTable from "./customTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const Donor = () => {
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteDonor, setDeleteDonor] = useState({ open: false, bname: '', bid: 0 });
    const [value, setValue] = useState(new Date('2014-08-18T21:11:54'));
    const [donorDetails, setdonorDetails] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        blood_type: '',
        phone: '',
        email: '',
        dob: null,
        created_at: new Date(),
        country: '',
        state: '',
        city: '',
        locality: '',

    });
    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);

    const [donorFilters, setdonorFilters] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        blood_type: '',
        phone: '',
        email: '',
        dob: '',
        created_at: new Date(),
        country: '',
        state: '',
        city: '',
        locality: '',

    });
    const [allBanks, setAllBanks] = useState([])

    useEffect(() => {
        getAllBanks(donorFilters);
    }, [donorFilters]);

    const getAllBanks = (donorFilters, callback) => {
        axios.post('http://localhost:8080/api/donor/getDonors', { filters: donorFilters })
            .then((res) => {
                setAllBanks(res?.data?.message || []);
                callback && callback();
            })
            .catch(({ response }) => {
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
            });
    }

    const hUpdate = (index) => {
        setEditMode(true);
        setdonorDetails(allBanks[index] || donorDetails);
        setOpen(true);
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
            name: 'Phone',
            type: 'text',
            dName: 'phone',
        },
        {
            name: 'Email',
            type: 'text',
            dName: 'email',
        },
        {
            name: 'Date Of Birth',
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
        },
        {
            name: 'Actions',
            type: 'custom',
            dName: 'donor_id',
            render: (index, data) => {
                return <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <IconButton onClick={() => { setDeleteDonor({ open: true, bname: allBanks[index]?.first_name, bid: allBanks[index]?.donor_id }) }}>
                        <FontAwesomeIcon icon={faTrash} className="actionIcons danger" />
                    </IconButton>
                    <IconButton onClick={() => { hUpdate(index) }}>
                        <FontAwesomeIcon icon={faPenToSquare} className="actionIcons safe" />
                    </IconButton>
                </div>
            }
        }
    ]

    const handleClose = () => {
        setOpen(!open);
    }

    const hChange = (e) => {
        const { name, value } = e.target
        setdonorDetails({
            ...donorDetails,
            [name]: value,
        })
    }
    const dropdownChange = (e, value, name) => {
        setdonorDetails({
            ...donorDetails,
            [name]: value,
        })
    }

    const applyFilters = (name, value) => {
        setdonorFilters({
            ...donorFilters,
            [name]: value
        })
    }

    const validations = () => {
        for (let i = 0; i < Object?.keys(donorDetails)?.length; i++) {
            let key = Object.keys(donorDetails)[i];
            if (donorDetails[key]?.length <= 0) {
                return true;
            }
        }

        if (donorDetails?.phone?.length < 10) {
            return true;
        }

        const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');

        if (!emailRegex?.test(donorDetails?.email)) {
            return true;
        }
        return false;
    }

    const hCreate = () => {
        setProgress(65);
        axios.post('http://localhost:8080/api/donor/createDonor', donorDetails)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllBanks(donorFilters, () => { setOpen(!open) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }

    const hUpdateBank = () => {
        setProgress(65);
        axios.patch(`http://localhost:8080/api/donor/updateDonor/${donorDetails?.donor_id}`, donorDetails)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllBanks(donorFilters, () => { setOpen(!open); setEditMode(false) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }

    const hDelete = () => {
        setProgress(65);
        axios.delete(`http://localhost:8080/api/bloodBank/deleteDonor/${deleteDonor?.bid}`)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllBanks(donorFilters, () => { setDeleteDonor({ open: false, bname: '', bid: 0 }) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <TextField
            className="formInputs"
            variant="outlined"
            label="Date"
            placeholder="Select date"
            value={value}
            inputRef={ref}
            onClick={onClick}
        />
    ));

    return (
        <>
            <div className="pollutionContainer">
                <LoadingBar
                    color='#f11946'
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)} />
                <CustomTable
                    columns={columns}
                    title={"Donors"}
                    btnText={"Add Donor"}
                    data={allBanks}
                    applyFilters={applyFilters}
                    hClick={() => { setOpen(!open) }} />
            </div>
            <Dialog
                open={open}
                scroll={"paper"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">{editMode ? 'Update' : 'Create'} Donor</DialogTitle>
                <DialogContent dividers={true} style={{ alignItems: 'center' }}>
                    <TextField className="formInputs" id="outlined-basic" value={donorDetails?.first_name} name="first_name" onChange={hChange} label="First Name" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={donorDetails?.last_name} name="last_name" onChange={hChange} label="Last Name" variant="outlined" />
                    <div style={{ width: '91%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Autocomplete style={{ width: 'inherit' }} variant="outlined" disabled={editMode} disablePortal value={donorDetails?.gender} onChange={(e, value) => { dropdownChange(e, value, "gender") }} name={"gender"} options={['Male', 'Female']}
                            renderInput={(params) => <TextField variant="outlined" className="formInputs" {...params} label="Gender" />}
                        />
                        <Autocomplete style={{ width: 'inherit', marginLeft: '1rem' }} disabled={editMode} variant="outlined" disablePortal value={donorDetails?.blood_type} onChange={(e, value) => { dropdownChange(e, value, "blood_type") }} name={"blood_type"} options={['A+', 'B+', 'AB+', 'A-', 'B-', 'AB-', 'O+', 'O-']}
                            renderInput={(params) => <TextField variant="outlined" className="formInputs" {...params} label="Blood Type" />}
                        />
                    </div>
                    <TextField className="formInputs" id="outlined-basic" disabled={editMode} value={donorDetails?.phone} name="phone" onChange={hChange} label="Phone" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={donorDetails?.email} name="email" onChange={hChange} label="Email" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={donorDetails?.country} name="country" onChange={hChange} label="Country" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={donorDetails?.state} name="state" onChange={hChange} label="State" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={donorDetails?.city} name="city" onChange={hChange} label="city" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={donorDetails?.locality} name="locality" onChange={hChange} label="locality" variant="outlined" />
                    <DatePicker
                        placeholder="Select date"
                        selected={new Date(donorDetails?.dob)}
                        onChange={(date) => setdonorDetails({ ...donorDetails, dob: date })}
                        maxDate={fiveYearsAgo}
                        customInput={<CustomInput />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={validations()} onClick={() => { editMode ? hUpdateBank() : hCreate() }}>{editMode ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteDonor?.open}
                scroll={"paper"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Delete Blood Bank</DialogTitle>
                <DialogContent dividers={false}>
                    <DialogContentText>
                        Are you sure you want to delete the Donor <span style={{ color: 'white', backgroundColor: '#e3970c', padding: '0 0.3rem', borderRadius: '0.5rem' }}>{deleteDonor?.bname}</span> ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => { setDeleteDonor({ open: false, bname: '' }) }}>Cancel</Button>
                    <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={hDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Donor;
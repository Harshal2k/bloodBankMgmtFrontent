
import React, { useEffect, useState } from "react";
import OtherDetails from "./weatherComponents/otherDetails";
import LoadingBar from 'react-top-loading-bar'
import { setPopupState } from "../actions";
import { useDispatch } from "react-redux";
import axios from "axios";
import CustomTable from "./customTable";

const Dashboard = () => {
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch();
    const [dashData, setDashData] = useState({});
    useEffect(() => {
        axios.get('http://localhost:8080/api/bloodBank/getDashboardData')
            .then(res => {
                setProgress(80);
                setDashData(res?.data?.message || {})
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                // getAllBanks(bankFilters, () => { setOpen(!open) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }, [])

    const columns = [
        {
            name: 'Blood Bank',
            dName: 'b_name',
        },
        {
            name: 'A+ (in ml)',
            dName: 'a_positive',
        },
        {
            name: 'A- (in ml)',
            dName: 'a_negative',
        },
        {
            name: 'B+ (in ml)',
            dName: 'b_positive',
        },
        {
            name: 'B- (in ml)',
            dName: 'b_negative',
        },
        {
            name: 'AB+ (in ml)',
            dName: 'ab_positive',
        },
        {
            name: 'AB- (in ml)',
            dName: 'ab_negative',
        },
        {
            name: 'O+ (in ml)',
            dName: 'o_positive',
        },
        {
            name: 'O- (in ml)',
            dName: 'o_negative',
        }
    ]

    return (
        <div className="weather-details-cont">
            <div className="other-details-cont">
                <OtherDetails header="DONORS" elements={{ value: dashData?.donors, desc: 'Total Donors' }} />
                <OtherDetails header="DONATIONS" elements={{ value: dashData?.donations, desc: 'Total Donations' }} />
                <OtherDetails header="BLOOD BANKS" elements={{ value: dashData?.bloodBanks, desc: 'Total Banks Onboarded' }} />
                <OtherDetails header="HOSPITALS" elements={{ value: dashData?.hospitals, desc: 'Total Hospitals Onboarded' }} />
                <OtherDetails header="PATIENTS" elements={{ value: dashData?.patients, desc: 'Total Patients Reached' }} />
            </div>
            <div style={{ padding: '1rem' }} className="weather-div">
                <h2 className="info-h1">Blood Types Available</h2>
            </div>
            <div className="other-details-cont">
                <OtherDetails style={{ minWidth: '9rem' }} header="A+" elements={{ value: dashData?.bloodQuantities?.["A+"] || 0, desc: 'in ml' }} />
                <OtherDetails style={{ minWidth: '9rem' }} header="A-" elements={{ value: dashData?.bloodQuantities?.["A-"] || 0, desc: 'in ml' }} />
                <OtherDetails style={{ minWidth: '9rem' }} header="B+" elements={{ value: dashData?.bloodQuantities?.["B+"] || 0, desc: 'in ml' }} />
                <OtherDetails style={{ minWidth: '9rem' }} header="B-" elements={{ value: dashData?.bloodQuantities?.["B-"] || 0, desc: 'in ml' }} />
                <OtherDetails style={{ minWidth: '9rem' }} header="AB+" elements={{ value: dashData?.bloodQuantities?.["AB+"] || 0, desc: 'in ml' }} />
                <OtherDetails style={{ minWidth: '9rem' }} header="AB-" elements={{ value: dashData?.bloodQuantities?.["AB-"] || 0, desc: 'in ml' }} />
                <OtherDetails style={{ minWidth: '9rem' }} header="O+" elements={{ value: dashData?.bloodQuantities?.["O+"] || 0, desc: 'in ml' }} />
                <OtherDetails style={{ minWidth: '9rem' }} header="O-" elements={{ value: dashData?.bloodQuantities?.["O-"] || 0, desc: 'in ml' }} />
            </div>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)} />
            <CustomTable
                columns={columns}
                title={"Blood Available In Blood Banks"}
                data={dashData?.bloodInBloodBank}
                hClick={() => { }} />
        </div>
    );
}

export default Dashboard;
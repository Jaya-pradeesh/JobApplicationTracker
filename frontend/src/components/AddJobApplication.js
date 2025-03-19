import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addJobApplication } from '../store/jobApplicationSlice';

const AddJobApplication = () => {
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [status, setStatus] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addJobApplication({ company, position, status, appliedDate: new Date() }));
        setCompany('');
        setPosition('');
        setStatus('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
            <input type="text" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
            <input type="text" placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
            <button type="submit">Add Job Application</button>
        </form>
    );
};

export default AddJobApplication;
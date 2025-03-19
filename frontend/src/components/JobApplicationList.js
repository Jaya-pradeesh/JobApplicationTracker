import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobApplications } from './store/jobApplicationSlice';

const JobApplicationList = () => {
    const jobApplications = useSelector((state) => state.jobApplications);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchJobApplications());
    }, [dispatch]);

    return (
        <div>
            <h2>Job Applications</h2>
            <ul>
                {jobApplications.map((job) => (
                    <li key={job.id}>
                        {job.company} - {job.position} ({job.status})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobApplicationList;
import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const Progress = ({ current, total }) => {
    const percentage = (current / total) * 100;

    return (
        <div className="my-4">
            <ProgressBar now={percentage} label={`${current}/${total}`} />
        </div>
    );
};

export default Progress;

import React from 'react';
import Spinner from './Spinner';
import './Loader.css';

export default () => {
    return <div className="loader">
        <Spinner />
    </div>;
}
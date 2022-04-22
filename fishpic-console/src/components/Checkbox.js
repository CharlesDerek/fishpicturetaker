import React from "react";
import { InputGroup } from 'react-bootstrap';

const Checkbox = ({label, name, value, onChange}) => {
    const handleCheckboxChange = onChange => e => {
        const { name, checked } = e.target;
        onChange(name, checked);
    };
   return <>
    <InputGroup className="mb-3">
        <InputGroup.Prepend>
            <InputGroup.Checkbox id={name} name={name} checked={value} onChange={handleCheckboxChange(onChange)}/>
        </InputGroup.Prepend>
        <InputGroup.Text htmlFor={name}>
            <label htmlFor={name}>{label}</label>
        </InputGroup.Text>
  </InputGroup>
   </>;
}

export default Checkbox;
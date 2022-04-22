import React, { Component } from "react";
import { InputGroup, Form, FormControl, Button } from 'react-bootstrap';
import { upsertAnnotation, getAllSpecies } from '../lib/api';
import Loader from '../components/Loader';
import Checkbox from '../components/Checkbox';
import './AnnotationFormContainer.css';

export default class AnnotationFormContainer extends Component {
    constructor(props) {
        super(props);

        const { 
            category = '',
            speciesName = '',
            speciesId = null,
            confidence,
            isProfileImageCandidate = false,
            notes = ''
        } = this.props.annotation || {};

        this.state = {
            loading: false,
            allSpecies: [],
            category,
            speciesName,
            speciesId,
            confidence: confidence || 'high',
            isProfileImageCandidate,
            notes: notes || ''
        };
    }

    async componentWillMount() {
        const allSpecies = await getAllSpecies();
        this.setState({ allSpecies });
        const species = allSpecies.find(x => x.id === this.state.speciesId);
        if (species !== undefined) {
            this.setState({ speciesName: species.commonName })
        }
    }

    fieldChange = (name, value) => {
        this.setState({ [name]: value });
    }

    saveAnnotation = async (e) => {
        e.preventDefault();

        let { loading, allSpecies, ...annotation } = this.state;
        if (annotation.category === "fish") {
            const species = this.findSpecies(annotation.speciesName);
            annotation.speciesId = species === undefined ? null : species.id;
            if (species !== undefined) {
                // In case the common name wasn't use, update it to the common name.
                annotation.speciesName = species.commonName;
                this.setState({ speciesName: species.commonName })
            }
        } else {
            annotation.speciesName = null;
            annotation.speciesId = null;
            annotation.confidence = null;
        }

        this.setState({ loading: true });
        try {
            await upsertAnnotation(this.props.imageId, annotation);
        } catch (error) {
            console.log(error);
            alert(error);
        } finally {
            this.setState({ loading: false });
        }
    }

    findSpecies = name => {
        return this.state.allSpecies.find(x => x.commonName === name)
            || this.state.allSpecies.find(x => x.scientificName === name)
            || this.state.allSpecies.find(x => x.otherNames !== null && x.otherNames.indexOf(name) !== -1);
    }

    render() {
        const commonNames = this.state.allSpecies.map(({ commonName }) => commonName);
        const scientificNames = this.state.allSpecies.map(({ scientificName }) => scientificName);
        const otherNames = this.state.allSpecies
            .map(({ otherNames }) => otherNames)
            .reduce((previous, current) => previous.concat(current), []);
        const names = Array.from(new Set(commonNames.concat(scientificNames).concat(otherNames))).sort();
        return (
            <form className='annotationForm'>
                <label>Category</label>
                <RadioButton label="Fish" name="category" fieldValue={this.state.category} value="fish" onChange={this.fieldChange} required={true} />
                {this.state.category === "fish" && <>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Species:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            type="text"
                            name="speciesName"
                            value={this.state.speciesName}
                            list="speciesCommonNames"
                            onChange={handleTextChange(this.fieldChange)}
                            placeholder="Common name or scientific name"
                            aria-label="Species"
                        />
                        <datalist id="speciesCommonNames">
                            {names.map(x => <option key={x} value={x} />)} 
                        </datalist>
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Confidence:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control 
                            as="select"
                            name="confidence"
                            value={this.state.confidence}
                            onChange={handleTextChange(this.fieldChange)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </Form.Control>
                    </InputGroup>
                </>}
                <RadioButton label="No Fish" name="category" fieldValue={this.state.category} value="noFish" onChange={this.fieldChange} required={true} />
                <RadioButton label="Multiple Fish" name="category" fieldValue={this.state.category} value="multipleFish" onChange={this.fieldChange} required={true} />
                <RadioButton label="Unknown Fish" name="category" fieldValue={this.state.category} value="unknownFish" onChange={this.fieldChange} required={true} />
                <RadioButton label="Poor Quality" name="category" fieldValue={this.state.category} value="poorImageQuality" onChange={this.fieldChange} required={true} />
                <RadioButton label="Fish Tank" name="category" fieldValue={this.state.category} value="fishTank" onChange={this.fieldChange} required={true} />
                <RadioButton label="Copyright Material" name="category" fieldValue={this.state.category} value="isCopyrightMaterial" onChange={this.fieldChange} required={true} />
                <hr />
                <Checkbox label="Is Profile Image Candidate" name="isProfileImageCandidate" value={this.state.isProfileImageCandidate} onChange={this.fieldChange} />
                <TextArea label="Notes" name="notes" value={this.state.notes} onChange={this.fieldChange} />
                <Button variant="primary" type="submit" onClick={this.saveAnnotation}>Save</Button>
                {this.state.loading && <Loader />}
            </form>
        );
    }
}

const handleTextChange = onChange => e => {
    const { name, value } = e.target;
    onChange(name, value);
}

const RadioButton = ({label, name, fieldValue, value, onChange, required=false}) => {
    const handleRadioChange = onChange => e => {
        const { name } = e.target;
        onChange(name, value);
    };
    return <>
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
                <InputGroup.Radio id={value} name={name} checked={fieldValue === value} onChange={handleRadioChange(onChange)} required={required}/>
            </InputGroup.Prepend>
            <InputGroup.Text>
                <label htmlFor={value}>{label}</label>
            </InputGroup.Text>
        </InputGroup>
    </>;
}

const TextArea = ({label, name, value, onChange}) => {
    return <>
        <label htmlFor={name}>{label}</label>
        <div>
            <textarea id={name} name={name} onChange={handleTextChange(onChange)} value={value}></textarea>
        </div>
    </>;
}

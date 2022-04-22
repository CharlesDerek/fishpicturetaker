import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { getImages } from '../lib/api';
import Loader from '../components/Loader';
import "./Image.css";
import "./ImageContainer.css";
import AnnotationFormContainer from "./AnnotationFormContainer";
import { getUserId } from "../lib/auth";

export default class ImageContainer extends Component {
    constructor(props) {
        super(props);
        this.parentPath = this.props.match.url.replace('/' + props.match.params.id, "");
        this.state = {
            loading: true,
            images: [],
            image: null,
            userId: null,
        }
    }

    parentPath = null;

    async componentWillMount() {
        await this.loadImages(this.props.match.params.id);
    }

    async componentWillReceiveProps(nextProps) {
        await this.loadImages(nextProps.match.params.id);
    }

    async loadImages(imageId) {
        this.setState({ loading: true });
        try {
            const images = await getImages();
            let filteredImages = images;
            if (this.parentPath.endsWith('annotatable')) {
                filteredImages = images.filter(x => x.userShouldAnnotate);
            }
            const image = filteredImages.find(x => x.id === imageId);
            const userId = await getUserId();
            this.setState({ images: filteredImages, image, userId });
        } finally {
            this.setState({ loading: false });
        }
    }

    getPreviousImageId() {
        const index = this.getImageIndex();
        if (index === 0) {
            return null;
        } else {
            return this.state.images[index - 1].id;
        }
    }

    getNextImageId() {
        const index = this.getImageIndex();
        if (this.state.images.length === (index + 1)) {
            return null;
        } else {
            return this.state.images[index + 1].id;
        }
    }

    getImageIndex = () => {
        return this.state.images.map(x => x.id).indexOf(this.state.image.id);
    }

    render() {
        const { loading, image } = this.state;
        if (loading) {
            return <Loader />;
        } else if (image === null) {
            return <p>Image not found.</p>
        } else {
            const annotation = image.userIdsToAnnotations === null ? undefined : image.userIdsToAnnotations[this.state.userId];
            return <div className="imageContainer">
                <section className='metadata'>
                    <Attribute label="Image Id" value={image.id} />
                    <Attribute label="User Id" value={image.userId} />
                    <Attribute label="Annotatable" value={image.annotatable} />
                    <Attribute label="Uploaded Date" value={image.uploadedDate} />
                    <Attribute label="Device Classification Results" value={JSON.stringify(image.classificationResults)} />
                    <Attribute label="App Version" value={image.appVersion} />
                    <Attribute label="Created in App" value={image.createdInApp} />
                    <Attribute label="Device Model" value={image.deviceModel} />
                    <Attribute label="Image Model" value={image.imageModel} />
                    <Attribute label="Is Test Data" value={image.isTestData} />
                </section>
                <section className='middle'>
                    <Card key={image.id} className="image">
                        <Card.Img variant="top" alt={image.id} src={image.url} />
                        <Card.Body>
                        </Card.Body>
                    </Card>
                    <div>
                        <Link to={this.parentPath + '/' + this.getPreviousImageId()}>
                            <Button disabled={this.getPreviousImageId() === null}>⬅</Button>
                        </Link>
                        <Link to={this.parentPath}>
                            <Button>Overview</Button>
                        </Link>
                        <Link to={this.parentPath + '/' + this.getNextImageId()}>
                            <Button disabled={this.getNextImageId() === null}>➡</Button>
                        </Link>
                    </div>
                </section>

                {image.annotatable && <AnnotationFormContainer imageId={image.id} annotation={annotation} />}
            </div>;
        }
    }
}

const Attribute = ({label, value}) => {
    return <Card.Text><b>{label}:</b> {value === undefined || value === null ? "" : value.toString()}</Card.Text>;
}
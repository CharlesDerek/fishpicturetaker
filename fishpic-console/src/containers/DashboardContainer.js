import React, { Component } from "react";
import { getImages, deleteTestImages, getAllSpecies } from '../lib/api';
import Loader from '../components/Loader';
import * as fileDownload from 'js-file-download';
import { hasValue, anyField } from '../lib/utils';

export default class DashboardContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            loading: false,
        };
        console.log(this.state);
    }

    async componentWillMount() {
        await this.loadImages();
    }

    loadImages = async () => {
        this.setState({ loading: true });
        const images = await getImages();
        this.setState({ images, loading: false });
    }

    handleDeleteTestImagesClick = async () => {
        this.setState({ loading: true });
        await deleteTestImages();
        await this.loadImages();
        this.setState({ loading: false });
    }

    handleDownloadSpeciesJson = async () => {
        this.setState({ loading: true });
        const allSpecies = await getAllSpecies();
        const supportedSpecies = allSpecies.filter(x => hasValue(x.supportedInAppVersion));
        fileDownload(JSON.stringify(supportedSpecies), 'fish.json');
        this.setState({ loading: false });
    }

    render() {
        const usableDatasetImages = this.state.images.filter(x => anyField(x.userIdsToAnnotations, y => y.category === 'fish'));
        console.log(usableDatasetImages);
        return this.state.loading
            ? <Loader />
            : <>
                <p>Usable dataset images: {usableDatasetImages.length}</p>
                <button onClick={this.handleDeleteTestImagesClick}>Delete Test Images</button>
                <button onClick={this.handleDownloadSpeciesJson}>Download Species JSON file</button>
              </>;
    }
}
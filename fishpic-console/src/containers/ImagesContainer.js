import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import { getImages, getImageUrl } from '../lib/api';
import Checkbox from '../components/Checkbox';
import "./Image.css";
import "./ImagesContainer.css";
import { hasValue, anyField } from "../lib/utils";
import { getUserId } from "../lib/auth";

export default class ImagesContainer extends Component {
  constructor(props) {
    super(props);

    this.url = this.props.match.url;
    this.state = {
      isLoading: false,
      images: [],
      isProfileImageCandidateFilter: false,
      userId: null,
    };
  }

  url = null;

  async componentDidMount() {
    await this.loadImages();
    const userId = await getUserId();
    this.setState({ userId });
  }

  async componentWillReceiveProps(nextProps) {
    this.url = nextProps.match.url;
    await this.loadImages();
  }

  loadImages = async () => {
    try {
      this.setState({ isLoading: true });
      const images = await getImages();
      let filteredImages = images;
      if (this.url.startsWith("/images/annotatable")) {
        filteredImages = images.filter(x => x.userShouldAnnotate);
      }
      const updatedImages = await Promise.all(filteredImages.map(async x => ({ ...x, url: await getImageUrl(x.arn)})));
      this.setState({ images: updatedImages });
    } catch (e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }

  fieldChange = (name, value) => {
    this.setState({ [name]: value });
  }

  render() {
    const filteredImages = this.state.images.filter(x => {
      return !this.state.isProfileImageCandidateFilter || anyField(x.userIdsToAnnotations, y => y.isProfileImageCandidate);
    })
    return (
      <div className="images">
        <h1>Images ({this.state.images.length})</h1>
        <section className='settings'>
          <Checkbox label="Is Profile Image Candidate" name="isProfileImageCandidateFilter" value={this.state.isProfileImageCandidateFilter} onChange={this.fieldChange} />
        </section>
        <Container>
          {!this.state.isLoading && this.renderImagesList(filteredImages)}
        </Container>
      </div>
    );
  }

  renderImagesList(images) {
    return images.map((image, i) => {
        const annotation = hasValue(image.userIdsToAnnotations) && image.userIdsToAnnotations[this.state.userId];
        const speciesName = annotation === undefined ? null : annotation.speciesName;
        return <Link key={image.id} to={this.url + '/' + image.id}>
            <Card className="image" title={speciesName}>
            <Card.Img variant="top" alt={image.id} src={image.url} />
            </Card>
        </Link>
      });
  }
}
import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
 apiKey: '9693f9eec2fe42719300cf4c29766c57'
});

const particlesOptions = {
  particles: {
    number: {
      value: 75,
      density: {
        enable: true,
        value_area: 750
      }
    }
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: [],
      route: "signin",
      isSignedIn: false
    }
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  calcFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    return [{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }]
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
    console.log(box);
  }

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calcFaceLocation(response)))
    .catch(err => console.log(err));
}

onRouteChange = (route) => {
  route === "home" ? this.setState({isSignedIn: true}) : this.setState({isSignedIn: false});
  this.setState({route: route});

}

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
          <Particles className='particles'
            params={particlesOptions} 
          />
          <Navigation 
            onRouteChange={this.onRouteChange} 
            isSignedIn={isSignedIn}
            />
          { route === "home"
            ? <div>
                <Logo />
                <Rank />
                <ImageLinkForm 
                  onInputChange={this.onInputChange} 
                  onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition 
                  boxes={box}
                  imageUrl={imageUrl}
                />
              </div>
            : (route === "signin"
                  ? <SignIn onRouteChange={this.onRouteChange}/>
                  : <Register onRouteChange={this.onRouteChange}/>
              )
          }
      </div>
      );
    }
  }

export default App;

import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

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

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  calcFaceLocation = (response) => {
      const faces = response.outputs[0].data.regions.map( (item) => {
      const clarifaiFace = item.region_info.bounding_box;
      const image = document.getElementById('input-image');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    })
    return faces;
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
    console.log("boxes", boxes);
  }

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              console.log('count', count)
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calcFaceLocation(response))
      })
    .catch(err => console.log(err));
}

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if (route === 'home') {
    this.setState({isSignedIn: true}) 
  }
  this.setState({route: route});

}

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    const { name, entries} = this.state.user;
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
                <Rank name={name} entries={entries}/>
                <ImageLinkForm 
                  onInputChange={this.onInputChange} 
                  onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition 
                  boxes={boxes}
                  imageUrl={imageUrl}
                />
              </div>
            : (route === "signin" || route === "signout"
                  ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                  : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
          }
      </div>
      );
    }
  }

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from "jquery";
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Panel, Popover, Modal, Button, OverlayTrigger, Table, Glyphicon } from 'react-bootstrap';
import AnyChart from 'anychart-react';
import anychart from 'anychart';
import { Fetch } from 'react-request';
import axios from 'axios';
import setAuthorizationToken from './csrftoken';
import jwt from 'jsonwebtoken';
import LoadingScreen from 'react-loading-screen';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
let cadastre_val = '';

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$('#dashboard-div').hide();
const header = (
  <nav className="navbar navbar-inverse">
    <div className="container-fluid">
      <div className="navbar-header" style={{width:100+'%'}}>
        <a className="navbar-brand" href="#" style={{fontSize:35+'px'}, {color: 'white'}}>
          Egistic
        </a>
        <p style={{paddingRight:15+'px'}} className="navbar-text navbar-right">Signed in as <a href="#" className="navbar-link">Mark Otto</a></p>
      </div>
    </div>
  </nav>
);
ReactDOM.render(header, document.getElementById('header_div'));

class Login extends React.Component {
  constructor () {
    super();
    this.state = {
      email: '',
      password: ''
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleEmailChange (evt) {
    this.setState({ email: evt.target.value });
  }
  
  handlePasswordChange (evt) {
    this.setState({ password: evt.target.value });
  }

  handleSubmit(evt){
    evt.preventDefault();
    var msg = {
      "username": this.state['email'],
      "password": this.state['password']
    }
    var csrftoken = getCookie('csrftoken');
    axios({
      method: 'post',
      url: 'http://178.91.253.19:8084/api/v1/signin/',
      data: {
        username: this.state['email'],
        password: this.state['password']
      },
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      }
    })
    .then(function (response) {
      console.log("POST: ");
      console.log(response);
      const token = response.headers['X-CSRFToken'];
      // localStorage.setItem('jwtToken', token);
      // setAuthorizationToken(token);
      axios.defaults.headers.common = {'Authorization': "bearer " + token}
      // console.log(jwt.decode(token))
      if(response.data.status == 200)
      {
        cadastre_val = response.data.data['username'];
        startLoadingScreen();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render () {
    return (
        <div className="panel reg-panel shadow-lg panel-div">
          <div className="panel-heading"><h4>Войти</h4></div>
          <div className="panel-body">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="text" name="email" onChange={this.handleEmailChange} className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input onChange={this.handlePasswordChange} type="password" name="password" className="form-control" id="password" placeholder="Password" />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
    );
  }
}
ReactDOM.render(<Login />, document.getElementById('login-panel'));

class Register extends React.Component {
  constructor () {
    super();
    this.state = {
      email: '',
      password: '',
      name: '',
      surname: '',
      company: '',
      kadastr: '',
      reppass:''
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSurnameChange = this.handleSurnameChange.bind(this);
    this.handleCompanyChange = this.handleCompanyChange.bind(this);
    this.handleKadastrChange = this.handleKadastrChange.bind(this);
    this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleEmailChange (evt) {
    this.setState({ email: evt.target.value });
  }
  
  handlePasswordChange (evt) {
    this.setState({ password: evt.target.value });
  }

  handleNameChange (evt){
    this.setState({ name: evt.target.value});
  }

  handleSurnameChange (evt){
    this.setState({ surname: evt.target.value});
  }

  handleCompanyChange (evt){
    this.setState({ company: evt.target.value});
  }

  handleKadastrChange (evt){
    this.setState({ kadastr: evt.target.value});
  }

  handleRepeatPasswordChange(evt){
    this.setState({reppass: evt.target.value});
  }

  handleSubmit(evt){
    evt.preventDefault();
    console.log(evt.target);
    console.log(this.state);

    axios.post('http://178.91.253.19:8084/api/v1/signup/', {
      "username": this.state['kadastr'], //should be unique
      "email": this.state['email'], //should be unique
      "password": this.state['password']
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render () {
    return (
        <div className="panel reg-panel shadow-lg panel-div">
          <div className="panel-heading"><h4>Регистрация</h4></div>
          <div className="panel-body">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                  <label htmlFor="exampleInputName1">Name</label>
                  <input type="text" name="name" onChange={this.handleNameChange} className="form-control" id="req-name" aria-describedby="emailHelp" placeholder="Enter name" />
              </div>
              <div className="form-group">
                  <label htmlFor="exampleInputSurname1">Surname</label>
                  <input type="text" name="surname" onChange={this.handleSurnameChange} className="form-control" id="req-surname" aria-describedby="emailHelp" placeholder="Enter surname" />
              </div>
              <div className="form-group">
                  <label htmlFor="exampleInputName1">Company</label>
                  <input type="text" name="company" onChange={this.handleCompanyChange} className="form-control" id="req-company" aria-describedby="emailHelp" placeholder="Enter company name" />
              </div>
              <div className="form-group">
                  <label htmlFor="exampleInputSurname1">Kadastr number</label>
                  <input type="text" name="kadastr" onChange={this.handleKadastrChange} className="form-control" id="req-kadastr" aria-describedby="emailHelp" placeholder="Enter kadastr number" />
              </div>
              <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input type="email" name="email" onChange={this.handleEmailChange} className="form-control" id="req-email" aria-describedby="emailHelp" placeholder="Enter email" />
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Password</label>
                  <input onChange={this.handlePasswordChange} type="password" name="password" className="form-control" id="req-password" placeholder="Password" />
              </div>
              <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Repeat password</label>
                  <input onChange={this.handleRepeatPasswordChange} type="password" name="password" className="form-control" id="req-rep-password" placeholder="Repeat Password" />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
    );
  }
}
ReactDOM.render(<Register />, document.getElementById('register-panel'));

class NewOrder extends React.Component{
  constructor () {
    super();
    this.state = {
      regionN: '',
      showModal: false,
      kadastr: '',
      date:''
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleKadastrChange = this.handleKadastrChange.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleRegionN(evt){
    this.setState({regionN:evt.target.regionN});
  }
  handleClose(){
    this.setState({showModal: false});
  }
  handleShow(){
    this.setState({showModal: true});
  }
  handleKadastrChange(evt){
    this.setState({kadastr: evt.target.value});
  }
  handleDate(evt){
    this.setState({date: evt.target.value});
  }
  handleSubmit(){
  	axios.post('http://178.91.253.19:8084/api/v1/requests/', {
        cadastre: this.state['kadastr'],
        'Access-Control-Allow-Credentials': true
      })
      .then(function (response) {
        console.log(response.data);
        if(response.data.status == 201)
        {
          this.setState({showModal: false});
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render () {
    const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );

    return (
    <div>
    <button onClick={this.handleShow} id="new-order-btn" type="button" className="btn btn-success"><h2>ADD</h2></button>

    <Modal show={this.state.showModal} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
            <label htmlFor="exampleInputName1">Kadastr number</label>
            <input type="text" name="name" onChange={this.handleKadastrChange} className="form-control" id="req-name" aria-describedby="emailHelp" placeholder="Enter kadastr number" />
        </div>
        <div className="form-group">
            <label htmlFor="exampleInputName1">Region number</label>
            <input type="text" name="name" onChange={this.handleRegionN} className="form-control" id="req-name" aria-describedby="emailHelp" placeholder="Enter region number" />
        </div>
        <div className="form-group">
            <label htmlFor="exampleInputName1">Region number</label>
            <input type="date" name="name" onChange={this.handleDate} className="form-control" id="req-name" aria-describedby="emailHelp" placeholder="Enter preffered date" />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="success" onClick={this.handleSubmit}>Send</Button>
        <Button bsStyle="danger" onClick={this.handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
    </div>
    );
  }
}

class WeatherCard extends React.Component{
  constructor () {
    super();
    this.state = {
      temp: ''
    };
    //this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  render () {
    return (
    <div id="weather" className="panel z-depth-5 rounded">
      <img src={"/sunny.png"}/>
      <h2>25&ordm;C</h2>
    </div>
    );
  }
}

class MapCard extends React.Component{
  constructor () {
    super();
    this.state = {
      map: ''
    };
    //this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  render () {
    return (
    <div id="map">

    </div>
    );
  }
}

class PassportCard extends React.Component{

  constructor () {
      super();
      this.state = {
        orders_rows:(<tr><td>Press "refresh" to get order list</td></tr>),
        data:[]
      };
      this.handleTableOrder = this.handleTableOrder.bind(this);
      this.handleRefresh = this.handleRefresh.bind(this);
      this.renderOrderRows = this.renderOrderRows.bind(this);
  }

  renderOrderRows(orderRow, index){
    console.log(index);
    return(
      <tr key={index}>
        <td>{orderRow.request_date}</td>
        <td>{orderRow.status}</td>
      </tr>
    );
  }

  handleTableOrder(){
    console.log("Booo!");
  }

  handleRefresh(){
    this.setState({orders_rows: (<tr><td>Loading ...</td></tr>)});
    var csrftoken = getCookie('csrftoken');
    console.log("GET Requests: ");
    axios({
      method: 'get',
      url: 'http://178.91.253.19:8084/api/v1/requests/',
      headers:{
        'X-CSRFToken': csrftoken
      }
    })
    .then(function (response) {
      console.log(response.data.data); 
      // data = response.data.data;
      this.setState({orders_rows:(
          response.data.data.map(this.renderOrderRows)
        )});
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
    });
  }

  render(){
    return(
      <Panel bsStyle="primary" style={{height: 100+'%'}}>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Region #4 <Button onClick={this.handleRefresh} style={{float:'right'}} bsStyle="warning"><Glyphicon glyph='refresh' /></Button></Panel.Title>
          <p>Kadastr number: {cadastre_val}</p>
        </Panel.Heading>
        <Panel.Body>
          <Table hover>
            <thead>
              <tr>
                <th style={{width: 80+'%'}}>Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="add_table_here">
                {this.state.orders_rows}
            </tbody>
          </Table>
        </Panel.Body>
      </Panel>
    )
  }
}

const OrderRow = (props) => {
  return (
    <tr>
      <td>
        { props.data.request_date }
      </td>
      <td>
        { props.data.status }
      </td>
    </tr>
  );
}

//{[{x:"Strong", value: 6566}, {x:"Medium", value: 5856}, {x:"Small", value: 7256}]}
let stage = anychart.graphics.create();
let chart = anychart.pie([{x:"Strong", value: 6566}, {x:"Medium", value: 5856}, {x:"Small", value: 7256}]);
var legend = chart.legend();
legend.positionMode("inside");
legend.itemsLayout("vertical-expandable");
legend.position('top');
legend.align('right');

class ChartCard extends React.Component{
    constructor () {
      super();
      this.state = {
      };
      //this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  render(){
    return(
      <Panel bsStyle="primary" style={{height: 100+'%'}, {width: 100+'%'}}>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Graph of the Region</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <AnyChart id="chart-itself" instance={stage} charts={[chart]} />
        </Panel.Body>
      </Panel>
    )
  }
}

function startDasboard(){

  var csrftoken = getCookie('csrftoken');
  console.log("GET: ");
  axios({
    method: 'get',
    url: 'http://178.91.253.19:8084/api/v1/signin/',
    headers:{
      'X-CSRFToken': csrftoken
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
  });

  $('#dashboard-div').show();
  $("#loading-div").hide();
  ReactDOM.render(<NewOrder />, document.getElementById('new-order'));
  ReactDOM.render(<WeatherCard />, document.getElementById('weather-div'));
  ReactDOM.render(<MapCard />, document.getElementById('map-div'));
  ReactDOM.render(<SimpleExample/>, document.getElementById('map'));
  ReactDOM.render(<PassportCard/>, document.getElementById('passport-div'));
  ReactDOM.render(<ChartCard/>, document.getElementById('graph-div'));
}

function startLoadingScreen(){
  $("#loading-divd").show();
  $('#login-reg').hide();
  ReactDOM.render(<LoadingView/>, document.getElementById('loading-div'));
  //$.delay( 3000 );
  window.setTimeout(pauseFunction,3000);
}

function pauseFunction(){
  startDasboard();
}

class LoadingView extends React.Component{
    constructor () {
      super();
      this.state = {
      };
      //this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  render(){
    return(
      <LoadingScreen
        loading={true}
        bgColor='#f1f1f1'
        spinnerColor='#9ee5f8'
        textColor='#676767'
        logoSrc='/logo.png'
        text='We are loging you in ...'
      >
      </LoadingScreen>
    )
  }
}

class SimpleExample extends React.Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    )
  }
}
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from "jquery";
// ReactDOM.render(
//   <h1>Hello, world!</h1>,
//   document.getElementById('root')
// );
const header = (
	<nav className="navbar navbar-default">
	  <div className="container-fluid">
	    <h1>Welcome to EGISTIC</h1>
	  </div>
	</nav>
	);
const register_card = (
	<div className="card shadow-sm p-3 mb-5 bg-white rounded" id="registration_card">
	  <div className="card-body">
	    This is some text within a card body.
	  </div>
	</div>
	);
ReactDOM.render(header, document.getElementById('header_div'));
ReactDOM.render(register_card, document.getElementById('registration_div'));
// var createReactClass = require('create-react-class');

// var register_card = createReactClass({
//   render: function() {
//     return (
//       <div className="card">
//         <div className="card-body">
//           This is some text within a card body.
//         </div>
//       </div>
//     );
//   }
// });
// ReactDOM.render(register_card, document.getElementById('root'));

// function tick() {
//   const element = (
//     <div>
//       <h1>Hello, world!</h1>
//       <h2>It is {new Date().toLocaleTimeString()}.</h2>
//     </div>
//   );
//   ReactDOM.render(element, document.getElementById('root'));
// }
// setInterval(tick, 1000);
import axios from 'axios';

export default function setAuthorizationToken(token){
  if(token){
    axios.defaults.headers['X-CSRFToken'] = token;
  } else {
    delete axios.defaults.headers['X-CSRFToken'];
  }
}
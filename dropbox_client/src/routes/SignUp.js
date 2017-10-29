import React, { Component } from 'react';
import logo from '../public/dropbox_logo_panel.svg';
import image_login from '../public/dropbox_login_image.png'
import '../App.css';
import { setFirstName, setLastName, setUsername, setPassword, login, signup } from "../actions/userActions";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';



class SignUp extends Component {

   componentWillMount() {

      console.log('Component WILL MOUNT!')

   }

  componentDidUpdate(prevProps, prevState) {

      console.log('Component DID UPDATE!')
      if(this.props.isSignup){
        console.log('Pushing to the page ')
        this.props.history.push('/');
      }
      
   }

  render() {
    
   	console.log('SignUp ' + this.props.isSignup);
    return (
      <div>
        <header className="App-header App">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        
                <div className="container container col-md-12 login-body row"> 

                      <div className=" col-md-6">
                          <img src={image_login} className="login_img"  />  
                      </div>


                      <div className="col-md-6">

                            <div className="col-md-8 row">
                                  <div className="col-md-6 divStyle">
                                    <div className="panel-title ">Create an Account</div>                        
                                  </div>

                                  <div className="col-md-4 sinup-btn">
                                        <Link to="/" href="#">Sign In</Link>
                                  </div>
                            </div>      

                            <div >
                              
                              
                              
                                  <div className="form-group row">
                                      
                                      <div className="col-sm-6">
                                        <input type="text" className="form-control" name="first_name" id="first_name" placeholder="First Name" onChange={() =>this.props.dispatch(this.props.setFirstName(document.getElementById('first_name').value))}></input>
                                      </div>
                                  </div>

                                  <div className="form-group row">
                                      
                                      <div className="col-sm-6">
                                        <input type="text" className="form-control" name="last_name" id="last_name" placeholder="Last Name" onChange={() =>this.props.dispatch(this.props.setLastName(document.getElementById('last_name').value))}></input>
                                      </div>
                                  </div>

                                  <div className="form-group row">
                                      
                                      <div className="col-sm-6">
                                        <input type="email" className="form-control" name="username" id="username" placeholder="Email" onChange={() =>this.props.dispatch(this.props.setUsername(document.getElementById('username').value))}></input>
                                      </div>
                                  </div>

                                  <div className="form-group row">
                                      <div className="col-sm-6">
                                        <input type="password" className="form-control" name="password" id="password" placeholder="Password" onChange={() =>this.props.dispatch(this.props.setPassword(document.getElementById('password').value))}></input>
                                      </div>
                                  </div>

                                  <div className="form-group row">
                                      <div className="col-sm-7">
                                        <button type="submit" onClick={() =>this.props.signup(this.props.first_name,this.props.last_name,this.props.username, this.props.password,)} className="btn btn-primary" >Create an account</button>
                                      </div> 
                                  </div>

                            
                            </div>
                      </div>

                </div>

      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    let actions = {setUsername, setPassword, setFirstName, setLastName};
    return {
        signup : (first_name, last_name, username,password) => dispatch(signup(first_name, last_name, username,password)),
        ...actions,dispatch
    };
}

const mapStateToProps = (state) => { 
  return { username: state.reducer.username,
           password: state.reducer.password,
           first_name: state.reducer.first_name,
           last_name: state.reducer.last_name,
           result: state.reducer.result,
           isSignup: state.reducer.isSignup
         };
};

export default connect(mapStateToProps,mapDispatchToProps)(SignUp);
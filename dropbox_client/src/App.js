import React, { Component } from 'react';
import logo from './public/dropbox_logo_panel.svg';
import './App.css';
import { connect } from "react-redux";
import { setUsername, setPassword, login } from "./actions/userActions";
import { Link } from 'react-router-dom';
import image_login from './public/dropbox_login_image.png'


class SignIn extends Component {

   
   componentDidUpdate(prevProps, prevState) {
    console.log('This props is valid ' , this.props.isValid)
      if(this.props.isValid){
        console.log('Pushing to the page ')
        this.props.history.push('/Home');
      }
   }

   

  render() {
    
   var username = this.props.username;
   var password = this.props.password;
   var isValid = this.props.isValid;
   var message = this.props.message;

   console.log('MESSAGE : ' + message)

  
   

    return (
      <div>
        <header className="App-header App">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        
                  <div className="container col-md-12 login-body row"> 

                        <div className=" col-md-6">
                          <img src={image_login} className="login_img"  />  
                        </div>

                        <div className="col-md-6">


                              <div className="col-md-8 row">
                                      <div className="col-md-4 divStyle">
                                        <div className="panel-title ">Sign In</div>                        
                                      </div>
                                      <div className="col-md-4 sinup-btn">
                                                    <Link to="/SignUp" href="#">Create an account</Link>
                                      </div>
                              </div>        

                              <div >
                              
                                      <div className="form-group row">
                                          
                                          <div className="col-sm-6">
                                            <input type="text" className="form-control" name="username" id="username" placeholder="Username" onChange={() =>this.props.dispatch(this.props.setUsername(document.getElementById('username').value))}></input>
                                          </div>
                                      </div>

                                      <div className="form-group row">
                                          <div className="col-sm-6">
                                            <input type="password" className="form-control" name="password" id="password" placeholder="Password" onChange={() =>this.props.dispatch(this.props.setPassword(document.getElementById('password').value))}></input>
                                          </div>
                                      </div>

                                      <div className="form-group row">
                                          <div className="col-sm-7">
                                            <button type="submit" onClick={() =>this.props.login(this.props.username, this.props.password, 'login')} className="btn btn-primary" >Sign In</button>
                                          </div> 
                                      </div>
                                      <div className="message">
                                          {message}
                                      </div>

                            
                              </div>
                        </div>
                  </div>

      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
    let actions = {setUsername, setPassword};
    return {
        login : (username,password) => dispatch(login(username,password)),
        ...actions,dispatch
    };
}

const mapStateToProps = (state) => { 
  return { username: state.reducer.username,
           password: state.reducer.password,
           isValid: state.reducer.isValid,
           message: state.reducer.message
         };
};

export default connect(mapStateToProps,mapDispatchToProps)(SignIn);


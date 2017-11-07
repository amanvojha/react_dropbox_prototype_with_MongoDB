import React, { Component } from 'react';
import logo from '../public/dropbox_logo_panel.svg';
import star from '../public/star.png';
import unstar from '../public/unstar.png';
import logo_small from '../public/logo_small.svg';
import smiley from '../public/smiley.png';
import dots from '../public/dots.svg';
import '../App.css';
import { setFirstName, setLastName, setUsername, setPassword, login, signup, logout, uploadHome, setHomeFiles } from "../actions/userActions";
import { setStar,unsetStar, getStar, download, deleteFile, getActivity, setProfile, getProfile, checkAuth } from "../actions/userActions";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';




class Profile extends Component {

  

  componentWillMount() {

      console.log('COMPONENT WILL MOUNT')
      this.props.checkAuth();
      if(!this.props.isValid){
        console.log('Pushing to the page ')
        this.props.history.push('/');
      }
      this.props.getProfile(this.props.username);
   }

  componentDidUpdate(prevProps, prevState) {

      console.log('Component DID UPDATE!')
      
      this.props.checkAuth();
      if(!this.props.isValid){
        console.log('Pushing to the page ')
        this.props.history.push('/');
      }
      this.props.getProfile(this.props.username);

   }

  
  render() {

    var username = this.props.username;
    var interest = this.props.interest;
    var bio = this.props.bio;
    var mobile = this.props.mobile;
    var education = this.props.education;
    var work = this.props.work;
    console.log('NAME : ' + username);
    
    var hide = {
      display : "none"
    }

    var pad = {
      paddingTop : "25px"
    }

    
    return (
          <div>
              <div className="col-lg-12 row home-body">
                
                      <div className="col-lg-2 home-left-panel">
                          <div className="home-left-panel-elements">
                               <img src={logo_small} className="row " onClick={() => this.props.history.push('/Home')}/>
                               <Link to="/Home" className="row" style={pad}>Home</Link>
                               <Link to="/Files" className="row" style={pad}>My Files</Link>
                               <Link to="/Shared" className="row" style={pad}>Shared Files</Link>
                               <Link to="/Group" className="row" style={pad}>Groups</Link>
                               <Link to="/Activity" className="row" style={pad}>Activity Log</Link>
                               <Link to="/Profile" className="row" style={pad}>Profile</Link>

                              
                          </div>  
                      </div>
                     
                      <div className="col-lg-8 home-content">
                        
                          <div>
                              <h4>Profile</h4>
                              
                          </div> 

                          <div>

                              <div className="home-gap">
                                <label></label>
                              </div>
                              
                              <h6 className="home-file-row">Profile</h6>
                              <div>
                                      <div className="form-group row profile-form">
                                          <label className="col-sm-2">About Me</label>
                                          <div className="col-sm-10 ">
                                            <input className="form-control profile-form-text-box" name="bio" id="bio" value={bio} disabled></input>
                                          </div>
                                      </div>

                                      <div className="form-group row profile-form">
                                          <label className="col-sm-2">Work</label>
                                          <div className="col-sm-10 ">
                                            <input  className="form-control" name="work" id="work" value={this.props.work || ' '} disabled></input>
                                          </div>
                                      </div>

                                      <div className="form-group row profile-form">
                                          <label className="col-sm-2">Education</label>
                                          <div className="col-sm-10 ">
                                            <input type="text" className="form-control" name="education" id="education" value={education || ' '} disabled></input>
                                          </div>
                                      </div>

                                      <div className="form-group row profile-form">
                                          <label className="col-sm-2">Mobile</label>
                                          <div className="col-sm-10 ">
                                            <input type="text" className="form-control" name="mobile" id="mobile" value={mobile || ' '} disabled></input>
                                          </div>
                                      </div>

                                      <div className="form-group row profile-form">
                                          <label className="col-sm-2">Interests</label>
                                          <div className="col-sm-10 ">
                                            <input className="form-control profile-form-text-box" value={interest || ' '} name="interest" id="interest" disabled></input>
                                          </div>
                                      </div>

                                      
                              </div> 

                          </div>    
                      </div>
                      
                      
                      <div className="col-lg-2 home-right-panel">

                            <div>
                                  <div className="dropdown">
                                      <a href="#" className=" smiley-icon" data-toggle="dropdown" role="button"><img src={smiley}/></a>
                                        <ul className="dropdown-menu smiley-btn">
                                            <li className="smiley-content"><a href="#" onClick={() => this.props.history.push('/EditProfile')}>Edit Profile</a></li>
                                            <li className="smiley-content"><a href="#" onClick={() => this.props.logout()}>Sign Out</a></li>

                                        </ul>
                                  </div>

                            </div>
                            
                            
                      </div>

              </div>
          </div>
    );
  }
}



function mapDispatchToProps(dispatch) {
    
    return {
        logout : () => dispatch(logout()),
        getActivity: (username) => dispatch(getActivity(username)),
        getProfile: (username) => dispatch(getProfile(username)),
        checkAuth: () => dispatch(checkAuth())
        
    };
}

const mapStateToProps = (state) => { 
  return { username: state.reducer.username,
           password: state.reducer.password,
           first_name: state.reducer.first_name,
           last_name: state.reducer.last_name,
           interest: state.reducer.interest,
           bio: state.reducer.bio,
           mobile: state.reducer.mobile,
           work: state.reducer.work,
           education: state.reducer.education,
           result: state.reducer.result,
           isValid: state.reducer.isValid,
           file_list_recent: state.reducer.file_list_recent,
           file_stared: state.reducer.file_stared,
           activity: state.reducer.activity,
           profile_updated: state.reducer.profile_updated
         };
};

export default connect(mapStateToProps,mapDispatchToProps)(Profile);


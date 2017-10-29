import React, { Component } from 'react';
import logo from '../public/dropbox_logo_panel.svg';
import star from '../public/star.png';
import unstar from '../public/unstar.png';
import logo_small from '../public/logo_small.svg';
import smiley from '../public/smiley.png';
import dots from '../public/dots.svg';
import '../App.css';
import { setFirstName, setLastName, setUsername, setPassword, login, signup, logout, uploadHome, setHomeFiles } from "../actions/userActions";
import { setStar,unsetStar, getStar, download, deleteFile, getActivity, setProfile } from "../actions/userActions";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';




class EditProfile extends Component {

  

  componentWillMount() {

      console.log('COMPONENT WILL MOUNT')
      if(!this.props.isValid){
        console.log('Pushing to the page ')
        this.props.history.push('/');
      }
      
   }

  componentDidUpdate(prevProps, prevState) {

      console.log('Component DID UPDATE!')
      console.log(this.props.isValid)
      if(!this.props.isValid){
        console.log('Pushing to the page ')
        this.props.history.push('/');
      }
      console.log(this.props.profile_updated)
      if(this.props.profile_updated) {
        this.props.history.push('/Home');
      }

   }

  
  render() {

    var username = this.props.username;
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
                               <Link to="/Activity" className="row" style={pad}>Activity Log</Link>
                               <Link to="/Profile" className="row" style={pad}>Profile</Link>

                              
                          </div>  
                      </div>
                     
                      <div className="col-lg-8 home-content">
                        
                          <div>
                              <h4>Edit Profile</h4>
                              
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
                                            <textarea className="form-control profile-form-text-box" name="bio" id="bio" ></textarea>
                                          </div>
                                      </div>

                                      <div className="form-group row profile-form">
                                          <label className="col-sm-2">Work</label>
                                          <div className="col-sm-10 ">
                                            <input type="text" className="form-control" name="work" id="work" ></input>
                                          </div>
                                      </div>

                                      <div className="form-group row profile-form">
                                          <label className="col-sm-2">Education</label>
                                          <div className="col-sm-10 ">
                                            <input type="text" className="form-control" name="education" id="education" ></input>
                                          </div>
                                      </div>

                                      <div className="form-group row profile-form">
                                          <label className="col-sm-2">Mobile</label>
                                          <div className="col-sm-10 ">
                                            <input type="text" className="form-control" name="mobile" id="mobile" ></input>
                                          </div>
                                      </div>

                                      <div className="form-group row profile-form">
                                          <label className="col-sm-2">Interests</label>
                                          <div className="col-sm-10 ">
                                            <textarea className="form-control profile-form-text-box" name="interest" id="interest" ></textarea>
                                          </div>
                                      </div>

                                      <div className="form-group row profile-button">
                                          <div className="row col-sm-12">
                                              <div className="profile-button">
                                                <button type="submit"  className="btn btn-primary row" 
                                                    onClick={() => this.props.setProfile(this.props.username,
                                                                                        document.getElementById('bio').value,
                                                                                        document.getElementById('work').value,
                                                                                        document.getElementById('education').value,
                                                                                        document.getElementById('mobile').value,
                                                                                        document.getElementById('interest').value)}>Save
                                              </button>
                                              </div> 

                                              <div className="profile-button">
                                                <button type="submit"  className="btn btn-danger" onClick={() => this.props.history.push('/Home')}>Cancel</button>
                                              </div>
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
                                            <li className="smiley-content"><a href="#">Edit Profile</a></li>
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
        setProfile: (username, bio, work, education, mobile, interest) => dispatch(setProfile(username, bio, work, education, mobile, interest))
        
    };
}

const mapStateToProps = (state) => { 
  return { username: state.reducer.username,
           password: state.reducer.password,
           first_name: state.reducer.first_name,
           last_name: state.reducer.last_name,
           result: state.reducer.result,
           isValid: state.reducer.isValid,
           file_list_recent: state.reducer.file_list_recent,
           file_stared: state.reducer.file_stared,
           activity: state.reducer.activity,
           profile_updated: state.reducer.profile_updated
         };
};

export default connect(mapStateToProps,mapDispatchToProps)(EditProfile);


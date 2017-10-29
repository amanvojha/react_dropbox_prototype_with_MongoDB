import React, { Component } from 'react';
import logo from '../public/dropbox_logo_panel.svg';
import star from '../public/star.png';
import unstar from '../public/unstar.png';
import logo_small from '../public/logo_small.svg';
import smiley from '../public/smiley.png';
import dots from '../public/dots.svg';
import '../App.css';
import { setFirstName, setLastName, setUsername, setPassword, login, signup, logout, uploadHome, setHomeFiles } from "../actions/userActions";
import { setStar,unsetStar, getStar, download, deleteFile, getActivity, checkAuth } from "../actions/userActions";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';




class Activity extends Component {

  

  componentWillMount() {

      console.log('COMPONENT WILL MOUNT')
      this.props.checkAuth();
      if(!this.props.isValid){
        console.log('Pushing to the page ')
        this.props.history.push('/');
      }
      this.props.getActivity();
      //Bringing Uploaded files
      //this.props.setHomeFiles(this.props.username);
      //this.props.getStar(this.props.username);

   }

  componentDidUpdate(prevProps, prevState) {

      console.log('Component DID UPDATE!')
      console.log(this.props.isValid)
      this.props.checkAuth();
      if(!this.props.isValid){
        console.log('Pushing to the page ')
        this.props.history.push('/');
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

    var activity = this.props.activity.map((item,key) =>
      {
          return(
              <div key={key}>
                  <label htmlFor="Activity" className="home-file-row">{item.activity}
                  </label>
              </div> 
          )
      }
    );


    return (
          <div>
              <div className="col-lg-12 row home-body">
                
                      <div className="col-lg-2 home-left-panel">
                          <div className="home-left-panel-elements">
                               <img src={logo_small} className="row " onClick={() => this.props.history.push('/Home')}/>
                               <Link to="/Home" className="row" style={pad}>Home</Link>
                               <Link to="/Files" className="row" style={pad}>My Files</Link>
                               <Link to="/Shared" className="row" style={pad}>Shared Files</Link>
                               <Link to="/Files" className="row" style={pad}>Activity Log</Link>
                               <Link to="/Profile" className="row" style={pad}>Profile</Link>

                              
                          </div>  
                      </div>
                     
                      <div className="col-lg-8 home-content">
                        
                          <div>
                              <h4>Activity Log</h4>
                              
                          </div> 

                          <div>

                              <div className="home-gap">
                                <label></label>
                              </div>
                              
                              <h6 className="home-file-row">Recent Activity Log</h6>
                              <div>
                                {activity}
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
        getActivity: () => dispatch(getActivity()),
        checkAuth: () => dispatch(checkAuth()),
        
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
           activity: state.reducer.activity
         };
};

export default connect(mapStateToProps,mapDispatchToProps)(Activity);


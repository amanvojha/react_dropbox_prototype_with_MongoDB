import React, { Component } from 'react';
import logo from '../public/dropbox_logo_panel.svg';
import star from '../public/star.png';
import logo_small from '../public/logo_small.svg';
import smiley from '../public/smiley.png';
import dots from '../public/dots.svg';
import file_icon from '../public/file_icon.png';
import folder_icon from '../public/folder_icon.png'
import '../App.css';
import { setFirstName, setLastName, setUsername, setPassword, login, signup, logout, upload, setFiles } from "../actions/userActions";
import { setStar, getStar, download, getSharedFile, checkAuth, setFolder } from "../actions/userActions";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';



class Shared extends Component { 

	componentWillMount() {

      this.props.checkAuth();
      if(!this.props.isValid){
        console.log('Pushing to the page ')
        this.props.history.push('/');
      }

      //Bringing Uploaded files
      this.props.getSharedFile();
     

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

    var shared_list = this.props.shared_list.map((item,key) =>
      {
          var url = "/Page/" + item.file_name  

          return(
              <div key={key}>
                  <label htmlFor="fileName" className="home-file-row">{item.file_name}
                    
                    {(item.isFile==1) ?
                          <img src={file_icon} className="file-icon"/>
                    :
                          <a href="#" onClick={() => 
                                                  {
                                                    this.props.setFolder(item.fileId)
                                                    this.props.history.push(url)
                                                  }
                                              }><img src={folder_icon} className="file-icon" /></a>}

                          <div className="dropdown home-row-objects">
                                      <a href="#" className="" data-toggle="dropdown" role="button"><img src={dots} className="dots "/></a>
                                        <ul className="dropdown-menu smiley-btn">
                                            
                                            <li className="smiley-content" onClick={() => this.props.download(this.props.username,item.file_name)}>Download</li>
                                            


                                        </ul>



                                        
                          </div>


                          <img src={star} className="home-row-objects" onClick={() => this.props.setStar(item.fileId,item.file_name)}/>
                    
                                                    <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                      <div className="modal-dialog" role="document">
                                                        <div className="modal-content">
                                                          <div className="modal-header">
                                                            <h5 className="modal-title" id="exampleModalLabel">Share File</h5>
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                              <span aria-hidden="true">&times;</span>
                                                            </button>
                                                          </div>
                                                          <div className="modal-body">
                                                              <label>Username :</label>
                                                              <div className="col-sm-10">
                                                                <input type="email" className="form-control" name="sharedWith" id="sharedWith" placeholder="Email"></input>
                                                              </div>
                                                          </div>
                                                          <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                            <button type="button" className="btn btn-success" onClick={() => this.props.shareFile(this.props.fileId_to_be_shared,document.getElementById('sharedWith').value)}>Share</button>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>


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
                               <Link to="/Group" className="row" style={pad}>Groups</Link>
                               <Link to="/Activity" className="row" style={pad}>Activity Log</Link>
                               <Link to="/Profile" className="row" style={pad}>Profile</Link>
                              
                          </div>  
                      </div>
                     
                      <div className="col-lg-8 home-content">
                        
                          <div>
                              <h4>Shared Files</h4>
                              
                          </div> 

                          <div>

                                                           
                              <div className="home-gap">
                                <label></label>
                              </div>
                              
                              <h6 className="home-file-row">All Shared Files</h6>
                              <div>
                                {shared_list}
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
        upload : (username,file) => dispatch(upload(username,file)),
        getSharedFile: (username) => dispatch(getSharedFile(username)),
        setStar: (username,file_id) => dispatch(setStar(username,file_id)),
        getStar: (username) => dispatch(getStar(username)),
        download: (username,file_name) => dispatch(download(username,file_name)),
        setFolder : (fileId) => dispatch(setFolder(fileId)),
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
           shared_list: state.reducer.shared_list,
           file_stared: state.reducer.file_stared
         };
};

export default connect(mapStateToProps,mapDispatchToProps)(Shared);
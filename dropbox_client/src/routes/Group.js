import React, { Component } from 'react';
import logo from '../public/dropbox_logo_panel.svg';
import star from '../public/star.png';
import logo_small from '../public/logo_small.svg';
import smiley from '../public/smiley.png';
import dots from '../public/dots.svg';
import file_icon from '../public/file_icon.png';
import folder_icon from '../public/folder_icon.png'
import group from '../public/group.png'
import '../App.css';
import { setFirstName, setLastName, setUsername, setPassword, login, signup, logout, upload, setFiles } from "../actions/userActions";
import { setStar, getStar, download, getSharedFile, checkAuth, setFolder, createGroup, getGroup } from "../actions/userActions";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';



class Group extends Component { 

	componentWillMount() {

      this.props.checkAuth();
      if(!this.props.isValid){
        console.log('Pushing to the page ')
        this.props.history.push('/');
      }
      this.props.getGroup();

      

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

    var group_list = this.props.group_list.map((item,key) =>
      {
          var url = "/Page/" + item.file_name

          return(
              <div key={key}>
                  <label htmlFor="fileName" className="home-file-row">{item.group_name}

                    {(item.isFile==1) ?
                          <img src={file_icon} className="file-icon"/>
                    :
                          <Link to={url} onClick={() => this.props.setFolder(item.fileId)}><img src={group} className="file-icon"/></Link>
                    }

                    <div className="dropdown home-row-objects">
                                      <a href="#" className="" data-toggle="dropdown" role="button"><img src={dots} className="dots "/></a>
                                        <ul className="dropdown-menu smiley-btn">
                                            <li className="smiley-content" /*onClick={() => this.props.deleteFile(this.props.username,item.fileId,item.file_name)}*/>Delete Group</li>
                                            
                                        </ul>
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
                              <h4>Groups</h4>
                              
                          </div> 

                          <div>

                                                           
                              <div className="home-gap">
                                <label></label>
                              </div>
                              
                              <h6 className="home-file-row">All Groups</h6>
                              <div>
                                {group_list}
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

                            <div>
                                
                                <label htmlFor="upload" className="btn btn-primary col-md-12 upload-btn" data-toggle="modal" data-target="#CreateGroup">Create New Group</label>
                            </div>
                                  <div className="modal fade" id="CreateGroup" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                      <div className="modal-dialog" role="document">
                                                        <div className="modal-content">
                                                          <div className="modal-header">
                                                            <h5 className="modal-title" id="exampleModalLabel">Create New Group</h5>
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                              <span aria-hidden="true">&times;</span>
                                                            </button>
                                                          </div>
                                                          <div className="modal-body">
                                                              <label>Group Name :</label>
                                                              <div className="col-sm-10">
                                                                <input type="text" className="form-control" name="groupName" id="groupName" placeholder="eg: Vegas Trip"></input>
                                                              </div>
                                                          </div>
                                                          <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                            <button type="button" className="btn btn-success" onClick={() => this.props.createGroup(document.getElementById('groupName').value,'0',username)}>Create</button>
                                                          </div>
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
    
    return {
        logout : () => dispatch(logout()),
        upload : (username,file) => dispatch(upload(username,file)),
        createGroup : (groupName,isFile,parentId) => dispatch(createGroup(groupName,isFile,parentId)),
        getSharedFile: (username) => dispatch(getSharedFile(username)),
        setStar: (username,file_id) => dispatch(setStar(username,file_id)),
        getStar: (username) => dispatch(getStar(username)),
        download: (username,file_name) => dispatch(download(username,file_name)),
        setFolder : (fileId) => dispatch(setFolder(fileId)),
        checkAuth: () => dispatch(checkAuth()),
        getGroup: () => dispatch(getGroup())
        
    };
}

const mapStateToProps = (state) => { 
  return { username: state.reducer.username,
           password: state.reducer.password,
           first_name: state.reducer.first_name,
           last_name: state.reducer.last_name,
           result: state.reducer.result,
           isValid: state.reducer.isValid,
           group_list: state.reducer.group_list,
           file_stared: state.reducer.file_stared
         };
};

export default connect(mapStateToProps,mapDispatchToProps)(Group);
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
import { setStar, getStar, download, deleteFile, shareFile, checkAuth, uploadFolder, setFolder, setShareId } from "../actions/userActions";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';



class Files extends Component { 

	componentWillMount() {


      this.props.checkAuth();
      if(!this.props.isValid){
        console.log('Pushing to the page ')
        this.props.history.push('/');
      }

      //Bringing Uploaded files
      
      this.props.setFiles(this.props.username);
      
   }

  componentDidUpdate(prevProps, prevState) {

      console.log('Component DID UPDATE!')
      console.log(this.props.isValid)
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

    var file_list = this.props.file_list.map((item,key) =>
      {
          var url = "/Page/" + item.file_name

          return(
              <div key={key}>
                  <label htmlFor="fileName" className="home-file-row">{item.file_name}

                    {(item.isFile==1) ?
                          <img src={file_icon} className="file-icon"/>
                    :
                          <Link to={url} onClick={() => this.props.setFolder(item.fileId)}><img src={folder_icon} className="file-icon"/></Link>
                    }

                    <div className="dropdown home-row-objects">
                                      <a href="#" className="" data-toggle="dropdown" role="button"><img src={dots} className="dots "/></a>
                                        <ul className="dropdown-menu smiley-btn">
                                            <li className="smiley-content" onClick={() => this.props.deleteFile(this.props.username,item.fileId,item.file_name)}>Delete File</li>
                                            <li className="smiley-content" onClick={() => this.props.download(this.props.username,item.file_name)}>Download</li>
                                            <li className="smiley-content" data-toggle="modal" data-target="#myModal" 
                                                            onClick={() => this.props.setShareId(item.fileId)}>
                                                            Share File
                                            </li>

                                        </ul>
                    </div>

                    <img src={star} className="home-row-objects" onClick={() => this.props.setStar(item.fileId,item.file_name)}/>
                    
                    
                  
                  </label>
                  
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
                                                            <button type="button" className="btn btn-success" onClick={() => this.props.shareFile(item.fileId,document.getElementById('sharedWith').value)}>Share</button>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
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
                              <h4>Files</h4>
                              
                          </div> 

                          <div>

                                                           
                              <div className="home-gap">
                                <label></label>
                              </div>
                              
                              <h6 className="home-file-row">All Files</h6>
                              <div>
                                {file_list}
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
                                 <label htmlFor="upload" className="btn btn-primary col-md-12 upload-btn">Upload files</label>
                                   <input type="file" name="upload" id="upload" style={hide} 
                                          onChange={(e) =>this.props.upload(this.props.username,e.target.files[0],'1',username)}></input>
                            </div>

                            <div>
                                <a href="#" data-toggle="modal" data-target="#CreateFolder" role="button" ><img src={folder_icon} className="folder-icon-right"/>Create New Folder</a>

                            </div>
                                  <div className="modal fade" id="CreateFolder" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                      <div className="modal-dialog" role="document">
                                                        <div className="modal-content">
                                                          <div className="modal-header">
                                                            <h5 className="modal-title" id="exampleModalLabel">Create New Folder</h5>
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                              <span aria-hidden="true">&times;</span>
                                                            </button>
                                                          </div>
                                                          <div className="modal-body">
                                                              <label>Folder Name :</label>
                                                              <div className="col-sm-10">
                                                                <input type="text" className="form-control" name="folderName" id="folderName" placeholder="eg: Vegas Trip"></input>
                                                              </div>
                                                          </div>
                                                          <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                            <button type="button" className="btn btn-success" onClick={() => this.props.uploadFolder(document.getElementById('folderName').value,'0',username)}>Create</button>
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
        upload : (username,file,isFile,parentId) => dispatch(upload(username,file,isFile,parentId)),
        uploadFolder : (file_name,isFile,parentId) => dispatch(uploadFolder(file_name,isFile,parentId)),
        setFiles: (parentId) => dispatch(setFiles(parentId)),
        setStar: (file_id,file_name) => dispatch(setStar(file_id,file_name)),
        getStar: (username) => dispatch(getStar(username)),
        download: (username,file_name) => dispatch(download(username,file_name)),
        deleteFile: (username,file_id,file_name) => dispatch(deleteFile(username,file_id,file_name)),
        shareFile: (file_id,sharedWith) => dispatch(shareFile(file_id,sharedWith)),
        checkAuth: () => dispatch(checkAuth()),
        setFolder : (fileId) => dispatch(setFolder(fileId)),
        setShareId: (fileId) => dispatch(setShareId(fileId)),

    };
}

const mapStateToProps = (state) => { 
  return { username: state.reducer.username,
           password: state.reducer.password,
           first_name: state.reducer.first_name,
           last_name: state.reducer.last_name,
           result: state.reducer.result,
           isValid: state.reducer.isValid,
           file_list: state.reducer.file_list,
           file_stared: state.reducer.file_stared,
           fileId_to_be_shared: state.reducer.fileId_to_be_shared
         };
};

export default connect(mapStateToProps,mapDispatchToProps)(Files);
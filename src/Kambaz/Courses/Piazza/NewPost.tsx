import React, { useState } from "react";
import { Col, Form, FormCheck, FormGroup, Row } from "react-bootstrap";
import { folders } from "../../Database";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";


export default function NewPostPage() {
const [selectedOption, setSelectedOption] = useState<string>('');
const [selectedPostTo, setSelectedPostTo] = useState<string>('');
const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
const [editorValue, setEditorValue] = useState("");
const [postSumary, setPostSummary] = useState("");

const navigate = useNavigate();
  const { cid } = useParams();


  const DeleteButton = () => {
   navigate(`/Kambaz/Courses/${cid}/Piazza/`);
 }


const handleChangePostType = (event: React.ChangeEvent<HTMLInputElement>) => {
   setSelectedOption(event.target.value);
};

const handleChangePostTo = (event: React.ChangeEvent<HTMLInputElement>) => {
   setSelectedPostTo(event.target.value);
};


const handleSummaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPostSummary(e.target.value);
};

const handleDetailsChange = (value: string) => {
   setEditorValue(value);
};


const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const { value, checked } = event.target;
   

   if (checked) {
      setSelectedFolders((prev) => [...prev, value]);
   }
   else {
      setSelectedFolders((prev) => prev.filter((folder) => folder !== value));
   }
   };

   const postButton = async () => {
      if (!selectedOption) {
         alert("Please choose a post yype: Question/Note");
         return;
      }
      if (!selectedPostTo) {
         alert("Please choose post destination: Everyone/Instructor(s)");
         return;
      }
      if (selectedFolders.length === 0) {
         alert("Please choose a folder(s)");    
         return;
      }
      if (!postSumary) {
         alert("Please put a summary for your post");
         return;
      }
      if (!editorValue) {
         alert("Can't submit a post with no details");
         return;
      }

    const newPost = {
      _id: `P${Date.now()}`,
      folderId: selectedFolders.join(','),
      authorId: 'user123',
      datePosted: new Date().toISOString(),
      type: 2,
      instructor: 1,
      title: postSumary,
      content: editorValue,
      followUpQuestions: '',
      studentResponse: '',
      instructorResponse: '',
      viewers: '',
      courseId: cid,
   };

try {

   const response = await fetch("http://localhost:3000/api/post", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
   });

   if (response.ok) {
      console.log("New Post Added");
      navigate(`/Kambaz/Courses/${cid}/Piazza`);
   }
   else {
      console.error("Failed to Post");
   }
} catch (error) {
   console.error("Server Error Katie:", error);
}
};



   return (


<div id="wd-new-post">

<div className="wd-post-type d-flex">
   <div id="wd-class-stats" className="d-flex wd-text-grey wd-font-bold"  
   style={{ fontSize: "14px", flex: '0 0 20%'}}>
     
              Post Type*
            </div>
            
<div className="d-flex mt-1" style={{ flex: '1'}}>
   <Form>
      <Form.Group className="mb-3">
        
        <div>
         <Form.Check
         type="radio"
         label={
          <div
            className={selectedOption === 'question' ? 'wd-highlight-border' : 'wd-border-none'}
            style={{ 
               fontSize: "12px", 
               color:"gray"
                }}
                >
            <span className="wd-font-bold wd-dark-grey">Question</span>
         <div style={{ fontSize: "12px", color: '#333333' }}>
            if you need an answer
         </div>
         </div>
           }
         value="question"
         checked={selectedOption === 'question'}
         onChange={handleChangePostType}
         className="me-3"
         />
         <Form.Check
         type="radio"
         label={
            <div
            className={selectedOption === 'note' ? 'wd-highlight-border' : 'wd-border-none'}
            style={{ 
               fontSize: "12px", 
               color:"gray"
                }}
                >
            <span className="wd-font-bold wd-dark-grey">Note</span>
            <div style={{ fontSize: "12px", color: '#333333'}}>
              if you
              <span className="wd-font-bold"> don't </span>
              need an answer
            </div>
            </div>
         }
         value="note"
         checked={selectedOption === 'note'}
         onChange={handleChangePostType}
         className="me-3 mt-3"
         />
        </div>
      </Form.Group>
   </Form>
</div>
         </div>


<div id="wd-new-post2" className="container" style={{ width: "100%"}}>
 <div className="wd-post-to">
  <div className="d-flex">
 <div id="wd-class-stats" className="d-flex wd-text-grey wd-font-bold"  
   style={{ fontSize: "14px"}}>
     
              Post To*
            </div>

      
<div className="mt-1 d-flex ms-3">
   <Form>
      <Form.Group className="mb-3">
        
        <div className="d-flex">
         <Form.Check
         type="radio"
         label={
          <div
            style={{ 
               fontSize: "12px", 
               color:"gray"
                }}
                >
            <span className=" wd-dark-grey">Everyone</span>
         </div>
           }
         value="everyone"
         checked={selectedPostTo === 'everyone'}
         onChange={handleChangePostTo}
         className="me-3"
         />
        
         <Form.Check
         type="radio"
         label={
            <div
            style={{ 
               fontSize: "12px", 
               color:"gray"
                }}
                >
            <span className="wd-dark-grey">Instructor(s)</span>
            </div>
         }
         value="instructor"
         checked={selectedPostTo === 'instructor'}
         onChange={handleChangePostTo}
         className="me-3"
         />
         </div>
      </Form.Group>
   </Form>
</div>


</div>


<div className="d-flex mt-3">
 <div id="wd-class-stats" className="d-flex wd-text-grey wd-font-bold"  
   style={{ fontSize: "14px"}}>
     
              Select <br/>Folder(s)*
            </div>

   <div>
         <Form>
            <FormGroup className="mb-3">
               <div className=" wd-checkbox-custom">
                  {folders.map((folder) => (
                     <FormCheck
                     key={folder.id}
                     id={folder.id}
                     type="checkbox"
                     label={folder.name}
                     value={folder.name}
                     checked={selectedFolders.includes(folder.name)}
                     onChange={handleFolderChange}
                     />
                  ))}
</div>
</FormGroup>
</Form>
</div>
 </div>

 
 <Form>
          <Form.Group as={Row} className="mb-4 d-flex align-items-center">
            <Col sm={2}>
            <div id="wd-class-stats" className="d-flex wd-text-grey wd-font-bold"
                  style={{ fontSize: "14px"}}>
     
              Summary*
            </div>
            </Col>
            <Col sm={9}>
              <Form.Control id="wd-name" type="text" 
              placeholder="Enter a one line summary here, 100 characters or less"
              style={{ fontSize: "13px"}}
              value={postSumary}
              onChange={handleSummaryChange}
              />
            </Col>
          </Form.Group>
</Form>

<Form>
          <Form.Group as={Row} className="mb-3 d-flex ">
            <Col sm={2}>
            <div id="wd-class-stats" className="d-flex wd-text-grey wd-font-bold"
                  style={{ fontSize: "14px"}}>
     
              Details*
            </div>
            </Col>
            <Col sm={9}>
              <ReactQuill
              theme="snow"
              className="custom-editor"
              value={editorValue}
              onChange={handleDetailsChange}
              />
            </Col>
          </Form.Group>
         </Form>


<div id="wd-class-stats" className="mt-5 wd-text-grey wd-font-bold"  
   style={{ fontSize: "14px"}}>
     
              <span className="wd-rotated-asterick">*</span>Required fields
                  


</div>

<div className="d-flex">
<div className="d-flex">
            <button className="wd-new-post-button wd-new-post-padding mt-3" 
            onClick={postButton}>
              Post My{" "}
              {selectedOption
              ?
               selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)
                  : "Question"}{" "}

                to CS4550-02! </button>
        </div>

   <div className="d-flex">
            <button className="wd-cancel-button wd-new-post-padding mt-3 ms-3" 
            onClick={DeleteButton}>
              Cancel </button>
        </div>
            </div>
            </div>
            </div>
            </div>

 
   );
}
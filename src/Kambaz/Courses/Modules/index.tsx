/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, ListGroup } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import { useParams } from "react-router";
import { useState } from "react";
import { addModule, editModule, updateModule, deleteModule }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser.role === "FACULTY";

  return (
    <div>
      <ModulesControls
        setModuleName={setModuleName}
        moduleName={moduleName}
        addModule={() => {
          dispatch(addModule({ name: moduleName, course: cid }));
          setModuleName("");
        }} />

      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          .filter((module: any) => module.course === cid)
          .map((module: any, index: number) => (
            <ListGroup.Item key={index} className="wd-module p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                {isFaculty &&
                  <>
                    {!module.editing && module.name}
                    {module.editing && (
                      <FormControl className="w-50 d-inline-block"
                        onChange={(e) => dispatch(updateModule({ ...module, name: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            dispatch(updateModule({ ...module, editing: false }));
                          }
                        }}
                        defaultValue={module.name} />
                    )}
                    <ModuleControlButtons
                      moduleId={module._id}
                      deleteModule={(moduleId) => {
                        dispatch(deleteModule(moduleId));
                      }}
                      editModule={(moduleId) => {
                        dispatch(editModule(moduleId));
                      }} />
                  </>
                }
                {!isFaculty && <>{module.name}</>}
              </div>
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons && module.lessons.map((lesson: any, index: number) => (
                  <ListGroup.Item className="wd-lesson p-3 ps-1" key={index}>
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}
                    {isFaculty &&
                      <ModuleControlButtons
                        moduleId={module._id}
                        deleteModule={(moduleId) => {
                          dispatch(deleteModule(moduleId));
                        }}
                        editModule={(moduleId) => {
                          dispatch(editModule(moduleId));
                        }}
                      />
                    }
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import * as db from "./Database";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Form, FormControl } from "react-bootstrap";


export default function Dashboard(
  { courses, course, setCourse, addNewCourse,
    deleteCourse, updateCourse }: {
      courses: any[]; course: any; setCourse: (course: any) => void;
      addNewCourse: () => void; deleteCourse: (course: any) => void;
      updateCourse: () => void;
    }) {

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = db;
  const isFaculty = currentUser.role === "FACULTY";

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      {isFaculty &&
        <div>
          <h5>New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={addNewCourse}>
              Add
            </button>
            <button className="btn btn-warning float-end me-2"
              onClick={updateCourse} id="wd-update-course-click">
              Update
            </button>
          </h5><br />
          <FormControl value={course.name} className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })} />
          <Form.Control as="textarea" value={course.description} rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })} />
        </div>
      }
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.filter((course) =>
            enrollments.some(
              (enrollment) =>
                enrollment.user === currentUser._id &&
                enrollment.course === course._id
            ))
            .map((course, index) => (
              <Col className="wd-dashboard-course" key={index} style={{ width: "300px" }}>
                <Card>
                  <Link to={`/Kambaz/Courses/${course._id}/Home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                    <Card.Img src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                    <Card.Body className="card-body">
                      <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name} </Card.Title>
                      <Card.Text className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}>
                        {course.description}
                      </Card.Text>
                      <Button variant="primary">
                        Go
                      </Button>
                      {isFaculty &&
                        <div>
                          <button onClick={(event) => {
                            event.preventDefault();
                            deleteCourse(course._id);
                          }} className="btn btn-danger float-end"
                            id="wd-delete-course-click">
                            Delete
                          </button>
                          <button id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              setCourse(course);
                            }}
                            className="btn btn-warning me-2 float-end">
                            Edit
                          </button>
                        </div>
                      }
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
}


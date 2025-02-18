import { BsFileEarmarkPostFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";

export default function RightSidePage() {
  const navigate = useNavigate();
  const { cid } = useParams();

  const navButton = () => {
    navigate(`/Kambaz/Courses/${cid}/Piazza/NewPostPage`);
  }

  return (


    <div className="wd-right-page-bg">
      <div id="wd-class-stats" className="wd-text-grey wd-font-family fs-3 wd-padding-left-class" style={{ fontWeight: 500 }}>
        Class at a Glance
      </div>
      <div className="wd-class-glance">
        <div className="wd-post-stats wd-bold">
          <img src="images/warning5.jpg" height={30} />
          <span>_ unread posts</span>
        </div>

        <div className="wd-post-stats wd-bold" style={{ paddingLeft: '13px' }}>
          <img src="images/checkmark.jpg" height={25} />
          <span>_ unanswered followups</span>
        </div>

        <div className="wd-post-stats wd-bold">
          <img src="images/warning5.jpg" height={30} />
          <span>_ unanswered followups</span>
        </div>
      </div>
      
      <div>
            <h5>New Post Button, will move later</h5>
            <button className="wd-new-post-button" onClick={navButton}>
              <BsFileEarmarkPostFill className="me-1 mb-1 fs-5"/>
              New Post</button>
        </div>
    </div>

  );
}
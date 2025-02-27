import { BsFileEarmarkPostFill } from "react-icons/bs";

export default function RightSidePage() {


  return (


    <div className="wd-right-page-bg" style={{ width: '80%', marginTop: '-17px',
     marginLeft: '240px'}}>
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
      
    </div>

  );
}
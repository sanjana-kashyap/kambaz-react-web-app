import { FaFolder } from "react-icons/fa";


export default function HwFolderNav() {

  return (

    <div className="wd-hw-folder-nav-bar">
      <div id="wd-hw-nav" className="d-flex align-items-start">

        <div className="d-flex align-items-start wd-hw-height me-3">
          <FaFolder className="fs-5 me-2" />
          LIVE Q&A
        </div>


        <div className="d-flex align-items-start wd-hw-height">
          <FaFolder className="fs-5 me-2" />
          Drafts
        </div>

      </div>
    </div>
  )
}
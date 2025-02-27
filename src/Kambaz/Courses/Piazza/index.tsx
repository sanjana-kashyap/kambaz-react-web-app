import { Route, Routes } from "react-router-dom";
import PiazzaNavBarTop from "./PiazzaNavBarTop";
import HwFolderNav from "./HwFolderNav";
import CombinedPage from "./RightAndLeft";
import NewPostPage from "./NewPost";

export default function Piazza() {
  return (
    <div id="wd-piazza">
      <PiazzaNavBarTop />
      <HwFolderNav />
      <div className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<CombinedPage/>} />
          <Route path="NewPostPage" element={<NewPostPage/>} />

        </Routes>
      </div>
    </div>
  );
}
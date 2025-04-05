import "./FollowupDiscussions.css";
import { useState } from "react";
import { createDiscussion } from "../../services/followupDiscussionService";
import { FollowupDiscussion as FollowupDiscussionType, Post } from "../../../../types";
import FollowupDiscussion from "./FollowupDiscussion";
import { addDiscussionToPost } from "../../services/postService";
import EditorComponent from "../EditorComponent";

interface FollowupDiscussionsProps {
  convoExists: boolean;
  fudIds: string[];
  setPost: (post: Post) => void;
  postId: string;
}

// Component for displaying followup discussions of a post.
export default function FollowupDiscussions(props: FollowupDiscussionsProps) {

  const { convoExists, fudIds, postId, setPost } = props;

  // boolean indicating if a new discussion is being created
  const [startingNewDiscussion, setStartingNewDiscussion] = useState<boolean>(false);

  // boolean for keeping track of the content of a new discussion
  const [discussionContent, setDiscussionContent] = useState<string>("");

  // function to handle creation/saving of a new discussion
  const handleOnSave = async (newDiscussionContent: string) => {
    try {
      // convert HTML content from React Quill to plain text before saving in database 
      const doc = new DOMParser().parseFromString(newDiscussionContent, "text/html");
      const plainTextContent = doc.body.textContent || "";

      const newDiscussion: FollowupDiscussionType = {
        postId: postId,
        authorId: "123",
        datePosted: new Date().toDateString(),
        content: plainTextContent.trim(),
        replies: []
      };
      // create the followup discussion in the db
      const newDiscussionFromDb = await createDiscussion(newDiscussion);

      if (newDiscussionFromDb?._id) {
        // add the new discussion to the post list of fudIds
        const updatedPost = await addDiscussionToPost(postId, newDiscussionFromDb._id);
        // set the post that's rendering to be the updated post
        setPost(updatedPost);
        // clear the discussion content for the next new discussion 
        setDiscussionContent("");
      }
    } catch (error) {
      console.error("Error creating followup discussion:", error);
    }
    // close the editor component
    setStartingNewDiscussion(false);
  }

  return (
    <article
      className="answer followup_container"
      aria-label="Followup Discussions"
    >
      <header className="container-fluid border-bottom">
        <div className="align-items-center row">
          <div className="text-left col">
            <span className="mr-2">followup discussions </span>
            <span className="post_type_snippet p-0 align-middle">
              for lingering questions and comments
            </span>
          </div>
        </div>
      </header>
      {/* existing convo goes here */}
      {convoExists && (
        <div className="followup_content_wrapper col mx-3">
          {fudIds.map((fudId) => (<FollowupDiscussion fudId={fudId} />))}
        </div>
      )}

      {/* input box to start a new followup dicussion */}
      <div className="content container-fluid">
        <div className="row">
          <div className="pt-2 pb-3 col">
            <label htmlFor="followup-box">
              Start a new followup discussion
            </label>
            {!startingNewDiscussion ? (
              // input box for adding a new answer
              <input
                id="followup-box"
                type="text"
                className="form-control ng-pristine ng-valid"
                placeholder="Compose a new followup discussion"
                onFocus={() => setStartingNewDiscussion(true)}
              />
            ) : (
              <EditorComponent content={discussionContent} setContent={setDiscussionContent} />
            )}
          </div>
        </div>
      </div>
      {startingNewDiscussion &&
        <footer className="border-top container-fluid">
          <div className="row">
            <div className="text-left align-self-center m-1 col-auto">
              <button className="btn btn-primary btn-sm me-2" onClick={() => handleOnSave(discussionContent)}>Submit</button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setStartingNewDiscussion(false); setDiscussionContent(""); }}>Cancel</button>
            </div>
          </div>
        </footer>
      }
    </article>
  );
}

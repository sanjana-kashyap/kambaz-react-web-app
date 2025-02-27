import { BsFileEarmarkPostFill } from "react-icons/bs";
import { posts } from "../../Database";
import InstructorIcon from "./InstructorIcon";
import "./PostSidebar.css";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Function for formatting the given date in dd/mm/yy format. This is used for formatting the date for
 * older posts and for comparing today's date with the date of a certain post.
 * @param inputDate ISODate string ("2025-02-16T01:00:00.000Z" format from mongodb).
 * @returns Date as a string in mm/dd/yy format.
 */
function formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2);

    return `${month}/${day}/${year}`;
}

/**
 * Function for calculating today's date.
 * @returns Today's date as a string in mm/dd/yy format.
 */
function getTodaysDate(): string {
    const today = new Date();
    const month = String(today.getUTCMonth() + 1).padStart(2, '0');
    const day = String(today.getUTCDate()).padStart(2, '0');
    const year = String(today.getUTCFullYear()).slice(-2);

    return `${month}/${day}/${year}`;
}

/**
 * Function for calculating yesterday's date.
 * @returns Yesterday's date as a string in mm/dd/yy format.
 */
function getYesterdayDate(): string {
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setUTCDate(today.getUTCDate() - 1);

    const month = String(yesterday.getUTCMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getUTCDate()).padStart(2, '0');
    const year = String(yesterday.getUTCFullYear()).slice(-2);

    return `${month}/${day}/${year}`;
}

/**
 * Function for extracting the time (such as 8:45 AM or 9:27 PM) from a given ISO date.
 * @param dateString ISODate string ("2025-02-16T01:00:00.000Z" format from mongodb).
 * @returns Human-readable string of the time of the given date.
 */
function extractTime(dateString: string): string {
    const date = new Date(dateString);
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format

    return `${hours}:${minutes} ${ampm}`;
}

/**
 * Function for extracting the day of the week from a given ISO date.
 * @param dateString ISODate string ("2025-02-16T01:00:00.000Z" format from mongodb).
 * @returns The day of the week corresponding to the given date.
 */
function getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return days[date.getUTCDay()];
}

/**
 * Function for producing a list of strings of the days this past week (not including today or yesterday).
 * @returns List of strings in mm/dd/yy format.
 */
function getLastWeekDates(): string[] {
    const today = new Date();
    const days: string[] = [];

    for (let i = 2; i < 7; i++) {
        const dayLastWeek = new Date(today);
        dayLastWeek.setUTCDate(today.getUTCDate() - i);

        const month = String(dayLastWeek.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dayLastWeek.getUTCDate()).padStart(2, '0');
        const year = String(dayLastWeek.getUTCFullYear()).slice(-2);

        days.push(`${month}/${day}/${year}`);
    }

    return days;
}

// TODO - once we have mongodb data types, posts will be of type Post[] instead of the json
/**
 * Function for grouping posts by the week they were created in. This creates a mapping between string date range (such as 2/10-2/16) and
 * a list of the post objects that fall within that week. The current week is excluded from this mapping, as posts from this week will
 * already be displayed in the "today", "yesterday", or "last week" dropdowns of the posts sidebar.
 * @param datesToExclude A list of string dates to exclude from the date mapping creation.
 * @param posts The posts being grouped.
 * @returns A mapping of string date range to list of posts that fall in that date range.
 */ 
function groupPostsByWeek(datesToExclude: String[], posts: { _id: string; folderId: string; authorId: string; datePosted: string; type: number; instructor: number; title: string; content: string; followUpQuestions: string; studentResponse: string; instructorResponse: string; viewers: string; courseId: string; }[]): Map<string, { _id: string; folderId: string; authorId: string; datePosted: string; type: number; instructor: number; title: string; content: string; followUpQuestions: string; studentResponse: string; instructorResponse: string; viewers: string; courseId: string; }[]> {
    // map to keep track of which week each post belongs in
    const groupedPosts: Map<string, { _id: string; folderId: string; authorId: string; datePosted: string; type: number; instructor: number; title: string; content: string; followUpQuestions: string; studentResponse: string; instructorResponse: string; viewers: string; courseId: string; }[]> = new Map();

    posts.forEach((post) => {
        // add post to the week if it is not in the dates to exclude - for our use case, we do not want to display posts from this week,
        // as they will already be displayed in other dropdowns
        if (!datesToExclude.includes(formatDate(post.datePosted))) {
            const postDate = new Date(post.datePosted);

            // get Monday of the post's week
            const monday = new Date(postDate);
            monday.setUTCDate(postDate.getUTCDate() - postDate.getUTCDay() + 1); // Move to Monday
            monday.setUTCHours(0, 0, 0, 0);

            // get Sunday of the post's week
            const sunday = new Date(monday);
            sunday.setUTCDate(monday.getUTCDate() + 6); // Move to Sunday

            // format the week range in mm/dd - mm/dd format for label
            const weekRange = `${monday.getUTCMonth() + 1}/${monday.getUTCDate()} - ${sunday.getUTCMonth() + 1}/${sunday.getUTCDate()}`;

            // initialize week in the map if not already existing
            if (!groupedPosts.has(weekRange)) {
                groupedPosts.set(weekRange, []);
            }
            groupedPosts.get(weekRange)!.push(post);
        }

    });
    return groupedPosts;
}

// The post feed accordian-style sidebar.
export default function PostSidebar() {
    var today = getTodaysDate();
    var yesterday = getYesterdayDate();
    var datesLastWeek = getLastWeekDates();
    var thisWeekDates = datesLastWeek.concat(today, yesterday);
    var groupedPostsMap = groupPostsByWeek(thisWeekDates, posts);

    const navigate = useNavigate();
    const { cid } = useParams();
  
    const navButton = () => {
      navigate(`/Kambaz/Courses/${cid}/Piazza/NewPostPage`);
    }

    return (
        <div id="wd-left-padding"
        className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white border-end" style={{ width: "380px" }}>
            {/* Sidebar Header */}
            <a className="d-flex align-items-center p-3 link-dark text-decoration-none border-bottom">
                <span className="fs-5 fw-semibold">Posts</span>
            </a>
            <div id="feed_list_wrapper">
                <div id="feed_search_bar">
                    <button className="wd-new-post-button" onClick={navButton}>
                                  <BsFileEarmarkPostFill className="me-1 mb-1 fs-6"/>
                                  New Post</button>
                    <div id="search_bar" role="search" className="ms-1">
                        <input type="text" placeholder="Search or add a post..." id="search-box" className="form-control" />
                    </div>
                </div>


                {/* Dropdown Section */}
                <div className="accordion" id="postAccordion">
                    <div className="card border-0">
                        {/* Today Dropdown Header */}
                        <div
                            className="mb-0 bucket-header gray-bar d-flex align-items-center px-3 py-2"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseToday"
                            aria-expanded="true"
                            aria-controls="collapseToday"
                        >
                            <span aria-hidden="true" className="me-1">▾</span>
                            <span>TODAY</span>
                        </div>

                        {/* Today Collapsible Content */}
                        <div id="collapseToday" className="collapse show">
                            <ul className="list-group list-group-flush">
                                {posts
                                    .filter((post) => formatDate(post.datePosted) === today)
                                    .map((post) => (
                                        <li className="list-group-item feed_item p-3" key={post._id}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center flex-grow-1 text-truncate">
                                                    {post.instructor === 0 && <InstructorIcon />}
                                                    <small className="fw-bold me-1 small post-title">{post.title}</small>
                                                </div>
                                                <div className="text-muted small">{extractTime(post.datePosted)}</div>
                                            </div>
                                            <div className="text-muted small post-content">{post.content}</div>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        {/* Yesterday Dropdown Header */}
                        <div
                            className="mb-0 bucket-header gray-bar d-flex align-items-center px-3 py-2"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseYesterday"
                            aria-expanded="true"
                            aria-controls="collapseYesterday"
                        >
                            <span aria-hidden="true" className="me-1">▾</span>
                            <span>YESTERDAY</span>
                        </div>

                        {/* Yesterday Collapsible Content */}
                        <div id="collapseYesterday" className="collapse show">
                            <ul className="list-group list-group-flush">
                                {posts
                                    .filter((post) => formatDate(post.datePosted) === yesterday)
                                    .map((post) => (
                                        <li className="list-group-item feed_item p-3" key={post._id}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center flex-grow-1 text-truncate">
                                                    {post.instructor === 0 && <InstructorIcon />}
                                                    <small className="fw-bold me-1 small post-title">{post.title}</small>
                                                </div>
                                                <div className="small text-muted">{extractTime(post.datePosted)}</div>
                                            </div>
                                            <div className="text-muted small post-content">{post.content}</div>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        {/* Last Week Dropdown Header - TODO: may want to have the data sorted so the days appear in order of most to least recent */}
                        <div
                            className="mb-0 bucket-header gray-bar d-flex align-items-center px-3 py-2"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseLastWeek"
                            aria-expanded="true"
                            aria-controls="collapseLastWeek"
                        >
                            <span aria-hidden="true" className="me-1">▾</span>
                            <span>LAST WEEK</span>
                        </div>

                        {/* Last Week Collapsible Content */}
                        <div id="collapseLastWeek" className="collapse show">
                            <ul className="list-group list-group-flush">
                                {posts
                                    .filter((post) => datesLastWeek.includes(formatDate(post.datePosted)))
                                    .map((post) => (
                                        <li className="list-group-item feed_item p-3" key={post._id}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center flex-grow-1 text-truncate">
                                                    {post.instructor === 0 && <InstructorIcon />}
                                                    <div className="fw-bold me-1 small post-title">{post.title}</div>
                                                </div>
                                                <div className="small text-muted">{getDayOfWeek(post.datePosted)}</div>
                                            </div>
                                            <div className="text-muted small post-content">{post.content}</div>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        {/* Date Range Display for Older Posts */}
                        {Array.from(groupedPostsMap.entries()).map(([dateRange, postsInRange]) => (
                            <div>
                                <div
                                    className="mb-0 bucket-header gray-bar d-flex align-items-center px-3 py-2"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${dateRange.replace(/[^a-zA-Z0-9]/g, "")}`} // remove the / and - characters from the date range string
                                    aria-expanded="true"
                                    aria-controls={`collapse${dateRange.replace(/[^a-zA-Z0-9]/g, "")}`}
                                >
                                    <span aria-hidden="true" className="me-1">▾</span>
                                    <span>{dateRange}</span>
                                </div>

                                <div id={`collapse${dateRange.replace(/[^a-zA-Z0-9]/g, "")}`} className="collapse show">
                                    <ul className="list-group list-group-flush">
                                        {postsInRange
                                            .map((post: { _id: string; folderId: string; authorId: string; datePosted: string; type: number; instructor: number; title: string; content: string; followUpQuestions: string; studentResponse: string; instructorResponse: string; viewers: string; courseId: string; }) => (
                                                <li className="list-group-item feed_item p-3" key={post._id}>
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center flex-grow-1 text-truncate">
                                                            {post.instructor === 0 && <InstructorIcon />}
                                                            <div className="fw-bold me-1 small post-title">{post.title}</div>
                                                        </div>
                                                        <div className="small text-muted">{formatDate(post.datePosted)}</div>
                                                    </div>
                                                    <div className="text-muted small post-content">{post.content}</div>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
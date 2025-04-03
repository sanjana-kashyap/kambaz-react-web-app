
import express from 'express';
import * as mongoDB from "mongodb";
import cors from 'cors';
import * as dotenv from "dotenv";
import path from 'path';
import { ObjectId } from 'mongodb';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const dbConn = process.env.DB_CONN_STRING;
const client = new mongoDB.MongoClient(dbConn);

// connect to the DB once at startup
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

connectDB();

const db = client.db("piazza");
const posts = db.collection("posts");
const answers = db.collection("answers");
const users = db.collection("users");
const followupDiscussions = db.collection("followupDiscussions");
const replies = db.collection("replies");


const __dirname = path.dirname(new URL(import.meta.url).pathname);

const postsFilePath = '/Users/katiewinkleblack/Desktop/2025/WEBDEV_NEW/PazzaProject/ACTUAL/pazza-react-web-app/src/Kambaz/Database/posts.json';


app.post('/api/post', (req, res) => {
    console.log("received body");
    console.log(postsFilePath);
    const newPost = req.body;

    fs.readFile(postsFilePath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).send('Error reading posts');
        }

        const posts = JSON.parse(data || '[]');
        posts.push(newPost);

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving post');
            }
            res.status(201).send('Post added successfully');
        });
    });

});

// get all posts in database
app.get('/api/post/posts', async (req, res) => {
    try {
        const allPosts = await posts.find({}).toArray();
        console.log('all posts: ', allPosts);
        res.status(200).send(allPosts);
    } catch (err) {
        res.status(500).send(`Error fetching posts: ${err}`);
    }
});

// get an individual post by its post ID
app.get('/api/post/:pid', async (req, res) => {
    try {
        // post id is a request parameter 
        const { pid } = req.params;

        // ensure that the id is a valid id
        if (!mongoDB.ObjectId.isValid(pid)) {
            res.status(400).send('Invalid ID format');
            return;
        }

        // fetch the post from the database - returns null if there is not a post with that id 
        const fetchedPost = (await posts.findOne({ _id: new ObjectId(pid) }));
        console.log('fetched post: ', fetchedPost, ", pid: ", pid);
        res.json(fetchedPost);
    } catch (err) {
        res.status(500).send(`Error when fetching post: ${err}`);
    }
});

// get an individual answer by its answer ID
app.get('/api/answer/:aid', async (req, res) => {
    try {
        // answer id is a request parameter 
        const { aid } = req.params;

        // ensure that the id is a valid id
        if (!mongoDB.ObjectId.isValid(aid)) {
            res.status(400).send('Invalid ID format');
            return;
        }

        const fetchedAnswer = (await answers.findOne({ _id: new ObjectId(aid) }));
        res.json(fetchedAnswer);
    } catch (err) {
        res.status(500).send(`Error when fetching answer: ${err}`);
    }
});

// update an answer's content 
app.post('/api/answer/updateAnswer', async (req, res) => {
    try {
        // answer id is a request parameter 
        const { aid, newContent } = req.body;

        // ensure that the id is a valid id
        if (!mongoDB.ObjectId.isValid(aid)) {
            res.status(400).send('Invalid ID format');
            return;
        }

        const updatedAnswer = await answers.findOneAndUpdate(
            { _id: new ObjectId(aid) },
            { $set: { content: newContent } },
            { returnDocument: "after" }
        );

        res.json(updatedAnswer);
    } catch (err) {
        res.status(500).send(`Error when updating answer: ${err}`);
    }
}); 

// create a new answer
app.post('/api/answer/createAnswer', async (req, res) => {
    if (!(req.body.postId !== undefined &&
        req.body.postId !== '' &&
        req.body.type !== undefined &&
        req.body.authors !== undefined &&
        req.body.authors.length() !== 0 &&
        req.body.content !== undefined &&
        req.body.content !== '' &&
        req.body.dateEdited !== undefined &&
        req.body.dateEdited !== '')) {
        res.status(400).send('Invalid answer body');
        return;
    }
    const newAnswer = req.body;
    try {
        const result = await answers.insertOne(newAnswer);
        const createdAnswer = await answers.findOne({ _id: result.insertedId });
        res.json(createdAnswer);
    } catch (err) {
        res.status(500).send(`Error when creating answer: ${err}`);
    }
});

// get an individual user by their user ID
app.get('/api/user/:uid', async (req, res) => {
    try {
        // user id is a request parameter 
        const { uid } = req.params;

        const fetchedUser = (await users.findOne({ _id: uid }));
        res.json(fetchedUser);
    } catch (err) {
        res.status(500).send(`Error when fetching ansuserwer: ${err}`);
    }
});

// get an individual followup discussion by its ID
app.get('/api/followupDiscussion/:fudid', async (req, res) => {
    try {
        // followup discussion id is a request parameter 
        const { fudid } = req.params;

        // ensure that the id is a valid id
        if (!mongoDB.ObjectId.isValid(fudid)) {
            res.status(400).send('Invalid ID format');
            return;
        }
        const fetchedDiscussion = (await followupDiscussions.findOne({ _id: new ObjectId(fudid) }));
        res.json(fetchedDiscussion);
    } catch (err) {
        res.status(500).send(`Error when fetching discussion: ${err}`);
    }
});

// create a new followup discussion 
app.post('/api/followupDiscussion/createDiscussion', async (req, res) => {
    if (!(req.body.postId !== undefined &&
        req.body.postId !== '' &&
        req.body.authorId !== undefined &&
        req.body.authorId !== '' &&
        req.body.datePosted !== undefined &&
        req.body.datePosted !== '' &&
        req.body.content !== undefined &&
        req.body.content !== '' &&
        req.body.replies !== undefined)) {
        res.status(400).send('Invalid discussion body');
        return;
    }
    const newDiscussion = req.body;
    try {
        const result = await followupDiscussions.insertOne(newDiscussion);
        const createdDiscussion = await followupDiscussions.findOne({ _id: result.insertedId });
        res.json(createdDiscussion);
    } catch (err) {
        res.status(500).send(`Error when creating discussion: ${err}`);
    }
});

// add a followup discussion to post 
app.post('/api/post/addDiscussion', async (req, res) => {
    try {

        const { pid, fudId } = req.body;

        // ensure that the id is a valid id
        if (!mongoDB.ObjectId.isValid(pid) || !mongoDB.ObjectId.isValid(fudId)) {
            res.status(400).send('Invalid ID format');
            return;
        }

        const updatedPost = await posts.findOneAndUpdate(
            { _id: new ObjectId(pid) },
            { $addToSet: { followupDiscussions: fudId } },
            { returnDocument: "after" }
        );

        res.json(updatedPost);
    } catch (err) {
        res.status(500).send(`Error when adding discussion to post: ${err}`);
    }
})

// get an individual followup discussion reply by its ID
app.get('/api/reply/:rid', async (req, res) => {
    try {
        // reply id is a request parameter 
        const { rid } = req.params;

        // ensure that the id is a valid id
        if (!mongoDB.ObjectId.isValid(rid)) {
            res.status(400).send('Invalid ID format');
            return;
        }

        const fetchedReply = (await replies.findOne({ _id: new ObjectId(rid) }));
        res.json(fetchedReply);
    } catch (err) {
        res.status(500).send(`Error when fetching reply: ${err}`);
    }
});

// app.listen(3000, 'localhost', () => {
//     console.log('Server running on Port 3000');
// });
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log(`Server running on Port ${process.env.PORT || 3000}`);
});

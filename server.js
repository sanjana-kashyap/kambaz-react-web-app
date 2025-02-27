
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();


import cors from 'cors';

app.use(cors());

app.use(express.json());

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const postsFilePath = '/Users/katiewinkleblack/WEBDEV/pazza-react-web-app/src/Kambaz/Database/posts.json';


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

app.listen(3000, 'localhost', () => {
    console.log('Server running on Port 3000');
});

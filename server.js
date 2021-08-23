// Require the modules
const express = require('express');
// Instantiate express server
const app = express();
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
// Use CORS and bodyParser
app.use(cors());
app.use(bodyParser.json());


// Create Multer instance using diskStorage engine to save uploaded files to machine's file system
const storage = multer.diskStorage({
    destination: './src/resources/',
    filename: function(req, file, cb) {
        cb(null, `uploaded_file.pdf`);
    }
})

// upload instance handling a single file uploaded
const upload = multer({ storage: storage }).single('uploaded_file');

// POST route
app.post('/upload', upload, function(req, res) {
    // Upload instance 
    upload(req, res, function(err) {
        // Check for errors (MulterError first then other errors)
        if(err instanceof multer.MulterError) {
            console.log('There\'s a MulterError.');
            return res.status(500).json(err);
        } else if(err) {
            console.log('There\'s another error (not MulterError).');
            return res.status(500).json(err);
        }

        console.log(req.file);          // the file uploaded
        console.log('Upload success');
        return res.status(200).send(req.file);
    })    
})

app.post('/modify', (req, res, next) => {
    console.log('You clicked modify!');
    // Print the request received
    console.log(`from post /modify ${req.body}`);
    // Redirect user to /modify in the front-end
    res.redirect('http://localhost:3000/modify');
})

app.get('/modify', (req, res, next) => {
    console.log(`in get /modify ${req.body}`);
    console.log('get modify');
    // Send response back to client
    res.status(200).send('received in the backend');
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})
// Require the modules
const express = require('express');
// Instantiate express server
const app = express();
const multer = require('multer');
const cors = require('cors');
// Use CORS for the server
app.use(cors());


// Create Multer instance using diskStorage engine to save uploaded files to machine's file system
const storage = multer.diskStorage({
    destination: './src/components/Upload',
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

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})
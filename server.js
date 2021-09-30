// Require the modules
const express = require('express');
// Instantiate express server
const app = express();
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PDFDocument, StandardFonts, rgb, PageSizes } = require('pdf-lib');
const fs = require('fs');
// Use CORS and bodyParser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Create Multer instance using diskStorage engine to save uploaded files to machine's file system
const storage = multer.diskStorage({
    destination: './src/resources/files/',
    filename: function(req, file, cb) {
        const fileExt = file.mimetype.split('/')[1];
        let date = new Date().toDateString();
        cb(null, `${date}-uploaded_file.${fileExt}`);
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

        // console.log(req.file);          // the file uploaded
        console.log('Upload success');
        return res.status(200).send(req.file);
    })    
})

app.post('/create', async (req, res, next) => {
    // console.log('printed from server side');
    console.log(req.body);

    const filename = req.body.filename;
    const author = req.body.author;
    const fields = req.body.fields;

    // create PDFDocument instance
    const pdf = await PDFDocument.create();
    // set document metadata
    pdf.setCreator(author);
    pdf.setAuthor(author);
    pdf.setCreationDate(new Date());
    pdf.setTitle(filename, { showInWindowTitleBar: true });
    // embed font into the document
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    // add blank page to the document, use defined A4 size for it
    const page = pdf.addPage(PageSizes.A4);
    // get page sizes
    const { width, height } = page.getSize();
    // set default font and fontsize
    page.setFont(font);
    page.setFontSize(20);
    page.setFontColor(rgb(0, 0, 0,));

    // get form on the page
    const form = pdf.getForm();

    // Loop through the fields, create input fields based on the type, use its name property and give position based on coordinates
    fields.forEach(inputField => {
        // check the fieldtype
        inputField.x = Number(inputField.x);
        inputField.y = Number(inputField.y);
        switch(inputField.type) {
            case 'dropdown':
                // console.log(inputField.options);
                page.drawText(inputField.name, {x: inputField.x, y: inputField.y - 15});
                const dropdown = form.createDropdown(inputField.name);
                dropdown.addOptions(inputField.options);
                dropdown.select(inputField.options[0]);
                dropdown.addToPage(page, {x: inputField.x, y: inputField.y});
                break;
            case 'textfield':
                page.drawText(inputField.name, {x: inputField.x, y: inputField.y - 15});
                const textfield = form.createTextField(inputField.name);
                textfield.addToPage(page, {x: inputField.x, y: inputField.y});
                break;
            case 'checkbox':
                console.log(inputField.options);
                page.drawText(inputField.name, {x: inputField.x, y: inputField.y - 15});

                for(let option = 0; option < inputField.options.length; option++) {
                    // add text for the input field (i.e., checkbox)
                    page.drawText(inputField.options[option], {x: inputField.x, y: inputField.y -= 3});
                    // create the actual checkbox
                    const checkbox = form.createCheckBox(`${inputField.name}.${inputField.options[option]}`);
                    // add checkbox to the page
                    checkbox.addToPage(page, {x: inputField.x, y: inputField.y -= 3})
                }
                break;
            case 'radio':
                // console.log(inputField.options);
                page.drawText(inputField.name, {x: inputField.x, y: inputField.y - 15});

                // create the actual radio group
                const radio = form.createRadioGroup(inputField.name);
                for(let option = 0; option < inputField.options.length; option++) {
                    // add text for the input field (i.e., radio)
                    page.drawText(inputField.options[option], {x: inputField.x, y: inputField.y -= 3});
                    radio.addOptionToPage(inputField.options[option], page, {x: inputField.x, y: inputField.y -= 1});
                }
                break;
            default:
                // create a textfield by default
                page.drawText(inputField.name, {x: inputField.x, y: inputField.y - 15});
                const defaultField = form.createTextField(inputField.name);
                defaultField.addToPage(page, {x: inputField.x, y: inputField.y});
                break;
        }
    });

    // save document
    const createdPdf = await pdf.save();
    fs.writeFileSync(`./src/resources/files/CREATED-${new Date().toDateString()}-created_file.pdf`, createdPdf, function(err, data) {
        if(err) {
            console.error(err);
            res.status(500).send('Error encountered! File creation failed.');
        } else {
            console.log('Document created');
            res.status(200).send('Document created');
        }
    });
})

app.get('/display', async (req, res, next) => {
    let extractedFields;
    try {
        extractedFields = await readFile();
        return res.send(extractedFields);
    } catch (err) {
        console.error(err);
    }
})

const readFile = async () => {
    const file = fs.readFileSync(`./src/resources/files/${new Date().toDateString()}-uploaded_file.pdf`);

    const pdf = await PDFDocument.load(file);
    const form = pdf.getForm();
    const formFields = form.getFields();
    let fields = {};

    formFields.forEach(field => {
        const fieldType = field.constructor.name;
        const fieldName = field.getName();

        fields[fieldName] = fieldType;
    });

    // Array of field types
    let dropdowns = [];
    let checkboxes = [];
    let radios = [];
    let textfields = [];
    let numfields = [];
    let optionLists = [];

    for (const key in fields) {
        switch (fields[key]) {
            case 'PDFDropdown':
                /*
                    1. Get dropdown element with the given key/name
                    2. Set the name and get the option values, then store as an object to append to the dropdowns array
                        - dropdownName will be used in name attribute for the HTML tag
                        - dropdownOptions will be used in value attribute for the HTML tag
                */
                const dropdown = form.getDropdown(key);
                const dropdownName = key;
                const selectedDropdown = dropdown.getSelected()[0];
                const dropdownOptions = dropdown.getOptions();
                dropdowns.push({
                    name: dropdownName,
                    options: dropdownOptions,
                    selectedDropdown
                });
                break;
            case 'PDFCheckBox':
                const checkbox = form.getCheckBox(key);
                const checkboxName = key;
                const checkboxValue = checkbox.isChecked();
                checkboxes.push({
                    name: checkboxName,
                    value: checkboxValue
                });
                break;
            case 'PDFRadioGroup':
                const radio = form.getRadioGroup(key);
                // Prevent deselecting radio button if it's already selected
                radio.disableOffToggling();
                // Get the radio button that's selected
                const selectedRadio = radio.getSelected();
                const radioName = key;
                const radioOptions = radio.getOptions();
                radios.push({
                    name: radioName,
                    options: radioOptions,
                    selectedRadio
                });
                break;
            case 'PDFTextField':
                const textfield = form.getTextField(key);
                const textfieldName = key;
                const textfieldValue = textfield.getText();
                textfields.push({
                    name: textfieldName,
                    value: textfieldValue
                })
                break;
            case 'PDFOptionList':
                const optionList = form.getOptionList(key);
                const optionListName = key;
                const optionListOptions = optionList.getOptions();
                optionLists.push({
                    name: optionListName,
                    options: optionListOptions
                });
                break;
            default:
                // const field = form.getTextField(key);
                // const fieldName = key;
                // const fieldValue = field.getText();
                // textfields.push({
                //     name: fieldName,
                //     value: fieldValue
                // })
                break;
        }
    }
    const extractedFields = {
        dropdowns,
        checkboxes,
        textfields,
        radios,
        optionLists
    };
    return extractedFields;
}

app.post('/modify', async (req, res, next) => {
    const data = req.body;
    // fields - all are arrays of objects
    let dropdowns = data.dropdowns;
    let textfields = data.textfields;
    let checkboxes = data.checkboxes;
    let radios = data.radios;

    // console.log(dropdowns);
    // console.log(textfields);
    // console.log(checkboxes);
    // console.log(radios);

    // Load the original file
    let savedOriginalFile = fs.readFileSync(`./src/resources/files/${new Date().toDateString()}-uploaded_file.pdf`);
    const originalFile = await PDFDocument.load(savedOriginalFile);
    const form = originalFile.getForm();

    // Update the fields on original file to new ones
    dropdowns.forEach(item => {
        const dropdown = form.getDropdown(item.name);
        dropdown.select(item.selectedDropdown);
    });

    checkboxes.forEach(item => {
        const checkbox = form.getCheckBox(item.name);
        if(item.value) {
            checkbox.check();
        } else {
            checkbox.uncheck();
        }
    });

    radios.forEach(item => {
        const radio = form.getRadioGroup(item.name);
        radio.select(item.selectedRadio);
    });

    textfields.forEach(item => {
        const textfield = form.getTextField(item.name);
        textfield.setText(item.value);
    });

    // save the changes
    const updatedFile = await originalFile.save();

    // save to original file
    fs.writeFileSync(`./src/resources/files/${new Date().toDateString()}-uploaded_file.pdf`, updatedFile, function(err, data) {
        if(err) {
            console.error(err);
            res.status(500).send('Error encountered! File modification not saved.');
        } else {
            console.log('Document modified');
            res.status(200).send('Document modified');
        }
    });
})

app.post('/modify-to_new_file', async (req, res, next) => {
    const data = req.body;
    // fields - all are arrays of objects
    let dropdowns = data.dropdowns;
    let textfields = data.textfields;
    let checkboxes = data.checkboxes;
    let radios = data.radios;

    // console.log(dropdowns);
    // console.log(textfields);
    // console.log(checkboxes);
    // console.log(radios);

    // Load the original file
    let savedOriginalFile = fs.readFileSync(`./src/resources/files/${new Date().toDateString()}-uploaded_file.pdf`);
    const originalFile = await PDFDocument.load(savedOriginalFile);
    const form = originalFile.getForm();

    // Update the fields on original file to new ones
    dropdowns.forEach(item => {
        const dropdown = form.getDropdown(item.name);
        dropdown.select(item.selectedDropdown);
    });

    checkboxes.forEach(item => {
        const checkbox = form.getCheckBox(item.name);
        if(item.value) {
            checkbox.check();
        } else {
            checkbox.uncheck();
        }
    });

    radios.forEach(item => {
        const radio = form.getRadioGroup(item.name);
        radio.select(item.selectedRadio);
    });

    textfields.forEach(item => {
        const textfield = form.getTextField(item.name);
        textfield.setText(item.value);
    });

    // save the changes
    const updatedFile = await originalFile.save();

    // save to original file
    fs.writeFileSync(`./src/resources/files/MODIFIED-${new Date().toDateString()}-uploaded_file.pdf`, updatedFile, function(err, data) {
        if(err) {
            console.error(err);
            res.status(500).send('Error encountered! File modification not saved.');
        } else {
            console.log(data);
            console.log('Document modified');
            res.status(200).send('Document modified');
        }
    });
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})
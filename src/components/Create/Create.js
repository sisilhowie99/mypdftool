import React from 'react';
// INSTALL FIRST (04/08) - import PDF-LIB package

class Create extends React.Component {
    render() {
        return (
            <div className='container create-container'>
                <h1>Create a new fillable PDF form file</h1>
            </div>
        )
    }
}

export default Create;

/* 
        const data = new FormData();
        data.append('uploadedFile', this.state.uploadedFile);
        axios.post('http://localhost:8000/upload', data).then(res => {
            console.log(res.statusText);
        })

        // const reader = new FileReader();
        // reader.readAsArrayBuffer(this.state.uploadedFile);
        // // reader.readAsDataURL(this.state.uploadedFile);       // Using .readAsDataURL() also works

        // reader.onload = e => {
        //     console.log(reader.result);

        //     const pdfDoc = PDFDocument.load(reader.result);

        //     // const data = reader.result;
        //     const data = this.state.uploadedFile;
        //     axios.post('http://localhost:8000/upload', data).then(res => {
        //         console.log(res.statusText);
        //     });

        //     this.setState({
        //         frame: <>{<iframe src={pdfDoc} title="test-frame" type="application/pdf" className='pdf-viewer'></iframe>}</>,
        //         fileUInt8Array: new Uint8Array(reader.result)
        //     })
        // };

*/
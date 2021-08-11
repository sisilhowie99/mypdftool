import React from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
// Display annotations in PDF rendered by react-pdf
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';


class SinglePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfPages: null,
            pageNumber: 1,
            isLoading: false,
            loadingStatus: ''
        }
        this.handleSuccessDocumentLoad = this.handleSuccessDocumentLoad.bind(this);
        this.changePage = this.changePage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
    }

    handleDocumentLoading() {
        this.setState({
            loadingStatus: 'Loading PDF file',
            isLoading: true
        });
    }

    handleSuccessDocumentLoad(pdf) {
        this.setState({
            isLoading: false,
            numOfPages: pdf.numPages
        })
    }

    changePage(offset) {
        this.setState({
            pageNumber: this.state.pageNumber + offset
        });
      }
    

    nextPage() {
        this.changePage(1);
    }

    previousPage() {
        this.changePage(-1);
    }


    render() {
        return (
            <>
                <Document
                    file={this.props.file}
                    options={{ workerSrc: "/pdf.worker.js" }}
                    onLoadSuccess={this.handleSuccessDocumentLoad}
                >
                    {this.state.isLoading ? this.state.loadingStatus : <Page pageNumber={this.state.pageNumber} renderAnnotationLayer={true} renderInteractiveForms={true} />}
                </Document>
                <div>
                    <p>Page {this.state.pageNumber || (this.state.numOfPages ? 1 : "--")} of {this.state.numOfPages || "--"}</p>
                    <button
                        type="button"
                        disabled={this.state.pageNumber <= 1}
                        onClick={this.previousPage}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        disabled={this.state.pageNumber >= this.state.numOfPages}
                        onClick={this.nextPage}
                    >
                        Next
                    </button>
                </div>
            </>
        )
    }
}

export default SinglePage;

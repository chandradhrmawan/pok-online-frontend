import { CButton } from "@coreui/react";
import React, { useState } from "react";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

const PdfViewer = ({ url }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <>
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <div>
                <p>
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                </p>
                <CButton
                    color="primary"
                    variant="outline"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                >
                    Previous
                </CButton>
                <CButton
                    color="primary"
                    className="ml-2"
                    variant="outline"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                >
                    Next
                </CButton>
            </div>
        </>
    );
};

export default PdfViewer;
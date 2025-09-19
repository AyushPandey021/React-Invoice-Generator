import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function GenerateInvoice(fileName = "invoice.pdf") {
  const invoiceElement = document.querySelector("#invoiceCapture");
  if (!invoiceElement) return;

  html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792], // Letter page size
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
  });
}

const InvoiceModal = ({ showModal, closeModal, info, items, currency, subTotal, taxAmmount, discountAmmount, total }) => {
  const fileName = `invoice-${info.invoiceNumber || "001"}-${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;

  return (
    <Modal show={showModal} onHide={closeModal} size="lg" centered>
      {/* Invoice Capture Section */}
      <div id="invoiceCapture" style={{ background: "white", minWidth: "600px" }}>
        {/* Header */}
        <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
          <div className="w-100">
            <h4 className="fw-bold my-2">{info.billFrom || "John Uberbacher"}</h4>
            <h6 className="fw-bold text-secondary mb-1">
              Invoice #: {info.invoiceNumber || ""}
            </h6>
          </div>
          <div className="text-end ms-4">
            <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
            <h5 className="fw-bold text-secondary">
              {currency} {total}
            </h5>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <div className="fw-bold">Billed to:</div>
              <div>{info.billTo || ""}</div>
              <div>{info.billToAddress || ""}</div>
              <div>{info.billToEmail || ""}</div>
            </Col>
            <Col md={4}>
              <div className="fw-bold">Billed From:</div>
              <div>{info.billFrom || ""}</div>
              <div>{info.billFromAddress || ""}</div>
              <div>{info.billFromEmail || ""}</div>
            </Col>
            <Col md={4}>
              <div className="fw-bold mt-2">Date Of Issue:</div>
              <div>{info.dateOfIssue || ""}</div>
            </Col>
          </Row>

          {/* Item Table */}
          <Table className="mb-0">
            <thead>
              <tr>
                <th>QTY</th>
                <th>DESCRIPTION</th>
                <th className="text-end">PRICE</th>
                <th className="text-end">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ width: "70px" }}>{item.quantity}</td>
                  <td>{item.name} - {item.description}</td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {item.price}
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Totals */}
          <Table>
            <tbody>
              <tr className="text-end">
                <td></td>
                <td className="fw-bold" style={{ width: "100px" }}>SUBTOTAL</td>
                <td className="text-end" style={{ width: "100px" }}>
                  {currency} {subTotal}
                </td>
              </tr>
              {taxAmmount !== 0.0 && (
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>TAX</td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {taxAmmount}
                  </td>
                </tr>
              )}
              {discountAmmount !== 0.0 && (
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>DISCOUNT</td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {discountAmmount}
                  </td>
                </tr>
              )}
              <tr className="text-end">
                <td></td>
                <td className="fw-bold" style={{ width: "100px" }}>TOTAL</td>
                <td className="text-end" style={{ width: "100px" }}>
                  {currency} {total}
                </td>
              </tr>
            </tbody>
          </Table>

          {/* Notes */}
          {info.notes && (
            <div className="bg-light py-3 px-4 rounded">{info.notes}</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pb-4 px-4">
        <Row>
          <Col md={6}>
            <Button
              variant="primary"
              className="d-block w-100"
              onClick={() => GenerateInvoice(fileName)}
            >
              <BiPaperPlane className="me-2" style={{ width: "15px", height: "15px", marginTop: "-3px" }} />
              Send Invoice
            </Button>
          </Col>
          <Col md={6}>
            <Button
              variant="outline-primary"
              className="d-block w-100 mt-3 mt-md-0"
              onClick={() => GenerateInvoice(fileName)}
            >
              <BiCloudDownload className="me-2" style={{ width: "16px", height: "16px", marginTop: "-3px" }} />
              Download Copy
            </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default InvoiceModal;

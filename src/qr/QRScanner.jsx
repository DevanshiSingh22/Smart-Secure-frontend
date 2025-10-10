import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanSuccess, qrRegionId = "qr-reader" }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(qrRegionId);

    html5QrCode
      .start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          onScanSuccess(decodedText);
          html5QrCode.stop().catch(() => {});
        },
        (errorMessage) => {
          console.log("QR scan error:", errorMessage);
        }
      )
      .catch((err) => console.error("QR Scanner failed to start:", err));

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [onScanSuccess, qrRegionId]);

  return <div id={qrRegionId} ref={scannerRef}></div>;
};

export default QRScanner;

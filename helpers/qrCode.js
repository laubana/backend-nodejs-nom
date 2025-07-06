const QRCode = require("qrcode");

const generateQrCode = async (data) => {
  try {
    const qrData = JSON.stringify(data);
    const qrCodeBuffer = await QRCode.toBuffer(qrData);
    const base64QRCode = qrCodeBuffer.toString("base64");
    return base64QRCode;
  } catch (error) {
    console.error("Error generating Base64 QR code:", error);

    throw error;
  }
};

module.exports = {
  generateQrCode,
};

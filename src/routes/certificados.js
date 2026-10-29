const express = require("express");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const { randomUUID, randomBytes } = require("crypto");

module.exports = function (db) {
  const router = express.Router();
  const certificados = db.collection("certificados");

  router.post("/", async (req, res) => {
    try {
      const nome = String(req.body.nome || "").trim();

      if (nome.length < 2 || nome.length > 100) {
        return res.status(400).json({
          erro: "Informe um nome entre 2 e 100 caracteres."
        });
      }

      const id = randomUUID();
      const codigo = randomBytes(6).toString("hex").toUpperCase();
      const dataEmissao = new Date();

      const certificado = {
        id,
        codigo,
        titular: nome,
        curso: "MongoDB para Desenvolvedores",
        dataEmissao,
        status: "valido",
        demonstrativo: true
      };

      await certificados.insertOne(certificado);

      const urlValidacao =
        `http://localhost:3000/validar.html?codigo=${codigo}`;

      const qr = await QRCode.toDataURL(urlValidacao);

      const pdf = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 45
      });

      const chunks = [];

      pdf.on("data", chunk => chunks.push(chunk));

      pdf.on("error", error => {
        console.error("Erro ao gerar PDF:", error);
      });

      pdf.on("end", () => {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="certificado-${id}.pdf"`
        );

        res.send(Buffer.concat(chunks));
      });

      pdf.rect(0, 0, 842, 595).fill("#0b1020");

      pdf.rect(18, 18, 806, 559)
        .lineWidth(2)
        .strokeColor("#818cf8")
        .stroke();

      pdf.fillColor("#a5b4fc")
        .fontSize(15)
        .text("DEVSTART ACADEMY", 50, 55, {
          align: "center",
          width: 742
        });

      pdf.fillColor("#ffffff")
        .fontSize(34)
        .text("Certificado de Conclusão", 50, 115, {
          align: "center",
          width: 742
        });

      pdf.fillColor("#cbd5e1")
        .fontSize(15)
        .text("Certificamos, para fins demonstrativos, que", 50, 190, {
          align: "center",
          width: 742
        });

      pdf.fillColor("#ffffff")
        .fontSize(27)
        .text(nome, 50, 225, {
          align: "center",
          width: 742
        });

      pdf.fillColor("#cbd5e1")
        .fontSize(15)
        .text(
          "concluiu o módulo MongoDB para Desenvolvedores.",
          50,
          275,
          { align: "center", width: 742 }
        );

      pdf.fillColor("#a5b4fc")
        .fontSize(12)
        .text(`Código autenticador: ${codigo}`, 50, 330, {
          align: "center",
          width: 742
        });

      pdf.fontSize(11)
        .fillColor("#cbd5e1")
        .text(
          `Emitido em: ${dataEmissao.toLocaleDateString("pt-BR")}`,
          50,
          355,
          { align: "center", width: 742 }
        );

      pdf.image(qr, 385, 390, { width: 70 });

      pdf.fillColor("#ff7777")
        .fontSize(19)
        .rotate(-18, { origin: [421, 300] })
        .text("PROTÓTIPO — SEM VALIDADE OFICIAL", 90, 420, {
          width: 662,
          align: "center"
        });

      pdf.end();
    } catch (error) {
      console.error(error);

      if (!res.headersSent) {
        res.status(500).json({
          erro: "Não foi possível gerar o certificado."
        });
      }
    }
  });

  return router;
};

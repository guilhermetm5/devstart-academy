const express = require("express");

module.exports = function (db) {
  const router = express.Router();
  const certificados = db.collection("certificados");

  router.get("/:codigo", async (req, res) => {
    try {
      const codigo = req.params.codigo.trim().toUpperCase();

      const certificado = await certificados.findOne(
        { codigo },
        {
          projection: {
            _id: 0,
            codigo: 1,
            titular: 1,
            curso: 1,
            dataEmissao: 1,
            status: 1,
            demonstrativo: 1
          }
        }
      );

      if (!certificado) {
        return res.status(404).json({
          encontrado: false,
          mensagem: "Certificado não encontrado."
        });
      }

      res.json({
        encontrado: true,
        ...certificado,
        dataEmissao: certificado.dataEmissao.toISOString()
      });
    } catch (error) {
      console.error("Erro na validação:", error);

      res.status(500).json({
        mensagem: "Não foi possível validar o certificado."
      });
    }
  });

  return router;
};

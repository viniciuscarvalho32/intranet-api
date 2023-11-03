import { Router } from "express";
import multer from "multer";
import soap from "soap";
import fs from "fs";
import { Readable } from "stream";
import readline from "readline";
import { parseString } from 'xml2js';
import util from "util";
const multerConfig = multer();
const routes = Router();

//Retornar todos as fretes disponíveis para lançamento.
routes.get("/fretes", function (req, res) {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    chvNel: " ",
  };
  let args = {
    user: "processo",
    password: "123",
    encryption: 0,
    parameters,
  };
  let resultWSDL = "";

  const urlRec = `http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl`; 
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.validacaoFrete(args, function (err, result) {
      if (result) {
        const resultWSDL = result.result.retorno;
        res.send(resultWSDL);
      }
    });
  });
});

//Disponibilizar um CT-e específico com a chave passada na requisição do formulário.
routes.post("/fretes", function (req, res) {
  const chave = req.body.chvCte;
  //console.log(`Chave no Backend: ${chave}`);
  if (chave === "") {
    res.redirect("/");
  } else {
    const opts = {
      wsdl_options: {
        proxy: process.env.QUOTAGUARDSTATIC_URL,
      },
    };

    let parameters = {
      chvNel: req.body.chvCte,
    };
    let args = {
      user: "processo",
      password: "123",
      encryption: 0,
      parameters,
    };
    let resultWSDL = "";
    const urlRec =
      "http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl";
    //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl';
    soap.createClient(urlRec, opts, function (err, client) {
      client.validacaoFrete(args, function (err, result) {
        if (result) {
          const resultWSDL = result.result.retorno;
          res.send(resultWSDL);
        }
      });
    });
  }
});
//Realizar a validação do CT-e conforme a chave passada.
routes.get("/validacao/:chave/:val", function (req, res) {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    chvNel: req.params.chave + "/" + req.params.val,
  };
  let args = {
    user: "processo",
    password: "123",
    encryption: 0,
    parameters,
  };
  let resultWSDL = "";

  const urlRec =
    "http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.validacaoFrete(args, function (err, result) {
      if (result) {
        const resultWSDL = result.result.retorno;
        res.send(resultWSDL);
      }
    });
  });
});

/* Painel Faturas HCM */
routes.get("/hcm/faturas", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {};
  let args = {
    user: "vinicius",
    password: "floripa",
    encryption: 0,
    parameters,
  };
  let resultWSDL = "";
  const urlRec = "http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.retRateioFat(args, function (err, result) {
      if (result) {
        const resultWSDL = result.result.retorno;
        res.send(resultWSDL);
      } else {
        res.send({
          message: err,
        });
      }
    });
  });
});

routes.get("/hcm/faturas/fatura/:numfat", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    numFat: req.params.numfat,
  };
  let args = {
    user: "vinicius",
    password: "floripa",
    encryption: 0,
    parameters,
  };
  let resultWSDL = "";
  const urlRec =
    "http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.retRateioFat(args, function (err, result) {
      if (result) {
        const resultWSDL = result.result.retorno;
        res.send(resultWSDL);
      } else {
        res.send({
          message: err,
        });
      }
    });
  });
});

//Busca Fatura e consiste validação
routes.post("/hcm/rateio", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  const stringRateio = JSON.stringify(req.body.rateio);
  let parameters = {
    numFat: req.body.numFat,
    rateio: stringRateio,
    origem: req.body.origem,
  };
  let args = {
    user: "vinicius",
    password: "floripa",
    encryption: 0,
    parameters,
  };
  //console.log(stringRateio);

  let resultWSDL = "";
  const urlRec =
    "http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_SyncrateioCP?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.atualizarRateioCP_planoSaude(args, function (err, result) {
      if (result) {
        //const resultWSDL = result.result.retorno;
        //console.log(result)
        //res.send(result)
        res.redirect(`/hcm/fatura/status/${req.body.numFat}/A`);
      } else {
        res.send({
          message: err,
        });
      }
    });
  });
});

routes.get("/hcm/fatura/status/:numfat/:status", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    numFat: req.params.numfat,
    status: req.params.status,
  };
  let args = {
    user: "vinicius",
    password: "floripa",
    encryption: 0,
    parameters,
  };
  //console.log(`Fatura: ${req.params.numfat} / Status: ${req.params.status}`)

  let resultWSDL = "";
  const urlRec =
    "http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.retRateioFat(args, function (err, result) {
      if (result) {
        const resultWSDL = result.result.retorno;
        //console.log(resultWSDL)
        res.send(resultWSDL);
      } else {
        res.send({
          message: err,
        });
      }
    });
  });
});

/* Painel Faturas ERP */

routes.get("/erp/faturas-erp", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {};
  let args = {
    user: "vinicius",
    password: "floripa",
    encryption: 0,
    parameters,
  };
  let resultWSDL = "";
  const urlRec =
    "http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.addFatura(args, function (err, result) {
      if (result) {
        const resultWSDL = result.result.retorno;
        res.send(resultWSDL);
      } else {
        res.send({
          message: err,
        });
      }
    });
  });
});

routes.post("/erp/faturas-erp", multerConfig.single("txtFile"), async (req, res) => {

     //console.log(req.file.buffer.toString("utf-8"));
     const { file } = req;
     const { buffer } = file;
     const readableFile = new Readable();
 
     readableFile.push(buffer);
     readableFile.push(null);
     const refuelFile = readline.createInterface({
       input: readableFile,
     });
     let fuelInvoice = [];
     var hasInvoice;
     var hasDate;
     var hasIdDriver;
     var hasValue;
     var invoiceFile;
     var dateFile;
     var idFile;
     var valueFile;
 
    for await (let line of refuelFile) {
       const fuelLineSplit = line.split(";");
       let valorAbst = fuelLineSplit[41];
       
       let vlrAbstFloat;
       if (valorAbst) {
         vlrAbstFloat = valorAbst.replace(",", ".");
       }
 
       invoiceFile = fuelLineSplit[10];
       dateFile = fuelLineSplit[13];
       idFile = fuelLineSplit[24];
       valueFile = fuelLineSplit[41]; 
 
       //console.log(`Tamanho invoice: ${invoiceFile.length}`)
         
      if (!invoiceFile) {
         hasInvoice = false;
      }
      if (!dateFile)  {
          hasDate = false; 
      }
      if (!idFile) {
          hasIdDriver = false; 
      } 
      if (!valueFile) {        
          hasValue = false;  
      }
 
      fuelInvoice.push({
          type: "combustivel",
          invoice: fuelLineSplit[10],
          date: fuelLineSplit[13],
          idDriver: fuelLineSplit[24],
          value: vlrAbstFloat,
        });
     }
     /*
     if ((!hasInvoice) || (!hasDate) || (!hasIdDriver) || (!hasValue)) {
          res.json({ message: "Uma ou mais colunas do arquivo estão em branco: K = Nota Fiscal, N = Data de Emissão, Y = CPF, AP = Valor, verifique!"});
     } else {
     */
       const opts = {
         wsdl_options: {
             proxy: process.env.QUOTAGUARDSTATIC_URL,
         },
       };
       const parameters = {
         objFatura: JSON.stringify(fuelInvoice),
       };
       //console.log(JSON.stringify(fuelInvoice));
 
       const args = {
         user: "vinicius",
         password: "floripa",
         encryption: 0,
         parameters,
       };
       //console.log(JSON.stringify(args))
 
       const resultWSDL = "";
       const urlRec = 'http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl';
       //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
       soap.createClient(urlRec, opts, function (err, client) {
         client.addFatura(args, function (err, result) { 
             //console.log(result)
             if (result) {
                 const resultWSDL = result.result.retorno;
                 res.send(resultWSDL)        
             } else {
                 res.send({
                     message: err
                 })
             } 
         })
       })
     // }
});
/* Retornar os Rateios da Fatura para posterior Validação no ERP */
routes.get("/erp/faturas-erp/fatura/:numfat", (req, res) => {
  //console.log(req.params.numfat)

  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    numFat: req.params.numfat,
  };
  let args = {
    user: "vinicius",
    password: "floripa",
    encryption: 0,
    parameters,
  };
  let resultWSDL = "";
  const urlRec = "http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.setRateioFat(args, function (err, result) {
      if (result) {
        const resultWSDL = result.result.retorno;
        res.send(resultWSDL);
      } else {
        res.send({
          message: err,
        });
      }
    });
  });
});

/* Validar os Rateios da Fatura de Abastecimento no ERP */
//Busca Fatura e consiste validação
routes.post("/erp/rateio", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  const stringRateio = JSON.stringify(req.body.rateio);
  let parameters = {
    numFat: req.body.numFat,
    rateio: stringRateio,
    origem: req.body.origem,
  };
  //console.log(parameters);

  let args = {
    user: "vinicius",
    password: "floripa",
    encryption: 0,
    parameters,
  };
  //console.log(stringRateio);
  
  let resultWSDL = "";
  const urlRec =
    "http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_SyncrateioCP?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.atualizarRateioCP_abastecimento(args, function (err, result) {
      if (result) {
        //const resultWSDL = result.result.retorno;
        //console.log(result)
        //res.send(result)
        
        //Desativado temporariamente, ate resolver a questao do WS retRateioFat atualizar o Status da Fatura de Abastecimento em outra tabela (Usu_TRatFat) 
        res.redirect(`/erp/fatura/status/${req.body.numFat}/A`);
        /*
        res.send({
          message: "Fatura de Abastecimento atualizada com sucesso!",
        });
        */
      } else {
        res.send({
          message: err,
        });
      }
    });
  });
});

routes.get("/erp/fatura/status/:numfat/:status", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    numFat: req.params.numfat,
    status: req.params.status,
  };
  let args = {
    user: "vinicius",
    password: "floripa",
    encryption: 0,
    parameters,
  };
  //console.log(`Fatura: ${req.params.numfat} / Status: ${req.params.status}`)

  let resultWSDL = "";
  const urlRec =
    "http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.setRateioFat(args, function (err, result) {
      if (result) {
        const resultWSDL = result.result.retorno;
        //console.log(resultWSDL)
        res.send(resultWSDL);
      } else {
        res.send({
          message: err,
        });
      }
    });
  });
});

routes.get("/erp/faturas-erp/fatura/rateiocc/:fat/:ccu", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    numFat: req.params.fat,
    codCcu: req.params.ccu,
  };

  //console.log(parameters)
  let args = {
    user: "vinicius",
    password: "floripa",
    encryption: 0,
    parameters,
  };
  //console.log(`Fatura: ${req.params.numfat} / Status: ${req.params.status}`)

  let resultWSDL = "";
  const urlRec =
    "http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.getRateioColaborador(args, function (err, result) {
      if (result) {
        const resultWSDL = result.result.retorno;
        //console.log(resultWSDL)
        res.send(resultWSDL);
      } else {
        res.send({
          message: err,
        });
      }
    });
  });
});


// Requisião para recuperar os dados do CT-e na SEFAZ 
routes.get('/erp/cte', (req, res) => {
  /*
  res.send({
    'msg': 'Deu Certo sem o FS'
  })
  */
  /*
  const args = {
    distDFeInt: {
      attributes: {
        xmlns: 'http://www.portalfiscal.inf.br/nfe',
        versao: '1.01',
      },
      tpAmb: 1,
      cUFAutor: 29,
      CNPJ: '83675413000101',
      distNSU: {
        ultNSU: '000000000000000'
      }
    }
  }
  const url = 'https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl';
  const opts = {    
      wsdl_options: {
        forever: true,
        rejectUnauthorized: false,
        strictSSL: false,
        pfx: fs.readFileSync('C:/inetpub/wwwroot/intranet-api/api/assets/certificadoMacromaq.pfx'),
        passphrase: 'Macro@2023'
      }
  } 
  soap.createClient(url, opts, function (err, client) {

    if(err) {
      console.log(err)
    } else {
      console.log('OK')
    }
    //err && console.log('ERRO1', err)
    
    
    client.setSecurity(new soap.ClientSSLSecurityPFX('C:/inetpub/wwwroot/intranet-api/api/assets/certificadoMacromaq.pfx', 'Macro@2023', {
      rejectUnauthorized: false,
      strictSSL: false,
      secureOptions: constants.SSL_OP_NO_TLSv1_2,
      forever: trues
    }));
    
    client.nfeDistDFeInteresse({ nfeDadosMsg: args }, (err, result) => {
      err && console.log('ERRO2', err)
  
      console.log('>>>\n', JSON.stringify(result, null, 4), '\n<<<');
    })
    
    
  });
  */
})

routes.post("/erp/cte", multerConfig.single("txtFile"), async (req, res) => {
  
  const arqXml = req.file.buffer.toString('utf-8');
  //console.log(arqXml)

  parseString(arqXml, function (err, results) {
    let data = JSON.stringify(results);
    //console.log(data)
    const opts = {
      wsdl_options: {
        proxy: process.env.QUOTAGUARDSTATIC_URL,
      },
    };
    let parameters = {
      stringArquivo: data
    };
    let args = {
      user: "vinicius",
      password: "floripa",
      encryption: 0,
      parameters,
    };
  
    //console.log(`Fatura: ${req.params.numfat} / Status: ${req.params.status}`)

    let resultWSDL = "";
    const urlRec = "http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_SynccteAutomatizado?wsdl";
    //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
    soap.createClient(urlRec, opts, function (err, client) {
      client.getXmlCte(args, function (err, result) {
        if (result) {
            const resultWSDL = result.result.retorno;
            //console.log(resultWSDL)
            res.send(resultWSDL);
        } else {
            res.send({
            message: err,
          });
        }
      });
    });
  }); 
}); 


routes.get("tickets", (req, res) => {
  
  console.log(`response: ${res}`);

})

export { routes };

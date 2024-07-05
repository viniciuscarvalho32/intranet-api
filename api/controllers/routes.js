const Router = require('express')
//import { Router } from "express";
const multer = require('multer')
//import multer from "multer";
const soap = require('soap')
//import soap from "soap";
const fs = require('fs')
//import fs from "fs";
const { Readable } = require('node:stream')
//const stream = require('node:stream');
const readline = require('readline')
//import readline from "readline";
const xml2js = require('xml2js');
const util = require('util')
//import util from "util";
const multerConfig = multer();
const routes = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
//import { auth } from "express-oauth2-jwt-bearer";
//const auth = require('auth')
//import "dotenv/config";
require('dotenv/config')
//Models
const User = require('../models/User')
var parser = new xml2js.Parser();
const userERP = process.env.ERP_USER;
const passERP = process.env.ERP_PASS;


routes.get('/teste', (req, res) => {
  res.json()
})
routes.get('/api/auth', checkToken, (req, res) => {
  res.status(200).json({
    msg: "bem vindo a nossa API",
  })
})

// Create User
routes.post('/api/auth', checkToken, async(req, res) => {
  const {name, email, password, checkpassword} = req.body.user
  // console.log(req.body.user)
  // console.log(`Name: ${name}`)
  // console.log(`Email: ${email}`)
  // console.log(`Passoword: ${password}`)
  // console.log(`checkpassword: ${checkpassword}`)

  if (!name) {
    return res.status(422).json({msg: 'O nome é obrigatório!'})
  }
  if (!email) {
    return res.status(422).json({msg: 'O email é obrigatório!'})
  }
  if (!password) {
    return res.status(422).json({msg: 'A senha é obrigatória!'})
  } 
  if (password !== checkpassword) {
    return res.status(422).json({msg: 'As senhas não conferem!'})
  }

  // check if user exists
  const userExists = await User.findOne({email: email})
  if (userExists) {
      return res.status(422).json({ msg: 'Por favor utilize outro e-mail!'})
  }
  // create password
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = new User({
    email,
    name,
    password: passwordHash
  })

  try {
    user.save()
    res.json({msg: 'Usuário cadastrado com sucesso!'})
  } catch(error) {
    res
      .status(500)
      .json({
        msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
      })
  }
})

// Login User
routes.post('/auth/login', checkToken, async(req, res) => {
  const { email, password } = req.body;
  //console.log(req.body)
  if (!email) {
    return res.status(422).json({ msg: "O email não pode estar em branco!"})
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha não pode estar em branco!"})
  }
  //Check if the User Exists
  const user = await User.findOne({ email: email})
  if (!user) {
    return res.status(404).json({ msg: "O usuário não existe!"})
  }

  //Password validation
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida!"})
  }
  try {
    const secret = process.env.SECRET;
    const token = jwt.sign({
        id:user._id
      },
      secret
    )
    //console.log(`Console Token: ${token}`)
    // res.set('Authorization', token) //envia token na resposta do servidor para o cliente
     
    res.status(200).json({
      token: token,
      uuID:user._id
     })
  } catch(err) {
    res
      .status(500)
      .json({
        msg: err
      })
    }
  //   function setToken() {
  //     const minhaToken = localStorageService.get(''); //tokenName é um exemplo do nome da `data` aramazenada na storage
  //   };
  
  //   function getToken () {
  //     return minhaToken;
  //   };
  
  //   return {
  //     setToken: setToken(),
  //     getToken: getToken
  // };
})

//Private Route
routes.post('/api', checkToken, async(req, res) => {
  const {uuID } = req.body;
  //const userId = req.body.uuID;

  //console.log(`idParametro: ${userId}`)
  const user = await User.findById(uuID, '-password')

  if (!user) {
    return res.status(404).json({msg: "Usuário não encontrado!"})
  } 
  res.status(200).json({
    user
  })
})

//Token Validation
function checkToken(req, res, next) {
  // console.log(req.body.token)
  const token = req.body.token;
  // const reqHeader = req.rowheaders;
  // console.log(`reqHeader: ${reqHeader}`)
  // const authHeader = req.headers['token']
  // console.log(`authHeader: ${authHeader}`)
  // const token = authHeader && authHeader.split(" ")[1]
 
  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!'})
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret)
    next()
  } catch(error) {
    return res.status(400).json({msg: "Token negado!" })
  }
}


// routes.post('/api/auth', (req, res) => {
//   const emailForm = req.body.email;
//   const passwordForm = req.body.password;

//   (async () => {
      
//       const db = client.db('painelintranet');
//       const users = db.collection('users')
//       const emailUser = (await users.find({}).toArray()).filter((select) => select.email == emailForm)
//       res.send(emailUser)
//   })()
// })

//Retornar todos as fretes disponíveis para lançamento.
routes.get("/fretes/:token", async(req, res) => {

  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    chvNel: " ",
  };
  let args = {
    user: userERP,
    password: passERP,
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
      user: userERP,
      password: passERP,
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
    user: userERP,
    password: passERP,
    encryption: 0,
    parameters,
  };
  let resultWSDL = "";

  const urlRec = "http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl";
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


/* Painel Faturas HCM Plano de Saúde */
routes.get("/hcm/faturas", (req, res) => {
  
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {};
  let args = {
    user: userERP,
    password: passERP,
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

//Construir o Rateio da Fatura de Plano de Saúde
routes.get("/hcm/faturas/fatura/:numfat", (req, res) => {

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
    user: userERP,
    password: passERP,
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
          message: 'Ocorreram erros ao consultar os dados no Servidor.',
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
    user: userERP,
    password: passERP,
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
    user: userERP,
    password: passERP,
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




/* Painel Faturas ERP - Abastecimento*/
routes.get("/erp/faturas-erp", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {};
  let args = {
    user: userERP,
    password: passERP,
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
    //console.log(buffer)
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
    var lineNumber;
 
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
 
      if (!invoiceFile) {
          return false;
      }
      if (!dateFile)  {
          return false; 
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
     
     const idConsist = fuelInvoice.map((id) => { 
        if (id.idDriver == false) {
          //console.log(id.idDriver)
        }
     })
     
    
     if (idFile == "00.000-00") {
        res.send({ message: "Uma ou mais linhas da coluna Y = CPF, possui o valor 00000000"});
      }  else {
     
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
         user: userERP,
         password: passERP,
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
      } 
});
/* Construir e Retornar os Rateios da Fatura para posterior Validação no ERP */
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
    user: userERP,
    password: passERP,
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
    user: userERP,
    password: passERP,
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
// Atualização de Status da Fatura
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
    user: userERP,
    password: passERP,
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

routes.get("/erp/faturas-erp/fatura/email/:fat/:email", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    numFat: req.params.fat,
    email: req.params.email,
  };

  //console.log(parameters)
  let args = {
    user: userERP,
    password: passERP,
    encryption: 0,
    parameters,
  };
  //console.log(`Fatura: ${req.params.numfat} / Status: ${req.params.status}`)

  let resultWSDL = "";
  const urlRec = "http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl";
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


// Deletar Faturas de Abastecimento
routes.get("/erp/faturas-erp/fatura/delete/:fat", (req, res) => {
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    numFat: req.params.fat,
    email: req.params.email,
  };

  //console.log(parameters)
  let args = {
    user: userERP,
    password: passERP,
    encryption: 0,
    parameters,
  };
  //console.log(`Fatura: ${req.params.numfat} / Status: ${req.params.status}`)

  let resultWSDL = "";
  const urlRec =
    "http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.deleteFatura(args, function (err, result) {
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

// Geração de CTRC 
// Requisião para recuperar arquivos Pendentes de criação de CTRC - apenas tabela Usu_TSetXML.Status = '' 
routes.get('/erp/cte', (req, res) => {
  //const arquivo = req.file.toString('utf-8');
  //console.log(arquivo)
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
    stringArquivo: ""
  };
  let args = {
    user: userERP,
    password: passERP,
    encryption: 0,
    parameters,
  };
    
  const urlRec = "http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_SynccteAutomatizado?wsdl";
    //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
    soap.createClient(urlRec, opts, function (err, client) {
      client.setTableXml(args, function (err, result) {
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
})

routes.post("/erp/cte", multerConfig.single("txtFile"), async (req, res) => {
  //const arquivo = req.file.buffer.toString('utf-8');
  if (req.file) {
    const arquivo = req.file.buffer.toString('utf-8');
    //console.log(newArqXml)
    parser.parseString(arquivo, function (err, results) {
        const data = JSON.stringify(results);

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
          user: userERP,
          password: passERP,
          encryption: 0,
          parameters,
        };
    
    //   //console.log(`Fatura: ${req.params.numfat} / Status: ${req.params.status}`)
      let resultWSDL = "";
      const urlRec = "http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_SynccteAutomatizado?wsdl";
      //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
      soap.createClient(urlRec, opts, function (err, client) {
        client.setTableXml(args, function (err, result) {
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
    })
  } else {
    res.send({
      message: "Ocorreram erros na leitura do arquivo.",
    });
  }
}); 


routes.post("/erp/cte/chaves", async (req, res) => {
    
    const arrayChaves = req.body;
    //console.log(arrayChaves)

    const docAnt = arrayChaves.pop();
    const tipSer = arrayChaves.pop();
    //const newObjArr = JSON.parse(arrayChaves)
      
    //console.log(newObjArr)
    
    const newChavesArray = [{...arrayChaves}]
    //console.log('Tipo: ' + tipSer);
    //console.log('Doc Ant: ' + docAnt);
    //console.log(JSON.stringify(newChavesArray))

    const opts = {
      wsdl_options: {
        proxy: process.env.QUOTAGUARDSTATIC_URL,
      },
    };
    let parameters = {
        chavesNF: JSON.stringify(newChavesArray),
        tipSer: tipSer,
        docAnt: docAnt 
    };
    
    let args = {
      user: userERP,
      password: passERP,
      encryption: 0,
      parameters,
    };
  
    //console.log(`Fatura: ${req.params.numfat} / Status: ${req.params.status}`)
    let resultWSDL = "";
    const urlRec = "http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_SynccteAutomatizado?wsdl";
    //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
    soap.createClient(urlRec, opts, function (err, client) {
      client.criarCTRC(args, function (err, result) {
        if (result) {
            //console.log(result)
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

routes.post('/erp/cte/delete/chave', async (req, res) => {
  const chave = req.body.chvCtrc;
  //console.log(chave)
  const opts = {
    wsdl_options: {
      proxy: process.env.QUOTAGUARDSTATIC_URL,
    },
  };
  let parameters = {
      chave: chave 
  };

  let args = {
    user: userERP,
    password: passERP,
    encryption: 0,
    parameters,
  };

  //console.log(`Fatura: ${req.params.numfat} / Status: ${req.params.status}`)
  let resultWSDL = "";
  const urlRec = "http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_SynccteAutomatizado?wsdl";
  //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
  soap.createClient(urlRec, opts, function (err, client) {
    client.deleteXml(args, function (err, result) {
      if (result) {
          //const resultWSDL = result.result.retorno;
          //console.log(resultWSDL)
          res.send( {
            messagem: "Chave excluída com sucesso"
          });
      } else {
          res.send({
          message: err,
        });
      }
    });
  });
})

module.exports = routes;

// const express = require('express');
// const app = new express();
// const bodyParser = require('body-parser');
// const soap = require('soap');
// const cors = require('cors');
// require('dotenv').config();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const {AnyElement} = require('soap/lib/wsdl/elements');
// //const mongoose = require('mongoose')
// var util = require('util');
// const { stringify } = require('querystring');
// app.engine('handlebars', handlebars({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');
// app.use(bodyParser.urlencoded({extended: false}))
// app.use(bodyParser.json());
// app.use(express.static('public'));
// app.use(cors());

// app.get('/fretes', function(req, res) {
//     opts = {
//         wsdl_options: {
//             proxy: process.env.QUOTAGUARDSTATIC_URL
//         }
//     };
//     parameters = {
//             chvNel: " "
//     }
//     args = {
//         user: 'processo', password: '123', encryption: 0,
//         parameters
//     }
//     resultWSDL = "";
//     const urlRec = 'http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl';
//     //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl';
//     soap.createClient(urlRec, opts, function (err, client) {
//         client.validacaoFrete(args, function (err, result) {
//             console.log(result)
//             resultWSDL = result.result.retorno;
//             resultWSDLArray = JSON.parse(resultWSDL)
//             //console.log(resultWSDLArray)
            
//             if (result) {
//                 /*
//                 var abjResult = {
//                     item1 : {
//                         numCte: 99999,
//                         nomEmi: "Vinicius"
//                     },
//                     item2 : {
//                         numCte: 88888,
//                         nomEmi: "Luiz"
//                     }
//                 }
//                 */
//                 //console.log((abjResult))
//                 //var resultArray = JSON.parse(abjResult);
//                 //var resultDadosFrete = resultWSDL[Object.keys(resultWSDL)]; 
//                 res.render('painel', {relacaocte: resultWSDLArray});
//                 //console.log(resultDadosFrete) 
//             }    
//             if (!result) {
//                 res.redirect(`/erro/:${err}`);
//             }  
             
//             /*               
//             if(!resultWSDL) {
//               //let erro = "Não foi encontro o cliente para a pesquisa!";
//               res.redirect('/');
//             } else {
//               var resultArray = JSON.parse(resultWSDL);
//               //console.log(resultArray); 
//               if(!resultArray) {
//                  //let erro = "Não foi encontro o cliente para a pesquisa!";
//                  res.redirect('/');
//               } else {     
//                  res.render('painel', {relacaocte: resultArray});
//                 }    
//             }
//             */
//         });
//     });
// });

// app.post('/fretes', function(req, res)  {
//     const chave = req.body.chave;   
//     if (chave === "") {
//         res.redirect('/');
//     } else {
//     opts = {
//         wsdl_options: {
//             proxy: process.env.QUOTAGUARDSTATIC_URL
//         }
//     };
//     parameters = {
//             chvNel: req.body.chave
//     }
//     args = {
//         user: 'processo', password: '123', encryption: 0,
//         parameters
//     }
//     resultWSDL = "";
//     const urlRec = 'http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl';
//     //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl';
//     soap.createClient(urlRec, opts, function (err, client) {
//         client.validacaoFrete(args, function (err, result) {  
//             //console.log(result, err);
            
//             if (result) {
//                 resultWSDL = result.result.retorno;
//                 resultArray = JSON.parse(resultWSDL);
//             } else {
//                 res.redirect('/');
//             }
//             //console.log(resultArray)
               
//             if(!resultWSDL) {
//               //let erro = "Não foi encontro o cliente para a pesquisa!";
//               res.redirect('/');
//             } else {
//               resultArray = JSON.parse(resultWSDL);
//               //console.log(resultArray); 
//               if(!resultArray) {
//                  //let erro = "Não foi encontro o cliente para a pesquisa!";
//                  res.redirect('/');
//               } else {     
//                  res.render('painelvalide', {relacaocte: resultArray});
//                  }
//             }
//         });
//     }); 
//     }
// });

// app.get('/validacao/:chave/:val', function(req, res)  {

//     opts = {
//         wsdl_options: {
//             proxy: process.env.QUOTAGUARDSTATIC_URL
//         }
//     };
//     parameters = {
//             chvNel: req.params.chave + "/" + req.params.val
//     }
//     args = {
//         user: 'processo', password: '123', encryption: 0,
//         parameters
//     }
//     resultWSDL = "";
//     const urlRec = 'http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl';
//     //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_cpr_recebimentoeletronico?wsdl';
//     soap.createClient(urlRec, opts, function (err, client) {
//         client.validacaoFrete(args, function (err, result) { 
//             console.log(result)
            
//             if (result !== 'null') {
//                 retorno = result.result.retorno;
//                 const msgRet = {
//                     msg: "CTE Validado com sucesso!"
//                 }
//                 res.redirect(`/ret/${msgRet}`)
//             } else {
//                 const erro = {
//                     msg: "Chave não encontrada"
//                 }
//                 res.redirect(`/ret/${erro}`)
//             }
//         });
//     }); 
// });

// /* Painel Faturas */

// app.get('/hcm/faturas', (req, res) => {
//     opts = {
//         wsdl_options: {
//             proxy: process.env.QUOTAGUARDSTATIC_URL
//         }
//     };
//     parameters = {
//     }
//     args = {
//         user: 'vinicius', password: 'floripa', encryption: 0,
//         parameters
//     }
//     resultWSDL = "";
//     const urlRec = 'http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl';
//     //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
//     soap.createClient(urlRec, opts, function (err, client) {
//         client.retRateioFat(args, function (err, result) { 
//             let response = '';
//             //console.log(result)
//             if (result) {
//                 response = result.result.retorno;
//                 //console.log(response)
//                 if (response) {
//                    res.send(response);
//                 } else {
//                     res.send({
//                         message: "Fatura não Encontrada!!!"
//                     });
//                 }
//             } else {
//                 res.send({
//                     message: "Fatura não Encontrada"
//                 });
//             }
//             //console.log(result)     
//         })
//     })
// })


// app.get('/hcm/faturas/fatura/:numfat', (req, res) => {
//     opts = {
//         wsdl_options: {
//             proxy: process.env.QUOTAGUARDSTATIC_URL
//         }
//     };
//     parameters = {
//             numFat: req.params.numfat
//     }
//     args = {
//         user: 'vinicius', password: 'floripa', encryption: 0,
//         parameters
//     }
//     resultWSDL = "";
//     const urlRec = 'http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl';
//     //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
//     soap.createClient(urlRec, opts, function (err, client) {
//         client.retRateioFat(args, function (err, result) { 
//             let response = '';
//             //console.log(result)
//             if (result) {
//                 response = result.result.retorno;
//                 //console.log(response)
//                 if (response) {
//                    res.send(response);
//                 } else {
//                     res.send({
//                         message: "Fatura não Encontrada!!!"
//                     });
//                 }
//             } else {
//                 res.send({
//                     message: "Fatura não Encontrada"
//                 });
//             }
//             //console.log(result)     
//         })
//     })
// }) 

// //Busca Fatura e consiste validação

// app.post('/hcm/rateio', (req, res) => {
//         opts = {
//             wsdl_options: {
//                 proxy: process.env.QUOTAGUARDSTATIC_URL
//             }
//         };
//         stringRateio = JSON.stringify(req.body.rateio);
//         parameters = {
//             numFat: req.body.numFat,
//             rateio: stringRateio,
//             origem: req.body.origem
//         }
//         args = {
//             user: 'vinicius', password: 'floripa', encryption: 0,
//             parameters
//         }
//        //console.log(stringRateio)
        
//         resultWSDL = "";
//         const urlRec = 'http://erp.macromaq.com.br:8080/g5-senior-services/sapiens_SyncrateioCP?wsdl';
//         //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
//         soap.createClient(urlRec, opts, function (err, client) {
//             client.atualizarRateioCP_new(args, function (err, result) { 
//                 //console.log(result)
                
//                 if (result !== 'null') {
//                     if (result.result.erroExecucao) {    
//                         res.send({
//                             status: false,
//                             resposta: result.result.erroExecucao
//                         }); 
//                     } else {
//                         res.redirect(`/hcm/fatura/status/${req.body.numFat}/A`)
//                     }
//                 } else {
//                     res.send({
//                         status: false,
//                         resposta: err
//                     });
//                 } 
//             })
//         }) 
// }) 

// app.get('/hcm/fatura/status/:numfat/:status', (req, res) => {

//     opts = {
//         wsdl_options: {
//             proxy: process.env.QUOTAGUARDSTATIC_URL
//         }
//     };
//     parameters = {
//             numFat: req.params.numfat,
//             status: req.params.status
//     }
//     args = {
//         user: 'vinicius', password: 'floripa', encryption: 0,
//         parameters
//     }
//     //console.log(`Fatura: ${req.params.numfat} / Status: ${req.params.status}`)
    
//     resultWSDL = "";
//     const urlRec = 'http://erp.macromaq.com.br:8080/g5-senior-services/bs_SyncpainelFatura?wsdl';
//     //const urlRec = 'http://200.225.218.250:18080/g5-senior-services/sapiens_Syncretfatura?wsdl';
//     soap.createClient(urlRec, opts, function (err, client) {
//         client.retRateioFat(args, function (err, result) { 
//             let response = '';
//             //console.log(`result HCM Atualizacao: ${result.result.retorno}`)
//             if (result) {
//                 if (result !== 'null') {
//                     res.send({
//                         status: true,
//                         resposta: result.result.retorno
//                     })
//                 } else {
//                     res.send({
//                         status: true,
//                         resposta: "Resposta em branco!"
//                     })
//                 }   
//             } else {
//                 res.send({
//                     status: false,
//                     resposta: err
//                 })
//             }
//            /*
//             response = result.result.retorno;
//             resultObj = JSON.parse(response)
//             if (resultObj) {
//                 res.send(resultObj);
//             } else {
//                 res.send('/');
//               }
//             */
//         })
//     })
// }) 

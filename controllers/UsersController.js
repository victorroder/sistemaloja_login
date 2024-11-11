import express from "express";
const router = express.Router();
import User from "../models/User.js";
// Importando o bcrypt
import bcrypt from "bcrypt";

// ROTA DE LOGIN
router.get("/login", (req, res) => {
  res.render("login", {
    loggedOut: true,
    messages: req.flash()
  });
});

// ROTA DE LOGOUT
router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

// ROTA DE CADASTRO
router.get("/cadastro", (req, res) => {
  res.render("cadastro", {
    loggedOut: true,
    messages: req.flash()
  });
});

// ROTA DE CRIAÇÃO DE USUÁRIO
router.post("/createUser", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // VERIFICAR SE O USUÁRIO JÁ ESTÁ CADASTRADO
  User.findOne({ where: { email: email } }).then((user) => {
    // SE NÃO HOUVER
    if (user == undefined) {
      // AQUI É FEITO O CADASTRO E O HASH DE SENHA
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      User.create({
        email: email,
        password: hash,
      }).then(() => {
        res.redirect("/login");
      });
      // CASO O USUÁRIO JÁ ESTEJA CADASTRADO
    } else {
      req.flash('danger', "O usuário já cadastrado. Faça o login.")
      res.redirect("/cadastro")
    }
  });
});

// ROTA DE AUTENTICAÇÃO
router.post("/authenticate", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // BUSCA O USUÁRIO NO BANCO
  User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    // SE O USUÁRIO ESTIVER CADASTRADO
    if (user != undefined) {
      // VALIDA A SENHA (VERIFICA O HASH)
      const correct = bcrypt.compareSync(password, user.password);
      // SE A SENHA FOR VÁLIDA
      if (correct) {
        // AUTORIZA O LOGIN
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        // res.send(`Usuário logado:<br>
        //   ID: ${req.session.user['id']}<br>
        //   E-mail: ${req.session.user['email']}`)
        // ENVIAR UMA MENSAGEM DE SUCESSO
        req.flash('success', "Login efetuado com sucesso!")
        res.redirect("/");
        // SE A SENHA NÃO FOR VÁLIDA
      } else {
        req.flash('danger', "A senha informada está incorreta! Tente novamente.")
        res.redirect("/login")
      }
    } else {
      // SE O USÁRIO NÃO EXISTE
      req.flash('danger', "O usuário informado não existe! Verifique os dados digitados.")
      res.redirect("/login")
    }
  });
});

export default router;

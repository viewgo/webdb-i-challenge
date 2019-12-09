const express = require("express");

const knex = require("./data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  knex
    .select("*")
    .from("accounts")
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error getting the accounts" });
    });
});

server.get("/:id", (req, res) => {
  knex
    .select("*")
    .from("accounts")
    .where("id" === req.params.id)
    .first()
    .then(account => {
      if (account) {
        res.status(200).json(accounts);
      } else {
        res.status(404).json({ message: "That account does not exist" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error getting the account" });
    });
});

server.post("/", (req, res) => {
  const postData = req.body;

  knex("accounts")
    .insert(postData, "id")
    .then(ids => {
      const id = ids[0];
      console.log(id);

      return knex("accounts")
        .select("id", "name", "budget")
        .where({ id })
        .first()
        .then(account => {
          res.status(200).json(account);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error adding the account" });
    });
});

server.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  console.log(id, changes);

  knex("accounts")
    .update(changes)
    .where({ id })
    .then(count => {
      res.status(200).json({ message: `${count} account(s) updated` });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error updating the account" });
    });
});

server.delete("/:id", (req, res) => {
    const { id } = req.params;
    knex("accounts")
      .where({ id })
      .del()
      .then(count => {
        res.status(200).json({ message: `${count} accounts(s) deleted` });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: "Error deleting the account" });
      });
  });

module.exports = server;

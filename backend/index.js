import json from "body-parser";
import express, { request, response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const port = 8888;
const server = express();

server.use(express.json());
server.use(cors());

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);
const filePath = path.join(__dirName, "todos.json");

const getTodo = () => {
  const data = fs.readFileSync("todos.json", "utf-8");
  return JSON.parse(data);
};

const saveTodo = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

server.get("/todos", (request, response) => {
  const todos = getTodo();
  const { page, limit } = request.query;
  const filteredTodo = todos.slice(limit * page - limit, limit * page);
  response.json({
    success: true,
    data: filteredTodo,
  });
});

server.post("/todos", (request, response) => {
  const todos = getTodo();

  const { title, status } = request.body;
  const newId = Math.floor(Math.random() * 1000);
  const newTodo = {
    id: newId,
    title: title,
    status: status,
    createDate: new Date().toDateString(),
  };
  if (
    (newTodo.status == "backlog" ||
      newTodo.status == "complete" ||
      newTodo.status == "inProgress") &&
    newTodo.title !== ""
  ) {
    todos.push(newTodo);
    saveTodo(todos);
    response.json({
      success: true,
      data: todos,
    });
  } else {
    response.json({ success: "Error: Medeellee zuw oruulna uu" });
  }
});

server.put("/todos/:id", (request, response) => {
  const todos = getTodo();
  const { title, status } = request.body;
  const { id } = request.params;
  if (
    (status == "backlog" || status == "complete" || status == "inProgress") &&
    title !== ""
  ) {
    todos.map((todo) => {
      if (todo.id == id) {
        todo.status = status;
        todo.title = title;
      }
      return todo;
    });
    saveTodo(todos);
    response.json({ success: true, data: todos });
  } else response.json({ success: "Error: Medeellee zuw oruulna uu" });
});

server.delete("/todos/:id", (request, response) => {
  let todos = getTodo();
  const { id } = request.params;
  todos = todos.filter((todo) => todo.id != id);
  saveTodo(todos);
  response.json({ success: true, data: todos });
});

server.listen(port, () => {
  console.log(`http://localhost:${port} deer server aslaa`);
});

const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

//Middleware 
function uuidValidate(request, response, next) {
  const { id } = request.params;

  if (!validate(id)) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  request.id = id;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", uuidValidate, (request, response) => {
  const { id } = request;
   const { title, url, techs }= request.body;
   const updatedRepository = {title, url, techs};
   
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };
  
  repositories[repositoryIndex] = repository;
 
  return response.json(repository);
});

app.delete("/repositories/:id", uuidValidate, (request, response) => {
  const { id } = request;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", uuidValidate, (request, response) => {
  const { id } = request;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({likes});
});

module.exports = app;

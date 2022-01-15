import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

// Antes de criar os testes, é necessário criar um banco de teste e alterar a configuração do arquivo: ""@shared/infra/typeorm/index.ts"
describe("List Categories", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    // Cria um usuário administrador no banco de teste
    const id = uuidV4();
    const password = await hash("admin", 8);
    await connection.query(
      `INSERT INTO USERS (id, name, email, password, "isAdmin", created_at, driver_license )
        values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX')
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all categories", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/categories")
      .send({
        name: "Category Test 1",
        description: "Description Category Test 1",
      })
      .set({
        Authorization: `Bearer: ${token}`,
      });

    await request(app)
      .post("/categories")
      .send({
        name: "Category Test 2",
        description: "Description Category Test 2",
      })
      .set({
        authorization: `Bearer: ${token}`,
      });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[1]).toHaveProperty("id");
    expect(response.body[0].name).toEqual("Category Test 1");
    expect(response.body[1].name).toEqual("Category Test 2");
  });
});

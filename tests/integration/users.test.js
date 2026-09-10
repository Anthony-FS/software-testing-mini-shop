import { describe, test, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { db } from "../../src/store/db.js";


describe("POST /users", () => {
  beforeEach(() => {
    db.users.deleteAll();
  });

  afterEach(() => {
    db.users.deleteAll();
  });

  test("Registration is successful when all information is complete and correct.", async () => {
    const payload = {
      email: "somchai.jai@example.com",
      password: "Pass1234",
      confirmPassword: "Pass1234",
      acceptedTerms: true,
    };

    const response = await request(app).post("/users").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      email: "somchai.jai@example.com",
    });
    expect(response.body).not.toHaveProperty("password");
  });

  test("Do not send email.", async () => {
    const payload = {
      password: "Pass1234",
      confirmPassword: "Pass1234",
      acceptedTerms: true,
    };

    const response = await request(app).post("/users").send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("email is required");
  });

  test('The "confirmPassword" does not match the password.', async () => {
    const payload = {
      email: "mali.suk@example.com",
      password: "Pass1234",
      confirmPassword: "Pass9999",
      acceptedTerms: true,
    };

    const response = await request(app).post("/users").send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("confirmPassword does not match password");
  });

  test("Do not check the box to accept the terms of use.", async () => {
    const payload = {
      email: "nuch.wan@example.com",
      password: "Pass1234",
      confirmPassword: "Pass1234",
      acceptedTerms: false,
    };

    const response = await request(app).post("/users").send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("acceptedTerms must be true");
  });

  test("The password is one character shorter than the lower bound (7 characters long).", async () => {
    const payload = {
      email: "bee.short@example.com",
      password: "Pass123",
      confirmPassword: "Pass123",
      acceptedTerms: true,
    };

    const response = await request(app).post("/users").send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "password must be 8-20 characters long and contain both letters and numbers"
    );
  });

  test("The password must be long enough to fit within the lower bound (8 characters long) and contain both letters and numbers.", async () => {
    const payload = {
      email: "bee.ok@example.com",
      password: "Pass1234",
      confirmPassword: "Pass1234",
      acceptedTerms: true,
    };

    const response = await request(app).post("/users").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      email: "bee.ok@example.com",
    });
  });

  test("This email address is a duplicate of one already in the system.", async () => {
    db.users.insert({
      email: "dup.user@example.com",
      password: "Pass1234",
      membership: "basic",
    });

    const payload = {
      email: "dup.user@example.com",
      password: "Pass1234",
      confirmPassword: "Pass1234",
      acceptedTerms: true,
    };

    const response = await request(app).post("/users").send(payload);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("email is already registered");
  });
});
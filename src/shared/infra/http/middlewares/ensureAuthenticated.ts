import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";

interface IPayLoad {
  sub;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing!", 401);
  }

  // --- Token: Bearer gegasdgegegege. Split separa o Bearer e o token pelo espaço entre eles ---
  // --- [, token] => capturo a segunda posição do array que o split gera ---
  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      "cfe275a5908b5650488e0b0342c2d6cc"
    ) as IPayLoad;

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(user_id);
    if (!user) {
      throw new AppError("User does not exists!", 401);
    }

    // --- Para colocar um objeto no request, é necessário sobreescrever o arquivo index.d.ts,
    // criando novamente esse arquivo dentro de src/@types/express, para add mais um objeto
    // dentro da Interface Request --
    request.user = {
      id: user_id,
    };

    next();
  } catch (error) {
    throw new AppError("Invalid token!", 401);
  }
}

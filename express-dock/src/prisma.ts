import { PrismaClient } from "../generated/prisma";

export default new PrismaClient({log: ["info","query","error","warn"]});
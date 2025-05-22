import axios from "axios";
import { Request, Response } from "express";
import { redis } from "../helpers/redis";

export class PostController {
  async getPosts(req: Request, res: Response) {
    try {
      const redisData = await redis.get("post");

      if (redisData) {
        res.status(200).send({ data: JSON.parse(redisData) });
        return;
      }

      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );

      await redis.setex("post", 60, JSON.stringify(data));

      res.status(200).send({
        data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
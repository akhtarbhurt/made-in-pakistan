import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

interface ValidationError {
  details: Array<{
    message: string;
  }>;
}

const validate = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
      await schema.parseAsync(req.body);
      next();
  } catch (err : any) {
    if (err instanceof z.ZodError) {
      const errorDetails = err.errors.map((errs) => ({
        path: errs.path.join("."),
        message: errs.message,
      }));
      res.status(400).json({ errors: errorDetails });
    } else {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }

  
  }
};

export default validate;

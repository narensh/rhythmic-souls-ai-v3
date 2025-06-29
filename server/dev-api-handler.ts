// Development handler for Vercel API functions
import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handler for development API routes
export async function handleDevAPIRoute(req: Request, res: Response, apiPath: string) {
  try {
    // Convert Express request/response to Vercel format
    const vercelReq = {
      ...req,
      query: { ...req.query, ...req.params },
      method: req.method,
      headers: req.headers,
      body: req.body,
      url: req.url,
    };

    const vercelRes = {
      status: (code: number) => {
        res.status(code);
        return vercelRes;
      },
      json: (data: any) => {
        res.json(data);
        return vercelRes;
      },
      redirect: (code: number | string, url?: string) => {
        if (typeof code === 'string') {
          res.redirect(code);
        } else {
          res.redirect(code, url || '');
        }
        return vercelRes;
      },
      setHeader: (name: string, value: string) => {
        res.setHeader(name, value);
        return vercelRes;
      },
    };

    // Import and execute the API function
    const apiFilePath = path.resolve(__dirname, '..', 'api', `${apiPath}.ts`);
    const { default: handler } = await import(apiFilePath);
    
    await handler(vercelReq, vercelRes);
  } catch (error) {
    console.error(`Error handling API route ${apiPath}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
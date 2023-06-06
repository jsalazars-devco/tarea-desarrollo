import Cors from "cors";
import { Request } from "express";
import { URL_WHITELIST } from "../../../config";

const whitelist = URL_WHITELIST;

interface CorsOptions {
    origin: boolean;
}

const corsOptionsDelegate = (req: Request, cb: (arg0: null, arg1: CorsOptions) => void) => {
    const corsOptions: CorsOptions = { origin: false };

    if (whitelist?.includes(req.header('Origin') as string)) {
        corsOptions.origin = true;
    }
    else {
        corsOptions.origin = false;
    }

    cb(null, corsOptions);
};

export const cors = Cors();
export const corsWithOptions = Cors(corsOptionsDelegate);
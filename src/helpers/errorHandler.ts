import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status";


const notFound: (err: any, req: any, res: any, next: any) => void = (err, req, res, next) => {
  res.status(NOT_FOUND);
  res.json({
    success: false,
    message: "Requested Resource Not Found",
  });
  res.end();
};

const internalServerError: (err: any, req: any, res: any, next: any) => void = (err, req, res, next) => {
  res.status(err.status || INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message,
    extra: err.extra,
    errors: err,
  });
  res.end();
};

export { notFound, internalServerError }
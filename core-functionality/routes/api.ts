import { Router } from "express";
import {
  getAllProblems,
  getProblemByIdController,
  normalize,
  generateFingerprintController,
  runRulesController,
  evaluateQueryController,
} from "../controllers/api.controller.js";

export const apiRouter = Router();

// Problems endpoints
apiRouter.get("/problems", getAllProblems);
apiRouter.get("/problems/:problemId", getProblemByIdController);

// SQL normalization
apiRouter.post("/normalize", normalize);

// Fingerprint generation
apiRouter.post("/fingerprint", generateFingerprintController);

// Rules execution
apiRouter.post("/rules", runRulesController);

// Query evaluation
apiRouter.post("/evaluate", evaluateQueryController);

import express from "express";
import { getPages, getAdAccounts } from "../controllers/metaAssets";

const router = express.Router();

router.get("/meta/pages", getPages);
router.get("/meta/adaccounts", getAdAccounts);

export default router;

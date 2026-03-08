import { Router } from "express";
import {
  createUser,
  deleteUser,
  readAllUsers,
  readUser,
  updateUser,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.post("/users", createUser);
router.get("/users", authenticate, authorizeRoles("Admin"), readAllUsers);
router.get("/users/:id", readUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;

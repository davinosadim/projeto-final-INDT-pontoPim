import { Router } from "express";
import { validate } from "../middlewares/validateBody";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ensureRole } from "../middlewares/ensureRole";
import { UserRole } from "../types/roles";
import { ColaboradorController } from "../controllers/ColaboradorController";
import { HistoricoPontoController } from "../controllers/HistoricoPontoController";
import { AjustePontoController } from "../controllers/AjustePontoController";
import { EspelhoPontoController } from "../controllers/EspelhoPontoController";
import { createColaboradorSchema } from "../dto/colaborador/CreateColaboradorSchemaDTO";

const router = Router();
const colaboradorController = new ColaboradorController()
const historicoPontoController = new HistoricoPontoController()
const ajustePontoController = new AjustePontoController()
const espelhoPontoController = new EspelhoPontoController()

router.get("/", authMiddleware, ensureRole(UserRole.GESTOR, UserRole.RH), colaboradorController.findAll.bind(colaboradorController));
router.get("/:id/ponto", authMiddleware, historicoPontoController.listarPorColaborador.bind(historicoPontoController));
router.get("/:id/espelho/:mes", authMiddleware, espelhoPontoController.gerarMensal.bind(espelhoPontoController));
router.get("/:id/ponto/ajustes", authMiddleware, ajustePontoController.listarPorColaborador.bind(ajustePontoController));
router.post("/:id/ponto/ajustes", authMiddleware, ajustePontoController.criarSolicitacao.bind(ajustePontoController));
router.post("/", authMiddleware, ensureRole(UserRole.RH), validate(createColaboradorSchema), colaboradorController.create.bind(colaboradorController));
router.patch("/:id/status", authMiddleware, ensureRole(UserRole.RH), colaboradorController.toggleStatus.bind(colaboradorController));

export default router;

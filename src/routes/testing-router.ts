import {Router} from "express";
import {container} from "../composition-root";
import {TestingController} from "./testing-controller";

const testingController = container.resolve(TestingController)

export const testingRouter = Router({})

testingRouter.delete(
    '/all-data',
    testingController.delete.bind(testingController)
)
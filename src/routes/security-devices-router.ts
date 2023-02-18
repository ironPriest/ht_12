import {Router} from "express";
import {container} from "../composition-root";
import {SecurityDevicesController} from "./security-devices-controller";

const securityDeviceController = container.resolve(SecurityDevicesController)

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/', securityDeviceController.getDevices.bind(securityDeviceController) )
securityDevicesRouter.delete('/', securityDeviceController.deleteOtherDevices.bind(securityDeviceController) )
securityDevicesRouter.delete('/:deviceId', securityDeviceController.deleteDevice.bind(securityDeviceController) )
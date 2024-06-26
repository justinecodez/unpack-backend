import { Request, Response } from 'express'
import * as DeliveryServices from '../services/deliveryService'
import { calculateDeliveryCostService } from './../services/deliveryCostService'
import scheduling from './../util/scheduling'
export const calculateDeliveryCostController = async (
  req: Request<{}, {}, DeliveryRequest>,
  res: Response
) => {
  try {
    const deliveryData = req.body
    const delivery_cost = await calculateDeliveryCostService(deliveryData)
    return res.json({
      success: true,
      delivery_cost,
      message: 'Delivery cost calculated successfully',
    })
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

export const createDeliveryController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const deliveryData = req.body

    const newDelivery = await DeliveryServices.createDeliveryService(
      deliveryData
    )

    return res.json({
      success: true,
      message: 'Delivery ordered successfully',
      trackingNumber: newDelivery.deliveryId,
    })
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

export const updateDeliveryController = async (
  req: Request<{}, {}, DeliveryRequest>,
  res: Response
) => {
  try {
    const deliveryData = req.body
    const result = await DeliveryServices.updateDeliveryService(deliveryData)
    return res.json({
      success: true,
      delivery: result,
      message: 'Delivery updated successfully',
    })
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

export const encryptDeliveryDetailsController = async (
  req: Request,
  res: Response
) => {
  console.log('REQUEST', req.body)
  try {
    const { userId } = req.body
    const encryptedDetails =
      await DeliveryServices.encryptDeliveryDetailsService(userId)
    return res.json({
      success: true,
      body: encryptedDetails,
      message: 'Delivery details have been encrypted successfully.',
    })
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

export const trackDeliveryController = async (req: Request, res: Response) => {
  try {
    const { trackingId } = req.params
    const trackingDetails = await DeliveryServices.trackDeliveryService(
      trackingId
    )

    return res.json({
      success: true,
      body: trackingDetails,
      message: 'Tracking details retrieved successfully.',
    })
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

export const getAllDeliveriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const allDeliveries = await DeliveryServices.getAllDeliveriesService(
      page,
      limit
    )

    return res.json({
      success: true,
      body: allDeliveries.data,
      currentPage: allDeliveries.currentPage,
      totalPage: allDeliveries.totalPages,
      totalCount: allDeliveries.totalCount,
      message: 'All delivery details retrieved successfully.',
    })
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

export const getUserDeliveryHistoryController = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.body
    const deliveryHistory =
      await DeliveryServices.getUserDeliveryHistoryService(userId)

    return res.json({
      success: true,
      body: deliveryHistory,
      message: "User's delivery history retrieved successfully.",
    })
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

export const getPartnerDeliveryHistoryController = async (
  req: Request<{ partnerId: string }>,
  res: Response
) => {
  try {
    const { partnerId } = req.body
    const deliveryHistory =
      await DeliveryServices.getPartnerDeliveryHistoryService(partnerId)

    return res.json({
      success: true,
      body: deliveryHistory,
      message: 'Delivery history retrieved successfully.',
    })
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

export const getDeliveryIdsController = async (
  req: Request<{}, {}, DeliveryRequest>,
  res: Response
) => {
  try {
    const { userId } = req.body
    const encryptedDeliveryIds = await DeliveryServices.getDeliveryIdsService(
      userId!
    )

    return res.json({
      success: true,
      body: encryptedDeliveryIds,
      message: 'Delivery details have been encrypted successfully.',
    })
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

export const getDeliveryByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log('Get delivery by ID')
    const { deliveryId } = req.params
    const result = await DeliveryServices.getDeliveryByIdService(deliveryId)
    res.json(result)
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}

export const pickupDeliveryController = async (req: Request, res: Response) => {
  try {
    const { encryptedData, partnerId } = req.body
    const result = await DeliveryServices.pickupDeliveryService(
      encryptedData,
      partnerId
    )

    return res.json(result)
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

export const getHandlersLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { scheduledHandler } = req.body
    const handlerLocation = await DeliveryServices.getHandlersLocationService(
      scheduledHandler
    )

    return res.json({
      success: true,
      body: { handlerLocation },
      message: 'Handlers location retrieved successfully.',
    })
  } catch (error: any) {
    return res.json({ success: false, message: error.message })
  }
}

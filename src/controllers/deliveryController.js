
const Cryptr = require('cryptr');
const Delivery = require("../models/Delivery");
const cryptr = new Cryptr('myTotallySecretKey');
const db = require('../util/db');
const User = require('../models/User');

module.exports = {
    addDelivery: async (req, res) => {
        console.log(req.body)
        const {
            receiver, phonenumber, pickup, dropoff,
            vendorId, size, type, parcel, notes, quantity
         } = req.body;
        if (false) {
            return res.json({ success: false, message: 'Fill out empty fields.' });
        } else {
            try {
                const numCurrentDeliveries = await db.deliveries.countDocuments();
                const newDelivery = new Delivery({
                    receiver,
                    phonenumber,
                    pickup,
                    dropoff,
                    notes,
                    deliveryId: `D00${numCurrentDeliveries + 1}`,
                    vendorId,
                    size,
                    type,
                    parcel,
                    quantity
                });
                await newDelivery.save();
                return res.json({ 
                    success: true,
                    message: 'Delivery ordered successfully',
                    trackingNumber: `D00${numCurrentDeliveries + 1}`
                });
            } catch (error) {
                return res.json({ success: false, message: error.message });
            }
        }
    },

    updateDelivery: async (req, res) => {
        const { deliveryId } = req.params;
        try {
            await db.deliveries.updateOne(
                { deliveryId },
                {
                    $set: {
                        ...req.body
                    }
                }
            );
            return res.json({ success: true, message: 'Delivery info has updated successfully.' });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    },

    encryptDeliveryDetails: async (req, res) => {
        const { deliveryIds } = req.body;
        try {
            if (!deliveryIds) {

            }
            let deliveryDetail = [];
            deliveryIds.forEach(async (deliveryId, index) => {
                const {
                    vendorId,
                    pickup,
                    dropoff,
                    receiver,
                    notes,
                    phonenumber,
                    currentHandler
                } = await db.deliveries.findOne({ deliveryId });
                const {
                    fullname,
                    phone,
                    email
                } = await db.users.findOne({ userId: vendorId });

                deliveryDetail.push({
                    from: {
                        fullname,
                        phone,
                        email,
                        pickup,
                    },
                    to: {
                        receiver,
                        phonenumber,
                        dropoff
                    },
                    shipper: currentHandler,
                    notes
                });
                if (index === deliveryIds.length - 1) {
                    const encryptedDetails = cryptr.encrypt(JSON.stringify({
                        deliveryDetail,
                        access: [vendorId, currentHandler, 'admin']
                    }));
                    return res.json({
                        success: true,
                        body: encryptedDetails,
                        message: 'Delivery details has been encrypted successfully.'
                    });
                }
            })
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    },

    decryptDeliveryDetails: (req, res) => {
        const { encryptedDetails, user } = req.body;
        //console.log(encryptedDetails, user)
        if (!encryptedDetails) {
            return res.json({ success: false, message: 'There are no any packages to be picked.' });
        }

        const decryptedDetails = cryptr.decrypt(encryptedDetails);
        const deliveryDetails = JSON.parse(decryptedDetails);
        console.log(deliveryDetails)
        if (deliveryDetails && deliveryDetails.access && deliveryDetails.access.includes(user)) {
            return res.json({
                success: true,
                body: deliveryDetails,
                message: 'Delivery details decrypted successfully.'
            });
        } else {
            return res.json({ success: false, message: 'You do not have access to this data. Contact admin through 0713444777.' });
        }

    },

    trackDelivery: async (req, res) => {
        const { trackingId } = req.params;
        try {
            // The findOne method is used here because, by definition,
            // an order, with a unique ID, is executed by one and only one
            // delivery request.
            const delivery = await db.deliveries.findOne({ deliveryId: trackingId });
            if (!delivery) {
                return res.json({ success: false, message: 'Provide a valid order ID.' });
            }

            const { currentHandler, status, pickup, dropoff } = delivery;
            const { fullname, rating } = await db.partners.findOne({ partnerId: 'V005' });
            if (status.value === 'cancelled') {
                return res.json({
                    success: false,
                    body: { status },
                    message: 'This order was cancelled. Cannot track it.'
                })
            }

            if (status.value === 'delivered') {
                return res.json({
                    success: false,
                    body: { status },
                    message: 'This order is already delivered. Cannot track it. Check your order history for more info.'
                })
            }

            return res.json({
                success: true,
                body: { pickup, dropoff, fullname, rating },
                message: 'Tracking details retrieved successfully.'
            });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    },

    getUserDeliveryHistory: async (req, res) => {
        const { userId } = req.body;
        try {
            const { deliveries } = await User.findById({ _id: userId });
            console.log(deliveries)
            if (!deliveries) {
                return res.json({ success: false, message: 'Provide a valid user ID.' });
            }
            let deliveryList = [];
            deliveries.forEach(async (delivery, index) => {
                const {
                    orderId,
                    pickup,
                    dropoff,
                    deliveryTime,
                    status,
                    currentHandler
                } = await db.deliveries.findOne({ deliveryId: delivery });
                const {
                    name,
                    parcel,
                    quantity,
                    size
                } = await db.orders.findOne({ orderId });
                const {
                    fullname,
                    location,
                    rating,
                    avatar
                } = await db.partners.findOne({ partnerId: currentHandler });

                deliveryList.push({
                    delivery: {
                        pickup,
                        dropoff,
                        deliveryTime,
                        status,
                    },
                    order: {
                        name,
                        parcel,
                        quantity,
                        size
                    },
                    partner: {
                        fullname,
                        location,
                        rating,
                        avatar
                    }
                });
            });
            
            return await res.json({
                success: true,
                body: deliveryList,
                message: 'User\'s delivery history retrieved successfully.'
            });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    },

    getPartnerDeliveryHistory: async (req, res) => {
        const { partnerId } = req.body;
        try {
            const { deliveries } = await db.partners.findOne({ partnerId });
            if (!deliveries) {
                return res.json({ success: false, message: 'Provide a valid user ID.' });
            }

            let deliveryList = [];
            deliveryIds.forEach(async (deliveryId) => {
                const {
                    orderId,
                    pickup,
                    dropoff,
                    deliveryTime,
                    status,
                    vendorId
                } = await db.deliveries.findOne({ deliveryId });
                const {
                    name,
                    parcel,
                    quantity,
                    size
                } = await db.orders.findOne({ orderId });
                const {
                    fullname,
                    avatar
                } = await db.users.findOne({ userId: vendorId });

                deliveryList.push({
                    delivery: {
                        pickup,
                        dropoff,
                        deliveryTime,
                        status,
                    },
                    order: {
                        name,
                        parcel,
                        quantity,
                        size
                    },
                    vendor: {
                        fullname,
                        avatar
                    }
                });
                if (index === deliveries.length - 1) {
                    return res.json({
                        success: true,
                        body: deliveryList,
                        message: 'Delivery history retrieved successfully.'
                    });
                }
            });
            return res.json({
                success: true,
                body: { deliveryList },
                message: 'Delivery history retrieved successfully.'
            });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    },

    getDeliveryIds: async (req, res) => {
        const { userID } = req.body;
       try {
            if (!userID) {
            return res.json({ success: false, message: 'Provide user ID.' })
        }

        const { deliveries } = await User.findById({ _id: userID });

        if (!deliveries) {
            return res.json({ success: false, message: 'No deliveries from the user.' })
        }
        const encryptedDeliveries = cryptr.encrypt(JSON.stringify({
            deliveries,
            access: [userID, 'admin']
        }));
        console.log(encryptedDeliveries);
        return res.json({
            success: true,
            body: encryptedDeliveries,
            message: 'Delivery details has been encrypted successfully.'
        });
       } catch (error) {
           return res.json({ success: false, message: error.message });
       }

    }
};
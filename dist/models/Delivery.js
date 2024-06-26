"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const DeliverySchema = new mongoose_1.default.Schema({
    deliveryId: {
        type: String,
        required: true,
    },
    receiver: {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
    },
    userId: {
        type: String,
        required: true,
    },
    driverId: {
        type: String,
        ref: 'Driver',
    },
    partnerId: {
        type: String,
    },
    delivery_quantity: {
        type: Number,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    package_size: {
        type: String,
        enum: ['small', 'medium', 'large'],
        required: true,
    },
    delivery_type: {
        type: String,
        enum: ['standard', 'express'],
        required: true,
    },
    dropoffLocation: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    pickupLocation: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    delivery_notes: {
        type: String,
    },
    current_handler: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    scheduled_handler: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'PackageHandler',
        },
    ],
    scheduled_delivery_date: {
        type: Date,
    },
    delivery_time: {
        type: String,
    },
    delivery_date: {
        type: String,
    },
    drop_off_cost: {
        type: Number,
    },
    pick_up_cost: {
        type: Number,
    },
    delivery_cost: {
        type: Number,
        required: true,
    },
    delivery_status: {
        type: mongoose_1.Schema.Types.Mixed,
        default: 'ACTIVE',
    },
    orderId: {
        type: String,
    },
    vendorId: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    pickupZone: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    dropoffZone: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
});
const DeliveryModel = mongoose_1.default.model('Delivery', DeliverySchema);
exports.default = DeliveryModel;

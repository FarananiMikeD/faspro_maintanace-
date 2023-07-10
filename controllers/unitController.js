
const unitModel = require('../models/unitModel');
const blockModel = require('../models/blockModel');
const leaseModel = require('../models/leaseModel');
const statisticReportModel = require('../models/statisticReportModel');
const invoiceModel = require('../models/invoiceModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, updateOne, deleteOne, getTeamByOwnerID, getByPropID } = require('./handleFactory');
const { extractIdFromAuthorizationHeader } = require('../token/tokenAndUserId');
const moment = require('moment');


//* Create a subscription 
exports.createUnit = catchAsync(async (req, res, next) => {

    const {
        unitName,
        unitNumber,
        unitOwnerName,
        numberOfBedrooms,
        numberOfBathRooms,
        surfaceArea,
        parkingGarage,
        unitType,
        RentAmount,
        leaseTerm,
        Amenities,
        Description,
        rentalRates,
        maximumOccupancy,
        Location,
        deposit_and_CancellationPolicy,
        CondoAssociationFees,
        petPolicy,
        propertyTaxes,
        Length,
        Weight,
        volume,
        quantity,
        width,
        temperature,
        tableNumber,
        occupancy,
        availability,
        storeNumber,
        category,
        businessOwner,
        area,
        ceilingHeight,
        powerSupply,
        Security,
        bookableField,
        floorNumber,
        kitchen,
        pool,
        gym,
        fire,
        alarm,
        balcony,
        pet,
        storage,
        centerCooling,
        heating,
        laundry,
        dishWasher,
        barBeque,
        dryer,
        sauna,
        elevator,
        emergency,
        numberOfLivingRoom,
        numberOfBalcony,
        numberOfFloor
    } = req.body;

    const newUnit = new unitModel({
        userId: req.params.userId,
        propertyId: req.params.propertyId,
        blockId: req.params.blockId,
        unitName,
        unitNumber,
        unitOwnerName,
        numberOfBedrooms,
        numberOfBathRooms,
        unitType,
        parkingGarage,
        surfaceArea,
        RentAmount,
        leaseTerm,
        Amenities,
        Description,
        rentalRates,
        maximumOccupancy,
        Location,
        deposit_and_CancellationPolicy,
        CondoAssociationFees,
        petPolicy,
        propertyTaxes,
        Length,
        Weight,
        volume,
        quantity,
        width,
        temperature,
        tableNumber,
        occupancy,
        availability,
        storeNumber,
        category,
        businessOwner,
        area,
        ceilingHeight,
        powerSupply,
        Security,
        bookableField,
        floorNumber,
        kitchen,
        pool,
        gym,
        fire,
        alarm,
        balcony,
        pet,
        storage,
        centerCooling,
        heating,
        laundry,
        dishWasher,
        barBeque,
        dryer,
        sauna,
        elevator,
        emergency,
        numberOfLivingRoom,
        numberOfBalcony,
        numberOfFloor
    });

    const savedUnit = await newUnit.save();
    sendResponseResult(savedUnit, 201, res, req.baseUrl, false, req.method, false);
});



exports.getAllUnits = getAll(unitModel);
exports.getUnitsByPropId = getOne(unitModel);
exports.getUnitsByUserId = getByPropID(unitModel);
exports.updateUnitById = updateOne(unitModel);
exports.deleteUnit = deleteOne(unitModel);


exports.getStatisticsByPropId = getByPropID(statisticReportModel);


exports.propertyReportStatistics = catchAsync(async (req, res, next) => {

    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);

    const units = await unitModel.find({ propertyId: req.params.PropId });
    const blocks = await blockModel.find({ propertyId: req.params.PropId });
    const leases = await leaseModel.find({ propertyId: req.params.PropId });

    const currentMonth = moment().format('MMMM');

    //* PULL THE PAID INVOICE
    const invoices = await invoiceModel.find({
        propertyId: req.params.PropId,
        month: currentMonth,
        status: "paid"
    });

    //* PULL THE PENDING INVOICE
    const unPaidInvoices = await invoiceModel.find({
        propertyId: req.params.PropId,
        month: currentMonth,
        status: "pending"
    });

    //* PULL THE OVERDUE INVOICE
    const OverdueInvoices = await invoiceModel.find({
        propertyId: req.params.PropId,
        month: currentMonth,
        status: "overdue"
    });


    //* PULL THE PAID INVOICE
    const rentalAmounts = invoices.map(invoice => invoice.rentalAmount);
    const totalRentalAmount = rentalAmounts.reduce((acc, val) => acc + val, 0);

    const utilityCharges = invoices.map(invoice => invoice.utilityCharges);
    const totalUtilityCharges = utilityCharges.reduce((acc, val) => acc + val, 0);

    const extraCharges = invoices.map(invoice => invoice.extraCharges);
    const totalExtraCharges = extraCharges.reduce((acc, val) => acc + val, 0);

    const TotalOfAll = totalRentalAmount + totalUtilityCharges + totalExtraCharges



    //* PULL THE PENDING INVOICE
    const pendingRentalAmounts = unPaidInvoices.map(invoice => invoice.rentalAmount);
    const pendingTotalRentalAmount = pendingRentalAmounts.reduce((acc, val) => acc + val, 0);

    const pendingUtilityCharges = unPaidInvoices.map(invoice => invoice.utilityCharges);
    const pendingTotalUtilityCharges = pendingUtilityCharges.reduce((acc, val) => acc + val, 0);

    const pendingExtraCharges = unPaidInvoices.map(invoice => invoice.extraCharges);
    const pendingTotalExtraCharges = pendingExtraCharges.reduce((acc, val) => acc + val, 0);

    const pendingTotalOfAll = pendingTotalRentalAmount + pendingTotalUtilityCharges + pendingTotalExtraCharges



    //* PULL THE OVERDUE INVOICE
    const OverdueRentalAmounts = OverdueInvoices.map(invoice => invoice.rentalAmount);
    const OverdueTotalRentalAmount = OverdueRentalAmounts.reduce((acc, val) => acc + val, 0);

    const OverdueUtilityCharges = OverdueInvoices.map(invoice => invoice.utilityCharges);
    const OverdueTotalUtilityCharges = OverdueUtilityCharges.reduce((acc, val) => acc + val, 0);

    const OverdueExtraCharges = OverdueInvoices.map(invoice => invoice.extraCharges);
    const OverdueTotalExtraCharges = OverdueExtraCharges.reduce((acc, val) => acc + val, 0);

    const OverdueTotalOfAll = OverdueTotalRentalAmount + OverdueTotalUtilityCharges + OverdueTotalExtraCharges


    const occupiedUnits = [];
    const unoccupiedUnits = [];

    const occupiedCount = units.reduce((count, unit) => {
        if (unit.tenants && unit.tenants.length > 0) {
            return count + 1;
        } else {
            return count;
        }
    }, 0);

    units.forEach(unit => {
        const filteredUnit = {
            id: unit._id,
            unitNumber: unit.unitNumber,
            unitName: unit.unitName,
            size: unit.size,
            rent: unit.rent,
            tenants: unit.tenants
        }
        if (unit.tenants && unit.tenants.length > 0) {
            occupiedUnits.push(filteredUnit);
        } else {
            unoccupiedUnits.push(filteredUnit);
        }
    });

    const unoccupiedCount = units.length - occupiedCount;

    const occupiedUnitsWithTenants = units.filter(unit => unit.tenants.length > 0);
    const occupiedUnitIdsWithTenants = occupiedUnitsWithTenants.map(unit => unit._id);

    const newStat = new statisticReportModel({
        userId: senderId,
        propertyId: req.params.PropId,
        occupiedUnit: occupiedUnits.length,
        numberOfBlocks: blocks.length,
        numberOfLeases: leases.length,
        unoccupiedUnit: unoccupiedCount,
        numberOfUnits: units.length,
        occupiedUnitDocs: occupiedUnitIdsWithTenants,

        //* Total paid rent
        total_Paid_RentAmount: totalRentalAmount,
        total_Paid_UtilityRentAmount: totalUtilityCharges,
        total_Paid_ExtraChargesRentAmount: totalExtraCharges,
        total_Paid_OfAll: TotalOfAll,

        //* Total pending rent
        total_Pending_RentAmount: pendingTotalRentalAmount,
        total_Pending_UtilityRentAmount: pendingTotalUtilityCharges,
        total_Pending_ExtraChargesRentAmount: pendingTotalUtilityCharges,
        total_Pending_OfAll: pendingTotalOfAll,

        //* Total overdue rent
        total_Overdue_RentAmount: OverdueTotalRentalAmount,
        total_Overdue_UtilityRentAmount: OverdueTotalUtilityCharges,
        total_Overdue_ExtraChargesRentAmount: OverdueTotalExtraCharges,
        total_Overdue_OfAll: OverdueTotalOfAll,
    });


    await newStat.save();


    const response = {
        status: 'success',
        object: 'list',
        has_more: false,
        data: newStat,
        Url: req.baseUrl,
        method: `/${req.method}`,
    };

    res.status(200).json(response);
});






exports.generatePropertyReportStatistics = catchAsync(async (req, res, next) => {

    const units = await unitModel.find({ propertyId: req.params.PropId });
    const blocks = await blockModel.find({ propertyId: req.params.PropId });
    const leases = await leaseModel.find({ propertyId: req.params.PropId });

    const currentMonth = moment().format('MMMM');

    //* PULL THE PAID INVOICE
    const invoices = await invoiceModel.find({
        propertyId: req.params.PropId,
        month: currentMonth,
        status: "paid"

    });

    //* PULL THE PENDING INVOICE
    const unPaidInvoices = await invoiceModel.find({
        propertyId: req.params.PropId,
        month: currentMonth,
        status: "pending"

    });

    //* PULL THE OVERDUE INVOICE
    const OverdueInvoices = await invoiceModel.find({
        propertyId: req.params.PropId,
        month: currentMonth,
        status: "overdue"
    });


    //* PULL THE PAID INVOICE
    const rentalAmounts = invoices.map(invoice => invoice.rentalAmount);
    const totalRentalAmount = rentalAmounts.reduce((acc, val) => acc + val, 0);

    const utilityCharges = invoices.map(invoice => invoice.utilityCharges);
    const totalUtilityCharges = utilityCharges.reduce((acc, val) => acc + val, 0);

    const extraCharges = invoices.map(invoice => invoice.extraCharges);
    const totalExtraCharges = extraCharges.reduce((acc, val) => acc + val, 0);

    const TotalOfAll = totalRentalAmount + totalUtilityCharges + totalExtraCharges



    //* PULL THE PENDING INVOICE
    const pendingRentalAmounts = unPaidInvoices.map(invoice => invoice.rentalAmount);
    const pendingTotalRentalAmount = pendingRentalAmounts.reduce((acc, val) => acc + val, 0);

    const pendingUtilityCharges = unPaidInvoices.map(invoice => invoice.utilityCharges);
    const pendingTotalUtilityCharges = pendingUtilityCharges.reduce((acc, val) => acc + val, 0);

    const pendingExtraCharges = unPaidInvoices.map(invoice => invoice.extraCharges);
    const pendingTotalExtraCharges = pendingExtraCharges.reduce((acc, val) => acc + val, 0);

    const pendingTotalOfAll = pendingTotalRentalAmount + pendingTotalUtilityCharges + pendingTotalExtraCharges



    //* PULL THE OVERDUE INVOICE
    const OverdueRentalAmounts = OverdueInvoices.map(invoice => invoice.rentalAmount);
    const OverdueTotalRentalAmount = OverdueRentalAmounts.reduce((acc, val) => acc + val, 0);

    const OverdueUtilityCharges = OverdueInvoices.map(invoice => invoice.utilityCharges);
    const OverdueTotalUtilityCharges = OverdueUtilityCharges.reduce((acc, val) => acc + val, 0);

    const OverdueExtraCharges = OverdueInvoices.map(invoice => invoice.extraCharges);
    const OverdueTotalExtraCharges = OverdueExtraCharges.reduce((acc, val) => acc + val, 0);

    const OverdueTotalOfAll = OverdueTotalRentalAmount + OverdueTotalUtilityCharges + OverdueTotalExtraCharges


    const occupiedUnits = [];
    const unoccupiedUnits = [];

    const occupiedCount = units.reduce((count, unit) => {
        if (unit.tenants && unit.tenants.length > 0) {
            return count + 1;
        } else {
            return count;
        }
    }, 0);


    units.forEach(unit => {
        const filteredUnit = {
            id: unit._id,
            unitNumber: unit.unitNumber,
            unitName: unit.unitName,
            size: unit.size,
            rent: unit.rent,
            tenants: unit.tenants
        }
        if (unit.tenants && unit.tenants.length > 0) {
            occupiedUnits.push(filteredUnit);
        } else {
            unoccupiedUnits.push(filteredUnit);
        }
    });

    const unoccupiedCount = units.length - occupiedCount;

    const data = {
        occupiedUnit: occupiedUnits.length,
        numberOfBlocks: blocks.length,
        numberOfLeases: leases.length,
        unoccupiedUnit: unoccupiedCount,
        numberOfUnits: units.length,
        occupiedUnits,
        unoccupiedUnits,
        //* Total paid rent
        total_Paid_RentAmount: totalRentalAmount,
        total_Paid_UtilityRentAmount: totalUtilityCharges,
        total_Paid_ExtraChargesRentAmount: totalExtraCharges,
        total_Paid_OfAll: TotalOfAll,

        //* Total pending rent
        total_Pending_RentAmount: pendingTotalRentalAmount,
        total_Pending_UtilityRentAmount: pendingTotalUtilityCharges,
        total_Pending_ExtraChargesRentAmount: pendingTotalUtilityCharges,
        total_Pending_OfAll: pendingTotalOfAll,

        //* Total overdue rent
        total_Overdue_RentAmount: OverdueTotalRentalAmount,
        total_Overdue_UtilityRentAmount: OverdueTotalUtilityCharges,
        total_Overdue_ExtraChargesRentAmount: OverdueTotalExtraCharges,
        total_Overdue_OfAll: OverdueTotalOfAll,
    }



    const response = {
        status: 'success',
        object: 'list',
        has_more: false,
        data,
        Url: req.baseUrl,
        method: `/${req.method}`,
    };

    res.status(200).json(response);
});



exports.generateAgeAnalysesReport = catchAsync(async (req, res, next) => {

    const currentDate = moment();
    const startDate30Days = moment(currentDate).subtract(30, 'days').startOf('day');
    const startDate60Days = moment(currentDate).subtract(60, 'days').startOf('day');
    const startDate90Days = moment(currentDate).subtract(90, 'days').startOf('day');

    const invoices = await invoiceModel.find({
        propertyId: req.params.PropId,
        date: { $gte: startDate90Days.toDate(), $lte: currentDate.toDate() }
    });

    const result = {
        rentalAmount: { '30': 0, '60': 0, '90': 0 },
        utilityCharges: { '30': 0, '60': 0, '90': 0 },
        extraCharges: { '30': 0, '60': 0, '90': 0 },
        total: { '30': 0, '60': 0, '90': 0 }
    };

    invoices.forEach((invoice) => {
        const invoiceDate = moment(invoice.createdOn);
        const age = currentDate.diff(invoiceDate, 'days');

        console.log(" age : ", age)

        if (invoice.rentalAmount) {
            if (age <= 30) {
                result.rentalAmount['30'] += invoice.rentalAmount;
            } else if (age > 30 && age <= 60) {
                result.rentalAmount['60'] += invoice.rentalAmount;
            } else if (age > 60 && age <= 90) {
                result.rentalAmount['90'] += invoice.rentalAmount;
            }
            result.total['30'] += invoice.rentalAmount;
            if (invoiceDate >= startDate60Days) {
                result.total['60'] += invoice.rentalAmount;
            }
            if (invoiceDate >= startDate90Days) {
                result.total['90'] += invoice.rentalAmount;
            }
        }

        if (invoice.utilityCharges) {
            if (age <= 30) {
                result.utilityCharges['30'] += invoice.utilityCharges;
            } else if (age > 30 && age <= 60) {
                result.utilityCharges['60'] += invoice.utilityCharges;
            } else if (age > 60 && age <= 90) {
                result.utilityCharges['90'] += invoice.utilityCharges;
            }
            result.total['30'] += invoice.utilityCharges;
            if (invoiceDate >= startDate60Days) {
                result.total['60'] += invoice.utilityCharges;
            }
            if (invoiceDate >= startDate90Days) {
                result.total['90'] += invoice.utilityCharges;
            }
        }

        if (invoice.extraCharges) {
            if (age <= 30) {
                result.extraCharges['30'] += invoice.extraCharges;
            } else if (age > 30 && age <= 60) {
                result.extraCharges['60'] += invoice.extraCharges;
            } else if (age > 60 && age <= 90) {
                result.extraCharges['90'] += invoice.extraCharges;
            }
            result.total['30'] += invoice.extraCharges;
            if (invoiceDate >= startDate60Days) {
                result.total['60'] += invoice.extraCharges;
            }
            if (invoiceDate >= startDate90Days) {
                result.total['90'] += invoice.extraCharges;
            }
        }

    });

    const response = {
        status: 'success',
        object: 'list',
        has_more: false,
        data: result,
        Url: req.baseUrl,
        method: `/${req.method}`
    };

    res.status(200).json(response);

});



exports.getUnitDetByTenantID = catchAsync(async (req, res, next) => {
    const unitDetails = await unitModel.findOne({ tenants: req.params.tenantId });

    if (!unitDetails) {
        return next(new AppError('No unit found with that ID', 400));
    }

    const response = {
        status: 'success',
        object: 'list',
        has_more: false,
        data: unitDetails,
        Url: req.baseUrl,
        method: `/${req.method}`
    };

    res.status(200).json(response);
});




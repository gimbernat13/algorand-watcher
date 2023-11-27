"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccountAddress = void 0;
function validateAccountAddress(req, res, next) {
    const address = req.params.address;
    const isValidAddress = /^[A-Za-z0-9]{52}$/.test(address);
    if (isValidAddress) {
        next();
    }
    else {
        res.status(400).send("Invalid account address");
    }
}
exports.validateAccountAddress = validateAccountAddress;

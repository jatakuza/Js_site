const express = require('express');

console.log("express type:", typeof express);
console.log("Router type:", typeof express.Router);

const router = express.Router();
console.log("router type:", typeof router);
console.log("router.post:", typeof router.post);
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const packageRouter = require('./routes/packageRoutes');
const propertyRouter = require('./routes/propertyRoutes');
const unitRouter = require('./routes/unitRoutes');
const blockRouter = require('./routes/blockRoutes');
const noticeRouter = require('./routes/noticeRoutes');
const leaseRouter = require('./routes/leaseRoutes');
const utilitiesRouter = require('./routes/utilityRoutes');
const extraChargeRouter = require('./routes/extraChargeRoutes');
const invoiceRouter = require('./routes/invoiceRoutes');
const leadRouter = require('./routes/leadRoutes');
const quotationRouter = require('./routes/quotationRoutes');
const invoiceSettingRouter = require('./routes/invoiceSettingRoutes');
const leadInvoiceRouter = require('./routes/leadInvoiceRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start your server or perform testing operations here
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });


app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet({ contentSecurityPolicy: false, }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use(cors())
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/packages', packageRouter)
app.use('/api/v1/properties', propertyRouter)
app.use('/api/v1/units', unitRouter)
app.use('/api/v1/blocks', blockRouter)
app.use('/api/v1/notices', noticeRouter)
app.use('/api/v1/leases', leaseRouter)
app.use('/api/v1/utilities', utilitiesRouter)
app.use('/api/v1/extraCharges', extraChargeRouter)
app.use('/api/v1/invoices', invoiceRouter)
app.use('/api/v1/leads', leadRouter)
app.use('/api/v1/quotations', quotationRouter)
app.use('/api/v1/invoiceSettings', invoiceSettingRouter)
app.use('/api/v1/leadInvoices', leadInvoiceRouter)

app.use(globalErrorHandler);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
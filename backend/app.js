const createError = require('http-errors');
const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// to use the env file 
require('dotenv').config();
require('./models/modelsRelations');

const indexRouter = require('./routes/index');
const DB = require('./routes/sequilize_fetch');
const upload = require('./routes/uploadRoutes');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/userRoutes');
const projectsRouter = require('./routes/projectRoutes');
const projectMembersRouter = require('./routes/projectMemberRoutes');
const projectInviteRouter = require('./routes/projectInviteRoutes');
const taskRouter = require('./routes/taskRoutes');
const subTaskRouter = require('./routes/subTaskRoutes');
const resourceRouter = require('./routes/resourceRoutes');
const taskResourceRouter = require('./routes/taskResourceRoutes');
const notificationsRouter = require('./routes/notificationRoutes');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const verificationRouter = require('./routes/verificationRoutes');
const resetPasswordRouter = require('./routes/resetPasswordRoutes');
const staticsRouter = require('./routes/staticsRoutes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', authRouter);
app.use('/uploads', upload);
app.use('/db', DB);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/project-members', projectMembersRouter);
app.use('/invite', projectInviteRouter);
app.use('/tasks', taskRouter);
app.use('/sub-tasks', subTaskRouter);
app.use('/resources', resourceRouter);
app.use('/task-resources', taskResourceRouter);
app.use('/notifications', notificationsRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/verify', verificationRouter);
app.use('/reset-password', resetPasswordRouter);
app.use('/statics', staticsRouter);




//////////////////- Verify the MailSender -///////////////////
// const sendMail = require('./services/emailSender');
// sendMail("saadaouiy51@gmail.com", "verification", "verify your email", '<p>This is a <strong>test email</strong> sent via mailersend SMTP.</p>')
//   .then(() => {
//     console.log('Email sent successfully!');
//   })
//   .catch(error => {
//     console.log('Failed to send email.', error);
//   });

//////////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const adminRoutes = require('./src/routes/adminRoutes');
const registerRoutes = require('./src/routes/registerRoutes');
const loginRoutes = require('./src/routes/loginRoutes');
const userRoutes = require('./src/routes/userRoutes');
const commonRoutes = require('./src/routes/commonRoutes');
const physicianRoutes = require('./src/routes/physicianRoutes');
const staffRoutes = require('./src/routes/staffRoutes');

mongoose
  .connect(
    'mongodb+srv://maitexaSS:EPZh8v1m2U0thLE2@vproject.p2z0nmk.mongodb.net/Event_Management_System'
  )
  .then(() => {
    console.log('Database Connected');
  })
  .catch((error) => {
    console.log('Error:', error);
  });

app.use(express.static('./public'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use('/api', commonRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/physician', physicianRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);

app.get('/', (req, res) => {
  res.send('hello world');
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log('Server started on', PORT);
});

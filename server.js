const Express = require('express');
const app = new Express();
const path = require('path');
const ejs = require('ejs');
const axios = require('axios');
const queryString = require('query-string');
const jwt = require('jwt-simple');
const bodyParser = require('body-parser');

const { User } = require('./db/models.js');

try {
  Object.assign(process.env, require('./.env.js'));
} catch (err) {
  console.log(err);
}

app.use(bodyParser.json());
app.engine('html', ejs.renderFile);
app.use('/dist', Express.static(path.join(__dirname, 'dist')));

app.use('/api/places', require('./routes/places.js'));

app.get('/', (req, res, next) => {
  res.render(path.join(__dirname, 'dist/index.html'), {
    token: req.query.token
  });
});

app.get('/api/get_user/:token', (req, res, next) => {
  const decoded = jwt.decode(req.params.token, process.env.JWT_SECRET);

  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => res.send(user))
    .catch(err => next(err));
});

app.get('/api/github/auth', (req, res, next) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${
      process.env.GITHUB_CLIENT_ID
    }&redirect_uri=${process.env.GITHUB_CALLBACK_URI}`
  );
});

app.get('/api/github/callback', async (req, res, next) => {
  try {
    let response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code,
        redirect_uri: process.env.GITHUB_CALLBACK_URI
      }
    );

    const parsed = queryString.parse(response.data);

    const { error, access_token } = parsed;
    if (error) {
      throw { message: error };
    }

    response = await axios.get(
      `https://api.github.com/user?access_token=${access_token}`
    );

    let user = await User.findOne({
      where: {
        githubUserId: response.data.id
      }
    });

    if (!user) {
      user = await User.create({
        githubUserId: response.data.id,
        userName: response.data.login
      });
    }

    const token = jwt.encode({ id: user.id }, process.env.JWT_SECRET);

    res.redirect(`/?token=${token}`);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

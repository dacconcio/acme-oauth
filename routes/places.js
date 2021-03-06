var express = require('express')
var router = express.Router()
const { Place } = require('../db/models.js');


router.get('/', (req, res, next) => {
  Place.findAll()
    .then(places => res.send(places))
    .catch(err => next(err));
});
router.delete('/:id', (req, res, next) => {
  Place.findById(req.params.id)
    .then(place => place.destroy())
    .then(() => res.sendStatus(200))
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  Place.create({
    name: req.body.place.name,
    UserId: req.body.user.id,
  })
    .then(place => res.send(place))
    .catch(err => next(err));
});

module.exports = router

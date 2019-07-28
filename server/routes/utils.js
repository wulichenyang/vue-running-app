const resInfo = (res, data, message) => {
  res.json({
    code: 0,
    data,
    message
  })
}

const errInfo = (res, message) => {
  res.status(500).send({
    code: 1,
    message,
  })
}

module.exports = {
  resInfo,
  errInfo
}
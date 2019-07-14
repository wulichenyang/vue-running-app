// Convert trace array data to distance(km)
const mapTraceDataToDistance = (traceArr, AMap) => {
  console.log('mapTrace', traceArr)
  if(traceArr.length) {
    let lngLatArr = traceArr.map(position => {
      return new AMap.LngLat(position[0], position[1])
    })
    let distance = (
      AMap.GeometryUtil.distanceOfLine(lngLatArr) / 1000
    ).toFixed(2)
    console.log(distance + '公里')
    return distance
  } else {
    return (0).toFixed(2)
  }
}

export {
  mapTraceDataToDistance,
}
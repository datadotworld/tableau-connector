const analyticsEnabled = process.env.REACT_APP_ENABLE_ANALYTICS

const Analytics = {
  track (event, properties, options) {
    if (analyticsEnabled) {
      window.analytics.track.call(window.analytics, event, properties, options)
    }
  }
}

export default Analytics

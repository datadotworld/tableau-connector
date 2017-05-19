const analyticsEnabled = process.env.REACT_APP_ENABLE_ANALYTICS
const tableau = window.tableau

const Analytics = {
  track (event, properties, options) {
    if (analyticsEnabled) {
      window.analytics.track.call(window.analytics, event, properties, options)
    }
  },

  identify (token, properties, options) {
    if (analyticsEnabled && token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        const agent = decoded.sub.split(':')[1] // should be of the form 'prod-user-client:agentid'
        window.analytics.identify(agent)
      } catch (error) {
        tableau.log('There was an error decoding a JWT token')
        tableau.log(error)
      }
    }
  }
}

export default Analytics
